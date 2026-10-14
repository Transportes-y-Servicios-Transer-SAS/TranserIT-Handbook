/**
 * Saca de un HTML de archify las dos piezas que la página necesita para dibujar el diagrama
 * ELLA MISMA, sin marco incrustado:
 *
 *   1. el <svg>, que ya viene en línea con su viewBox
 *   2. las reglas de estilo que ese SVG usa, acotadas a un contenedor
 *
 * Por qué no se incrusta: un marco trae su propia cabecera, su propio selector de tema y su propio
 * desplazamiento dentro de una página que ya tiene los suyos. Se ve como una caja pegada encima del
 * texto, no como parte de la página.
 *
 * Por qué no se usa el exportador del visor: vive en el navegador, no en el CLI.
 *
 * Uso:  bun scripts/extraer-diagrama.mjs <entrada.html> <nombre>
 *       produce  docs/.vitepress/theme/diagramas/<nombre>.svg
 *                docs/.vitepress/theme/diagramas/<nombre>.css   (solo la primera vez útil: el CSS
 *                                                                es común, se escribe una vez)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const [entrada, nombre] = process.argv.slice(2)
if (!entrada || !nombre) {
  console.error('uso: bun scripts/extraer-diagrama.mjs <entrada.html> <nombre>')
  process.exit(1)
}

const html = readFileSync(entrada, 'utf8')

// ── 1. El SVG ────────────────────────────────────────────────────────────────
const ini = html.indexOf('<svg')
const fin = html.indexOf('</svg>', ini)
if (ini < 0 || fin < 0) {
  console.error('no se encontró un <svg> en', entrada)
  process.exit(1)
}
let svg = html.slice(ini, fin + '</svg>'.length)

// El visor pone el tema en el <html>; aquí el SVG tiene que poder vivir en los dos, así que las
// marcas de tema se quitan y el color lo deciden las variables heredadas de la página.
svg = svg.replace(/\sdata-theme="[^"]*"/g, '')

// ── 2. El estilo que el SVG necesita ─────────────────────────────────────────
// Se descarta todo lo que viste la APLICACIÓN —barra de herramientas, paneles, menús— y se queda
// lo que viste el DIBUJO. La lista es de exclusión y no de inclusión a propósito: si archify añade
// una clase nueva al dibujo, entra sola; si añade una de interfaz, se ve y se añade aquí.
const DE_LA_APLICACION = [
  'toolbar', 'diagram-nav', 'overview-map', 'focus-chip', 'node-finder', 'semantic-',
  'relationship-', 'route-', 'export-menu', 'preset-', 'motion-', 'rail-', 'header-row',
  'diagram-guide', 'pulse-dot', '.card', 'intent-trace', 'btn-', 'aria-live', 'sr-only',
]

const estilos = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')

/**
 * Las reglas dentro de `@media`, `@supports` y compañía se retiran ANTES de recorrer las planas.
 *
 * Sin esto, un recorrido por `selector { cuerpo }` saca las de dentro y las deja sueltas, fuera de
 * su condición. Se vio: la paleta de impresión de archify —fondo blanco, trazos oscuros— vive en
 * un `@media print`, y al quedar suelta pintaba el diagrama en claro dentro de la página oscura.
 */
function sinBloquesCondicionales(css) {
  let salida = ''
  let i = 0
  while (i < css.length) {
    const arroba = css.indexOf('@', i)
    if (arroba < 0) { salida += css.slice(i); break }
    const llave = css.indexOf('{', arroba)
    if (llave < 0) { salida += css.slice(i); break }
    salida += css.slice(i, arroba)
    let nivel = 1
    let j = llave + 1
    while (j < css.length && nivel > 0) {
      if (css[j] === '{') nivel++
      else if (css[j] === '}') nivel--
      j++
    }
    i = j
  }
  return salida
}

const reglas = []
// Un recorrido por bloques `selector { cuerpo }`, ya sin nada anidado.
for (const m of sinBloquesCondicionales(estilos).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim()
  const cuerpo = m[2].trim()
  if (!selector || !cuerpo) continue
  if (selector.startsWith('@')) continue // animaciones y consultas: se tratan aparte
  if (DE_LA_APLICACION.some((x) => selector.includes(x))) continue

  const acotado = selector
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      // Las variables de :root pasan al contenedor, para no teñir la página entera desde aquí.
      if (s === ':root' || s.startsWith(':root')) return s.replace(/^:root/, '.archify')
      if (s.startsWith('html') || s.startsWith('body')) return null
      // Un selector que empieza por atributo —[data-theme="light"]— describe AL PROPIO
      // contenedor, no a un descendiente suyo: se pega sin espacio o nunca casa.
      if (s.startsWith('[')) return `.archify${s}`
      return `.archify ${s}`
    })
    .filter(Boolean)
    .join(', ')

  if (acotado) reglas.push(`${acotado} { ${cuerpo} }`)
}

// Las animaciones se conservan tal cual: sus nombres son únicos de archify.
const animaciones = [...estilos.matchAll(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\}\s*)*\}/g)].map((m) => m[0])

const destino = join('docs', '.vitepress', 'theme', 'diagramas')
mkdirSync(destino, { recursive: true })
writeFileSync(join(destino, `${nombre}.svg`), svg, 'utf8')
writeFileSync(
  join(destino, `${nombre}.css`),
  `/* Generado por scripts/extraer-diagrama.mjs desde ${entrada}. No se edita a mano. */\n\n` +
    animaciones.join('\n') +
    '\n\n' +
    reglas.join('\n'),
  'utf8',
)

console.log(`  ${nombre}.svg  ${(svg.length / 1024).toFixed(1)} KB`)
console.log(`  ${nombre}.css  ${reglas.length} reglas, ${animaciones.length} animaciones`)
