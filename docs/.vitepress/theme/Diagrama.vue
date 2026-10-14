<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

import ramaSvg from './diagramas/rama.svg?raw'
import './diagramas/rama.css'

/**
 * Dibuja un diagrama de archify DENTRO de la página.
 *
 * No es un marco incrustado, y la diferencia se nota: un marco trae su propia cabecera, su propio
 * selector de tema y su propio desplazamiento, dentro de una página que ya tiene los suyos. Se ve
 * como una caja pegada encima del texto. Aquí el SVG es parte del documento: hereda su tipografía,
 * su tema y su ancho, y se puede seleccionar el texto de dentro.
 *
 * El SVG y su hoja de estilo los produce `scripts/extraer-diagrama.mjs` desde el HTML que genera
 * archify. La fuente sigue siendo el JSON de `diagramas/`.
 *
 * El tema se pasa en `data-theme` sobre el contenedor porque archify nombra así sus dos paletas, y
 * VitePress marca el suyo con una clase en `<html>`. Este atributo es el puente entre los dos.
 */
const props = defineProps<{
  /** Cuál de los diagramas extraídos. */
  nombre: 'rama'
  /** Descripción para quien no lo ve. Obligatoria: es información, no adorno. */
  titulo: string
}>()

const fuentes: Record<string, string> = { rama: ramaSvg }

const { isDark } = useData()
const tema = computed(() => (isDark.value ? 'dark' : 'light'))
const svg = computed(() => fuentes[props.nombre] ?? '')
</script>

<template>
  <figure class="archify" :data-theme="tema" :aria-label="titulo">
    <!-- eslint-disable-next-line vue/no-v-html -- el SVG lo genera nuestro propio guion -->
    <div class="archify-lienzo" v-html="svg" />
  </figure>
</template>

<style scoped>
.archify {
  margin: 2.25rem 0;
  padding: 1.25rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  /* La trama de puntos es de archify: aquí el fondo lo pone la página para que el diagrama no
     parezca una lámina pegada, sino parte del documento. */
  background:
    radial-gradient(circle at 1px 1px, var(--vp-c-divider) 1px, transparent 1.4px) 0 0 / 20px 20px,
    var(--vp-c-bg-soft);
}
.archify-lienzo :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}
</style>
