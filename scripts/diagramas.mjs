/**
 * De los JSON de `diagramas/` a lo que el sitio necesita, en un solo comando.
 *
 * Por cada `diagramas/<nombre>.<tipo>.json` produce DOS cosas, porque un diagrama tiene dos
 * trabajos distintos en la página:
 *
 *   docs/public/diagramas/<nombre>.html          el visor completo de archify, que se abre en el
 *                                                diálogo: foco por nodo, lente, rutas, mapa
 *   docs/.vitepress/theme/diagramas/<nombre>.svg la vista previa, dibujada DENTRO del documento,
 *                                                que hereda tema, ancho y tipografía
 *
 * Y un solo `estilos.css` para todas: las reglas de archify son casi las mismas entre tipos
 * —medido: de 207 y 196 reglas, 176 coinciden—, así que un archivo por diagrama repetiría unos
 * 36 KB por cada uno que se añada. Se acumulan deduplicadas.
 *
 * Uso:  bun run diagramas
 *
 * archify no se publica en npm —el paquete con ese nombre es otro proyecto— y su repositorio es
 * privado en el sentido de npm, así que no puede ser una dependencia. Se clona al lado:
 *
 *   git clone https://github.com/tt-a1i/archify.git ../archify
 *
 * o se apunta con ARCHIFY_HOME a donde esté.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'

// ── Dónde está archify ───────────────────────────────────────────────────────
const CANDIDATOS = [
  process.env.ARCHIFY_HOME && join(process.env.ARCHIFY_HOME, 'archify', 'bin', 'archify.mjs'),
  process.env.ARCHIFY_HOME && join(process.env.ARCHIFY_HOME, 'bin', 'archify.mjs'),
  resolve('..', 'archify', 'archify', 'bin', 'archify.mjs'),
].filter(Boolean)

const cli = CANDIDATOS.find((p) => existsSync(p))
if (!cli) {
  console.error(
    'No se encontró archify. Clónalo al lado del manual:\n' +
      '  git clone https://github.com/tt-a1i/archify.git ../archify\n' +
      'o exporta ARCHIFY_HOME con la ruta donde esté.',
  )
  process.exit(1)
}

// ── Qué estilos son del DIBUJO y cuáles de la APLICACIÓN ─────────────────────
// La lista es de exclusión y no de inclusión a propósito: si archify añade una clase nueva al
// dibujo, entra sola; si añade una de interfaz, se ve y se añade aquí.
const DE_LA_APLICACION = [
  'toolbar', 'diagram-nav', 'overview-map', 'focus-chip', 'node-finder', 'semantic-',
  'relationship-', 'route-', 'export-menu', 'preset-', 'motion-', 'rail-', 'header-row',
  'diagram-guide', 'pulse-dot', '.card', 'intent-trace', 'btn-', 'aria-live', 'sr-only',
]

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

/** Saca de un HTML de archify el `<svg>` en línea, sin su marca de tema. */
function extraerSvg(html, origen) {
  const ini = html.indexOf('<svg')
  const fin = html.indexOf('</svg>', ini)
  if (ini < 0 || fin < 0) {
    console.error('no se encontró un <svg> en', origen)
    process.exit(1)
  }
  // El visor pone el tema en el <html>; aquí el SVG tiene que poder vivir en los dos, así que las
  // marcas de tema se quitan y el color lo deciden las variables heredadas de la página.
  return html.slice(ini, fin + '</svg>'.length).replace(/\sdata-theme="[^"]*"/g, '')
}

/**
 * Parte una lista de selectores por sus comas DE NIVEL SUPERIOR.
 *
 * Un `split(',')` a secas parte también dentro de `:is(…)`, `:not(…)` y `[attr="a,b"]`. Se vio con
 * `html:is([data-reader-rail="true"], [data-reader-rail="overlay"]) .node-outline`: el segundo
 * trozo salía como `[data-reader-rail="overlay"]) .node-outline`, con un paréntesis sin abrir, y
 * el minificador del sitio lo rechazaba.
 */
function separarSelectores(lista) {
  const trozos = []
  let actual = ''
  let parentesis = 0
  let corchetes = 0
  let comilla = ''
  for (const c of lista) {
    if (comilla) {
      if (c === comilla) comilla = ''
    } else if (c === '"' || c === "'") comilla = c
    else if (c === '(') parentesis++
    else if (c === ')') parentesis--
    else if (c === '[') corchetes++
    else if (c === ']') corchetes--
    else if (c === ',' && parentesis === 0 && corchetes === 0) {
      trozos.push(actual)
      actual = ''
      continue
    }
    actual += c
  }
  trozos.push(actual)
  return trozos.map((s) => s.trim()).filter(Boolean)
}

/** Acota las reglas del dibujo a `.archify`, para que no tiñan la página. */
function extraerReglas(html, reglas, animaciones) {
  const estilos = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')

  for (const m of sinBloquesCondicionales(estilos).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim()
    const cuerpo = m[2].trim()
    if (!selector || !cuerpo) continue
    if (selector.startsWith('@')) continue // animaciones y consultas: se tratan aparte
    if (DE_LA_APLICACION.some((x) => selector.includes(x))) continue

    const acotado = separarSelectores(selector)
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

    // Red de seguridad: un selector desbalanceado es una señal de que algo se partió mal, y es
    // preferible perder una regla a enviar CSS roto al sitio.
    if (!acotado) continue
    const abre = (acotado.match(/[([]/g) ?? []).length
    const cierra = (acotado.match(/[)\]]/g) ?? []).length
    if (abre !== cierra) {
      console.warn(`  · selector descartado por desbalance: ${acotado.slice(0, 70)}`)
      continue
    }
    reglas.add(`${acotado} { ${cuerpo} }`)
  }

  // Las animaciones se conservan tal cual: sus nombres son únicos de archify.
  for (const k of estilos.matchAll(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\}\s*)*\}/g)) animaciones.add(k[0])
}

// ── El recorrido ─────────────────────────────────────────────────────────────
const ORIGEN = 'diagramas'
const VISOR = join('docs', 'public', 'diagramas')
const TEMA = join('docs', '.vitepress', 'theme', 'diagramas')

mkdirSync(VISOR, { recursive: true })
mkdirSync(TEMA, { recursive: true })

const entradas = readdirSync(ORIGEN)
  .filter((f) => f.endsWith('.json'))
  .map((f) => {
    const [nombre, tipo] = f.replace(/\.json$/, '').split('.')
    return { archivo: join(ORIGEN, f), nombre, tipo }
  })

if (!entradas.length) {
  console.error(`no hay diagramas en ${ORIGEN}/`)
  process.exit(1)
}

const reglas = new Set()
const animaciones = new Set()

for (const { archivo, nombre, tipo } of entradas) {
  const salida = join(VISOR, `${nombre}.html`)
  execFileSync(process.execPath, [cli, 'render', tipo, archivo, salida, '--quality', 'showcase'], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })

  const html = readFileSync(salida, 'utf8')
  const svg = extraerSvg(html, salida)
  writeFileSync(join(TEMA, `${nombre}.svg`), svg, 'utf8')
  extraerReglas(html, reglas, animaciones)

  console.log(`  ${nombre}  (${tipo})  visor ${(html.length / 1024).toFixed(0)} KB · vista ${(svg.length / 1024).toFixed(1)} KB`)
}

writeFileSync(
  join(TEMA, 'estilos.css'),
  `/* Generado por scripts/diagramas.mjs desde ${entradas.length} diagrama(s). No se edita a mano. */\n\n` +
    [...animaciones].join('\n') +
    '\n\n' +
    [...reglas].join('\n'),
  'utf8',
)

console.log(`  estilos.css  ${reglas.size} reglas, ${animaciones.size} animaciones`)
