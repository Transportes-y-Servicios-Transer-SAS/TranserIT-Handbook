import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Diagrama from './Diagrama.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Diagrama', Diagrama)
  },
} satisfies Theme
