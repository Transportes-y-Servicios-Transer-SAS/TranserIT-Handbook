import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Diagrama from './Diagrama.vue'
import './paleta.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Diagrama', Diagrama)
  },
} satisfies Theme
