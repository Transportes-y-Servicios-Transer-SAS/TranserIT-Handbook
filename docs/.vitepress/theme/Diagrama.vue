<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'

import './diagramas/estilos.css'

/**
 * Un diagrama de archify, en dos piezas con dos trabajos distintos.
 *
 *   EN LA PÁGINA   el SVG, dibujado dentro del documento. Hereda tema, ancho y tipografía, así que
 *                  es una ilustración y no una lámina pegada. No tiene interactividad: eso lo da el
 *                  JavaScript del visor, que aquí no viene.
 *
 *   EN EL DIÁLOGO  el visor completo, a pantalla casi completa. Ahí SÍ tiene sentido su propia
 *                  cabecera y sus controles, porque ocupa toda la atención: foco por nodo, lente,
 *                  rutas, mapa, exportar.
 *
 * Esa división resuelve lo que ninguna de las dos formas lograba sola: incrustado en el flujo del
 * texto, el visor se veía apretado y con dos temas peleando; en línea y sin más, el dibujo perdía
 * todo lo que lo hacía explorable.
 *
 * Las dos piezas las produce `bun run diagramas` desde `diagramas/*.json`.
 */
const props = defineProps<{
  /** El nombre del JSON de origen, sin el tipo ni la extensión. */
  nombre: string
  /** Descripción para quien no lo ve. Obligatoria: es información, no adorno. */
  titulo: string
}>()

// Se recogen solos: añadir un JSON a `diagramas/` y volver a generar basta, sin tocar este archivo.
const fuentes = import.meta.glob<string>('./diagramas/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const { isDark } = useData()
const tema = computed(() => (isDark.value ? 'dark' : 'light'))
const svg = computed(() => fuentes[`./diagramas/${props.nombre}.svg`] ?? '')

const dialogo = ref<HTMLDialogElement | null>(null)
const abierto = ref(false)

/** La dirección solo se calcula al abrir: así el visor no se descarga con la página. */
const url = computed(() =>
  abierto.value ? `/diagramas/${props.nombre}.html?theme=${tema.value}` : '',
)

function abrir() {
  abierto.value = true
  // En el mismo tic el <dialog> todavía no tiene su contenido; se espera al siguiente cuadro.
  requestAnimationFrame(() => dialogo.value?.showModal())
}

function cerrar() {
  dialogo.value?.close()
}

/** `close` cubre la tecla de escape cuando el foco todavía no entró al visor. */
function alCerrar() {
  abierto.value = false
}

onBeforeUnmount(() => dialogo.value?.close())
</script>

<template>
  <figure class="dg">
    <button class="dg-vista" type="button" :aria-label="`Abrir el diagrama: ${titulo}`" @click="abrir">
      <span class="dg-lienzo archify" :data-theme="tema">
        <!-- eslint-disable-next-line vue/no-v-html -- lo genera nuestro propio guion -->
        <span class="dg-svg" v-html="svg" />
      </span>
      <span class="dg-llamada">
        <span class="dg-lupa" aria-hidden="true">⤢</span>
        Pulsa para explorarlo
      </span>
    </button>

    <figcaption>
      <strong>{{ titulo }}</strong>
    </figcaption>

    <dialog ref="dialogo" class="dg-dialogo" @close="alCerrar" @click.self="cerrar">
      <div class="dg-dialogo-barra">
        <span class="dg-dialogo-titulo">{{ titulo }}</span>
        <!--
          Dentro del visor, `Escape` lo atiende archify —cierra sus propios paneles— y no llega al
          diálogo. Se dice, en vez de dejar que la tecla parezca rota.
        -->
        <span class="dg-dialogo-pista">Esc cierra los paneles del visor</span>
        <button type="button" @click="cerrar">Cerrar ✕</button>
      </div>
      <iframe v-if="abierto" :src="url" :title="titulo" />
    </dialog>
  </figure>
</template>

<style scoped>
.dg {
  margin: 2.25rem 0;
}

/* La vista previa es un botón entero: toda la superficie invita, no solo un enlace al pie. */
.dg-vista {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: transparent;
  cursor: zoom-in;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.dg-vista:hover,
.dg-vista:focus-visible {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
  outline: none;
}

.dg-lienzo {
  display: block;
  padding: 1.25rem 1rem 0.5rem;
  border-radius: 11px 11px 0 0;
  /* La trama de puntos es la de archify, con la variable de la paleta compartida. */
  background:
    radial-gradient(circle at 1px 1px, var(--ar-punto) 1px, transparent 1.4px) 0 0 / 20px 20px,
    var(--vp-c-bg-soft);
}
.dg-svg :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.dg-llamada {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem 0.65rem;
  border-top: 1px solid var(--vp-c-divider);
  border-radius: 0 0 11px 11px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  font-weight: 600;
}
.dg-lupa {
  font-size: 1rem;
  line-height: 1;
}

.dg > figcaption {
  margin-top: 0.6rem;
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
  line-height: 1.6;
}
.dg > figcaption strong {
  font-weight: 500;
}

/* ── El diálogo ── */
.dg-dialogo {
  width: min(1400px, 94vw);
  height: min(900px, 90vh);
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  overflow: hidden;
}
.dg-dialogo::backdrop {
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(2px);
}
.dg-dialogo-barra {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0.75rem 0.6rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.dg-dialogo-titulo {
  flex: 1;
  min-width: 0;
}
.dg-dialogo-pista {
  flex: none;
  color: var(--vp-c-text-3);
  font-size: 0.74rem;
}
.dg-dialogo-barra button {
  flex: none;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.dg-dialogo-barra button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.dg-dialogo iframe {
  display: block;
  width: 100%;
  height: calc(100% - 2.6rem);
  border: 0;
}

@media (max-width: 640px) {
  .dg-dialogo-pista {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dg-vista {
    transition: none;
  }
}
</style>
