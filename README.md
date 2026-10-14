# TranserIT-Handbook

El manual técnico del **área de IT de Transer**: control de versiones, proceso de trabajo y entornos.
**No es de un proyecto**, aunque los ejemplos salgan de los que hay en marcha.

## Por qué existe

Había un manual de Git de 416 líneas, bien escrito, y **daba por sabido lo que venía a enseñar**. No era
un problema de calidad: el manual abre con *«todo se ejecuta en PowerShell»* y la tabla de ramas, así
que para entender su primer párrafo ya había que saber qué es un repositorio, una rama, una solicitud
de cambio y una fusión.

> **Era un cómo-se-hace para quien va a teclear. Faltaba el qué-es para quien va a entender.**

Hacerlo «más fácil» no lo arreglaba, porque no sobraba dificultad: faltaba el documento anterior.

## Levantarlo

**Solo bun.** No se usa npm ni pnpm; el bloqueo es `bun.lock`.

```bash
bun install
bun run dev        # regenera los diagramas y levanta el servidor de desarrollo
bun run build      # regenera los diagramas y genera docs/.vitepress/dist
bun run preview    # sirve lo construido
bun run diagramas  # solo los diagramas
```

## Qué hay hoy

| | Estado |
|---|---|
| **Git · 1 · Qué es y qué problema resuelve** | Escrito. **Cero comandos**, a propósito |
| **Git · 2 · El flujo básico** | Escrito. Los primeros comandos, con una carpeta de práctica |
| **Git · 3 · Ramas** | Escrito. Qué es una rama de verdad, y el primer comando que sale del equipo |
| **Git · 4 · Nuestra estructura** | Escrito. Tres ramas largas, dos direcciones, y por qué |
| **Git · 5 · El día a día** | Escrito. La rutina, el orden de la entrega y la compuerta de cada repositorio |
| **Git · 6 · Conflictos** | Escrito. Incluidos los dos archivos con regla propia de fusión |
| **Git · 7 · Deshacer** | Escrito. El árbol de decisión según hasta dónde llegó el cambio |
| Cómo trabaja el área | Pendiente. Sale del `ONBOARDING.md` de `vortice-specs` y de las *skills* |
| Entornos | Pendiente. Son los manuales que hoy viven en el área de análisis |

**Las páginas se anuncian en el índice cuando existen, no antes.** Un índice que promete lo que no
hay enseña a no confiar en el índice.

## Dos reglas de contenido

**1 · El sitio explica el proceso; las *skills* siguen siendo la norma.** Aquí se responde *cuándo* y
*por qué* se usa cada cosa, y se remite al repositorio donde está el *cómo*. Si este sitio repitiera
lo que dice una *skill*, sería una copia más que se desvía — el defecto que más veces hemos
encontrado en este proyecto.

**2 · La primera parte de cada bloque no trae comandos.** Es lo que la hace legible para quien no va
a ejecutar nada, que es justo el lector que falló la vez anterior.

## Decisiones tomadas

| | |
|---|---|
| **VitePress y no Nuxt** | Markdown entra, sitio sale. Los manuales a migrar ya son markdown. Nuxt traería servidor, enrutado y ciclo de vida que una documentación no necesita |
| **VitePress 1.x** | La 2.0 está en alpha |
| **Sin la marca de Vórtice** | El público es el área entera, de gerencia a practicante, no un proyecto |
| **Ningún diagrama se dibuja a mano** | Todo lo que es un diagrama sale de archify. Lo que no es un diagrama —una comparación de dos ideas, «guardar» frente a «*commit*»— es una tabla, no un dibujo: se lee igual, se busca, y no hay SVG que mantener |
| **La paleta del sitio es la de archify** | Si la página usa los grises de VitePress y el diagrama los de archify, se ven dos documentos superpuestos. Con una sola paleta el diagrama es una ilustración de la página y no una lámina encima. Está en `theme/paleta.css`, sacada del preset «classic» |
| **Vista previa en la página, visor en un diálogo** | El SVG en línea hereda tema, ancho y tipografía, pero no lleva JavaScript: no es explorable. El visor completo sí lo es, pero incrustado en el texto se ve apretado y con dos temas peleando. Se dan los dos |

## Los diagramas

Se generan con [archify](https://github.com/tt-a1i/archify). **La fuente es el JSON de
`diagramas/`**; todo lo demás es resultado.

archify no está en el registro con ese nombre —el paquete «archify» de npm es otro proyecto— y su
repositorio no es instalable como dependencia, así que se clona al lado:

```bash
git clone https://github.com/tt-a1i/archify.git ../archify   # o apuntar ARCHIFY_HOME
bun run diagramas                                            # regenera los dos resultados
```

`bun run dev` y `bun run build` lo ejecutan solos, así que en el día a día no hay que acordarse.

De cada `diagramas/<nombre>.<tipo>.json` salen **dos cosas, con dos trabajos distintos**:

| | Para qué |
|---|---|
| `docs/public/diagramas/<nombre>.html` | El visor completo, el que abre el diálogo: foco por nodo, lente, rutas, mapa, exportar |
| `docs/.vitepress/theme/diagramas/<nombre>.svg` | La vista previa dibujada **dentro** del documento, que hereda tema, ancho y tipografía |

El estilo de todas las vistas previas va junto en `theme/diagramas/estilos.css`: las reglas de
archify son casi las mismas entre tipos —medido: de 207 y 196, 176 coinciden—, así que un archivo
por diagrama repetiría unos 36 KB por cada uno que se añada.

**Lo generado SÍ se versiona, y es una excepción deliberada.** La regla del área es que lo generado
no se versiona, porque versionarlo convierte la copia en la fuente. Aquí se hace porque **la
herramienta no es una dependencia instalable**: sin esos archivos confirmados, quien clone no puede
construir el sitio. Si algún día archify se publica en el registro, esto se revierte.

Lo aprendido al integrarlo, para no redescubrirlo:

- **`meta.locale: "es"`** pone en español la interfaz del visor. Sin eso sale en inglés.
- **`meta.legend.entries`** renombra la leyenda y **`meta.translations` con las claves
  `viewer.kind.*`** renombra lo mismo dentro del pasaporte semántico. Hacen falta las dos: son dos
  textos distintos para el mismo tipo de nodo, y con una sola el diagrama dice «Lo que está
  publicado» en la leyenda y «NUBE» al pulsarlo.
- Los tipos de nodo traen etiquetas de arquitectura —«Interfaz de usuario», «Frontend»,
  «Política»— que en un manual de Git no significan nada. El mapeo del `timeline` está en su
  renderizador: `change → frontend`, `alert → security`, `action → messagebus`,
  `recovery → backend`, `default → external`.
- **`meta.legend.mode: "auto"`** muestra solo los tipos que el diagrama usa. Con `"all"` aparecen los
  siete, incluidos cuatro vacíos.
- **El extractor descarta los bloques `@media` enteros.** Sacar sus reglas y dejarlas sueltas
  colaba la paleta de impresión de archify —papel blanco— dentro de la página oscura.

## Publicación

**Pendiente de decidir dónde**, y hay una restricción medida: un sitio de GitHub Pages **con acceso
restringido exige GitHub Enterprise Cloud** — no basta Team ni Pro. Con un plan de organización
normal, el sitio sería legible por cualquiera en internet.

Como este manual va a nombrar repositorios, ramas y compuertas internas, la salida prevista es
**servirlo como imagen de contenedor** en infraestructura propia.
