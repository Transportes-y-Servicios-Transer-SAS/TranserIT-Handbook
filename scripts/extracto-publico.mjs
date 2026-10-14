/**
 * Produce el EXTRACTO PÚBLICO del manual, en una carpeta aparte.
 *
 * Por qué existe: GitHub Pages solo sirve sitios desde repositorios públicos con el plan actual, y
 * el manual completo no puede serlo — nombra repositorios, ambientes, compuertas, el bloqueo de la
 * red corporativa y el estado de la autenticación de Vórtice.
 *
 * Qué sale, y por qué solo eso. Medido sobre las siete partes de Git, contando menciones a
 * repositorios, ADR, archivos internos y comandos de compuerta:
 *
 *     1 · qué es ............  0        7 · deshacer .........  1
 *     2 · flujo básico ......  1        3 · ramas ............  9
 *                                       4 · nuestra estructura  8
 *                                       6 · conflictos ....... 10
 *                                       5 · el día a día ..... 21
 *
 * Salen las tres de la izquierda. Son además las que sirven para lo que esta publicación busca:
 * comprobar si el manual se entiende empezando de cero.
 *
 * La fuente sigue siendo una sola. Este guion no edita el manual: copia lo que sale a `publico/`.
 *
 * Uso:  bun scripts/extracto-publico.mjs
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DESTINO = 'publico'

/** Las páginas que salen, con el diagrama que usa cada una. */
const PAGINAS = [
  { ruta: 'git/que-es.md', titulo: '1 · Qué es y qué problema resuelve' },
  { ruta: 'git/flujo-basico.md', titulo: '2 · El flujo básico' },
  { ruta: 'git/deshacer.md', titulo: '3 · Deshacer' },
]

/** Solo los visores que esas tres páginas abren. El resto no se copia. */
const DIAGRAMAS = ['historia', 'rama', 'estados', 'deshacer']

/**
 * Enlaces a páginas que no salen. Se convierten en texto plano.
 *
 * No se dejan como enlaces rotos ni se ignoran con `ignoreDeadLinks`: un enlace que lleva a un 404
 * es peor que no tenerlo, y apagar la comprobación de enlaces rotos apaga también las que sí
 * importan.
 */
const ENLACES_FUERA = [
  // No solo enlaces: también lo que nombra nuestras ramas largas. La regla no cambia de sentido
  // sin esos nombres, y así el extracto no dice cómo se llama nada de dentro.
  [
    /\*\*En una rama larga —`develop`, `test`, `master`— es la única opción\.\*\*/g,
    '**En una rama compartida —una de las que no son solo tuyas— es la única opción.**',
  ],
  [/\[llaves de GitHub\]\(\/equipo\/llaves\)/g, 'llaves de GitHub'],
  [/\[preparar el equipo\]\(\/equipo\/llaves\)/g, 'la parte del manual que prepara el equipo'],
  [/\[(.+?)\]\(\/(?:equipo|vortice)\/[a-z-]+\)/g, '$1'],
  [/\[(.+?)\]\(\/git\/(?:ramas|estructura|dia-a-dia|conflictos)\)/g, '$1'],
]

// ── Punto de partida limpio ──────────────────────────────────────────────────
rmSync(DESTINO, { recursive: true, force: true })
mkdirSync(join(DESTINO, 'docs', 'git'), { recursive: true })
mkdirSync(join(DESTINO, 'docs', '.vitepress'), { recursive: true })

// ── El tema, tal cual: es común y no lleva contenido ─────────────────────────
cpSync(join('docs', '.vitepress', 'theme'), join(DESTINO, 'docs', '.vitepress', 'theme'), {
  recursive: true,
})

// ── Los visores de los diagramas que sí salen ────────────────────────────────
mkdirSync(join(DESTINO, 'docs', 'public', 'diagramas'), { recursive: true })
for (const d of DIAGRAMAS) {
  const origen = join('docs', 'public', 'diagramas', `${d}.html`)
  if (!existsSync(origen)) {
    console.error(`falta el visor de ${d}: ejecuta antes "bun run diagramas"`)
    process.exit(1)
  }
  cpSync(origen, join(DESTINO, 'docs', 'public', 'diagramas', `${d}.html`))
}

// Y se retiran del tema los SVG de los que no salen, para que no viajen en el paquete.
const dirSvg = join(DESTINO, 'docs', '.vitepress', 'theme', 'diagramas')
for (const f of (await import('node:fs')).readdirSync(dirSvg)) {
  if (f.endsWith('.svg') && !DIAGRAMAS.includes(f.replace('.svg', ''))) {
    rmSync(join(dirSvg, f))
  }
}

// ── Las páginas ──────────────────────────────────────────────────────────────
for (const { ruta } of PAGINAS) {
  let texto = readFileSync(join('docs', ruta), 'utf8')
  for (const [patron, reemplazo] of ENLACES_FUERA) texto = texto.replace(patron, reemplazo)
  writeFileSync(join(DESTINO, 'docs', ruta), texto, 'utf8')
}

// ── La portada, que aquí dice otra cosa ──────────────────────────────────────
writeFileSync(
  join(DESTINO, 'docs', 'index.md'),
  `---
layout: home

hero:
  name: Git, de cero
  text: Para quien nunca lo ha usado
  tagline: "Tres partes del manual técnico del área de IT de Transer, publicadas para revisión."
  actions:
    - theme: brand
      text: Empezar
      link: /git/que-es
    - theme: alt
      text: Qué es esto
      link: "#que-es-esto"

features:
  - title: 1 · Qué es Git
    details: "Qué problema resuelve, con cuatro ideas y cero comandos. Escrita para entender, no para ejecutar."
    link: /git/que-es
    linkText: Leer
  - title: 2 · El flujo básico
    details: "Los primeros comandos, con una carpeta de práctica donde nada sale de tu equipo."
    link: /git/flujo-basico
    linkText: Leer
  - title: 3 · Deshacer
    details: "Qué comando deshace lo tuyo según hasta dónde llegó. Empieza por un árbol de decisión."
    link: /git/deshacer
    linkText: Leer
---

<div class="inicio">

## Qué es esto

Un **extracto** del manual técnico del área de IT de Transportes y Servicios Transer S.A.S.

El manual completo tiene catorce páginas en tres secciones —Git, preparar el equipo y el proyecto
Vórtice— y vive en un repositorio interno. Aquí están **las tres partes que no dependen de saber
nada de la empresa**, publicadas para que puedan revisarse sin pedir accesos.

**La primera no trae un solo comando**, y es a propósito: está escrita para que alguien que nunca ha
usado Git entienda de qué habla el equipo cuando dice que «subió un cambio».

**Los diagramas se abren.** Pulsa cualquiera para explorarlo a pantalla completa.

</div>

<style scoped>
.inicio {
  max-width: 1152px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
}
.inicio h2 {
  margin: 2.5rem 0 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 1.5rem;
  font-weight: 600;
}
.inicio p {
  line-height: 1.75;
}
</style>
`,
  'utf8',
)

// ── La configuración, reducida ───────────────────────────────────────────────
const items = PAGINAS.map(
  (p) => `            { text: '${p.titulo}', link: '/${p.ruta.replace('.md', '')}' },`,
).join('\n')

writeFileSync(
  join(DESTINO, 'docs', '.vitepress', 'config.mts'),
  `import { defineConfig } from 'vitepress'

// Generado por scripts/extracto-publico.mjs. No se edita a mano.
export default defineConfig({
  lang: 'es-CO',
  title: 'Git, de cero',
  description: 'Tres partes del manual técnico del área de IT de Transer',
  base: process.env.BASE_URL ?? '/',
  ignoreDeadLinks: false,
  lastUpdated: true,
  cleanUrls: true,

  head: [['meta', { name: 'robots', content: 'noindex' }]],

  themeConfig: {
    outline: false,
    nav: [{ text: 'Git, de cero', link: '/git/que-es' }],
    sidebar: {
      '/git/': [
        {
          text: 'Git, de cero',
          items: [
${items}
          ],
        },
      ],
    },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    lastUpdatedText: 'Última revisión',
    darkModeSwitchLabel: 'Apariencia',
    returnToTopLabel: 'Volver arriba',
    sidebarMenuLabel: 'Contenido',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
          modal: {
            displayDetails: 'Ver detalles',
            resetButtonTitle: 'Limpiar',
            backButtonTitle: 'Cerrar',
            noResultsText: 'Sin resultados para',
            footer: { selectText: 'seleccionar', navigateText: 'navegar', closeText: 'cerrar' },
          },
        },
      },
    },
    footer: {
      message: 'Área de IT · Transportes y Servicios Transer S.A.S.',
      copyright: 'Extracto del manual interno',
    },
  },
})
`,
  'utf8',
)

const PROHIBIDO = [
  'vortice-backend',
  'vortice-frontend',
  'vortice-specs',
  'mvnw',
  'acceptance-criteria',
  'verify-reference-module',
  'contract/openapi',
  '5411-G2',
  'TranserIT-Architecture',
]

// ── El manifiesto, sin el pipeline de diagramas ──────────────────────────────
const manifiesto = JSON.parse(readFileSync('package.json', 'utf8'))
writeFileSync(
  join(DESTINO, 'package.json'),
  JSON.stringify(
    {
      name: 'transerit-handbook-publico',
      version: manifiesto.version,
      private: true,
      description: 'Extracto público del manual del área de IT de Transer',
      type: 'module',
      engines: manifiesto.engines,
      scripts: {
        dev: 'vitepress dev docs',
        build: 'vitepress build docs',
        preview: 'vitepress preview docs',
      },
      devDependencies: manifiesto.devDependencies,
    },
    null,
    2,
  ) + '\n',
  'utf8',
)

cpSync('bun.lock', join(DESTINO, 'bun.lock'))

writeFileSync(join(DESTINO, '.gitignore'), 'node_modules/\ndocs/.vitepress/dist/\ndocs/.vitepress/cache/\n', 'utf8')

// ── El flujo que publica, y el leeme ─────────────────────────────────────────
// Se generan aquí y no se escriben a mano en el repositorio público: ese repositorio se recrea
// entero en cada generación, así que lo que se edite allí se pierde en la siguiente.
mkdirSync(join(DESTINO, '.github', 'workflows'), { recursive: true })
writeFileSync(
  join(DESTINO, '.github', 'workflows', 'publicar.yml'),
  `# Construye el extracto y lo publica en GitHub Pages.
#
# Este repositorio NO es la fuente del manual: lo genera un guion desde el repositorio interno, que
# es donde se escribe. Aquí solo se construye y se sirve.
name: Publicar

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  construir:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - uses: actions/configure-pages@v5
      - run: bun run build
        env:
          BASE_URL: /manual-git/
      - name: Comprobar que se construyó algo
        # Un despliegue vacío sale en verde y deja el sitio en blanco. Se mira antes de subir.
        run: |
          test -f docs/.vitepress/dist/index.html || { echo "No hay index.html"; exit 1; }
          paginas=$(find docs/.vitepress/dist -name '*.html' -not -path '*/diagramas/*' | wc -l)
          echo "Páginas: $paginas"
          test "$paginas" -ge 4 || { echo "Faltan páginas"; exit 1; }
      # NO hay aquí una comprobación de fugas, y es deliberado: la lista de lo que no puede salir
      # es ella misma algo que no puede salir. Ese control vive en el generador, dentro del
      # repositorio interno, que es donde está la información y donde se decide qué sale.
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  publicar:
    needs: construir
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.despliegue.outputs.page_url }}
    steps:
      - id: despliegue
        uses: actions/deploy-pages@v4
`,
  'utf8',
)

writeFileSync(
  join(DESTINO, 'README.md'),
  `# Git, de cero

Tres partes del **manual técnico del área de IT de Transportes y Servicios Transer S.A.S.**,
publicadas para que puedan revisarse sin pedir accesos.

| | |
|---|---|
| **1 · Qué es Git y qué problema resuelve** | Cuatro ideas y **cero comandos**. Escrita para entender, no para ejecutar |
| **2 · El flujo básico** | Los primeros comandos, con una carpeta de práctica donde nada sale de tu equipo |
| **3 · Deshacer** | Qué comando deshace lo tuyo según hasta dónde llegó |

## Esto es un extracto, y no es la fuente

El manual completo tiene catorce páginas en tres secciones y vive en un repositorio interno, que es
donde se escribe.

**Aquí no se edita nada.** El contenido lo genera un guion desde ese repositorio, seleccionando solo
las partes que no dependen de saber nada de la empresa. **Un cambio hecho aquí se perdería en la
siguiente generación**, porque este repositorio se recrea entero.

## Levantarlo

**Solo bun.**

\`\`\`bash
bun install
bun run dev
\`\`\`

---

*Área de IT · Transportes y Servicios Transer S.A.S.*
`,
  'utf8',
)

// ── Comprobación: que no se cuele nada de dentro ─────────────────────────────

let sucio = 0
const { readdirSync, statSync } = await import('node:fs')
function recorrer(dir) {
  for (const f of readdirSync(dir)) {
    const ruta = join(dir, f)
    if (statSync(ruta).isDirectory()) {
      recorrer(ruta)
      continue
    }
    // Todos los archivos de texto, no una lista de extensiones: la primera fuga real apareció en
    // un .yml, que no estaba en la lista. Enumerar extensiones es decidir dónde NO mirar.
    if (/\.(html|svg|woff2?|png|jpe?g|ico|lock)$/.test(f)) continue
    const texto = readFileSync(ruta, 'utf8')
    for (const p of PROHIBIDO) {
      if (texto.includes(p)) {
        console.error(`  FUGA: "${p}" en ${ruta}`)
        sucio++
      }
    }
  }
}
recorrer(DESTINO)

if (sucio) {
  console.error(`\n${sucio} fuga(s). El extracto NO está listo para publicarse.`)
  process.exit(1)
}

console.log(`  ${PAGINAS.length} páginas · ${DIAGRAMAS.length} diagramas · sin fugas`)
console.log(`  listo en ./${DESTINO}`)
