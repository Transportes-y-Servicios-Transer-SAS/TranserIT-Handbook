import { defineConfig } from 'vitepress'

/**
 * El manual del área de IT de Transer.
 *
 * La barra lateral se escribe a mano y NO se genera del árbol de archivos: el orden de lectura
 * es una decisión —de lo que todos necesitan a lo que solo necesita quien deriva— y generarla
 * la dejaría en orden alfabético, que no significa nada.
 *
 * `base` sale de una variable de entorno porque el sitio se sirve en la raíz de su contenedor,
 * pero en GitHub Pages viviría bajo el nombre del repositorio. Dejarlo fijo rompe uno de los dos.
 */
export default defineConfig({
  lang: 'es-CO',
  title: 'Manual de IT',
  description: 'Cómo trabaja el área de IT de Transer',
  base: process.env.BASE_URL ?? '/',

  // Un enlace roto es una promesa incumplida, y en un manual de incorporación se nota más.
  // Falla la construcción en vez de llegar al sitio.
  ignoreDeadLinks: false,

  lastUpdated: true,
  cleanUrls: true,

  head: [['meta', { name: 'theme-color', content: '#1f6f54' }]],

  themeConfig: {
    // Sin índice lateral derecho: con la barra de la izquierda eran dos columnas de
    // navegación estrujando una de texto, y estas páginas no son tan largas.
    outline: false,

    nav: [
      { text: 'Git, de cero', link: '/git/que-es' },
      { text: 'Sobre este manual', link: '/sobre' },
    ],

    sidebar: {
      '/git/': [
        {
          text: 'Git, de cero',
          items: [
            { text: '1 · Qué es y qué problema resuelve', link: '/git/que-es' },
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
            footer: {
              selectText: 'seleccionar',
              navigateText: 'navegar',
              closeText: 'cerrar',
            },
          },
        },
      },
    },

    footer: {
      message: 'Área de IT · Transportes y Servicios Transer S.A.',
      copyright: 'Documento interno',
    },
  },
})
