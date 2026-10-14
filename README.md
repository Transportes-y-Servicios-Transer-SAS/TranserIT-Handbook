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
bun run dev        # servidor de desarrollo, recarga al guardar
bun run build      # genera docs/.vitepress/dist
bun run preview    # sirve lo construido
```

## Qué hay hoy

| | Estado |
|---|---|
| **Git · 1 · Qué es y qué problema resuelve** | Escrito. **Cero comandos**, a propósito |
| Git · 2 a 7 | Pendientes: flujo básico, ramificaciones, trunk based, día a día, conflictos, deshacer |
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
| **Diagramas: archify para los interactivos, SVG a mano para los conceptuales** | Un diagrama de flujo —ramas, fusión— gana con zoom, foco y tarjetas: eso es archify. Una comparación de dos ideas —«guardar» frente a «commit»— no gana nada siendo interactiva, y en línea pesa 2 KB en vez de 800 |
| **Los SVG a mano usan las variables de tema de VitePress** | Siguen el modo claro y el oscuro sin duplicarse. Comprobado en los dos |

## Los diagramas interactivos

Se generan con [archify](https://github.com/tt-a1i/archify). **La fuente es el JSON de
`diagramas/`**; el HTML de `docs/public/diagramas/` es el resultado.

```bash
# archify no está en npm con ese nombre —el paquete «archify» del registro es otro—,
# así que se clona y se usa su CLI:
git clone --depth 1 https://github.com/tt-a1i/archify.git /tmp/archify

node /tmp/archify/archify/bin/archify.mjs validate workflow diagramas/rama.workflow.json
node /tmp/archify/archify/bin/archify.mjs render   workflow diagramas/rama.workflow.json docs/public/diagramas/rama.html
```

**El HTML generado SÍ se versiona, y es una excepción deliberada.** La regla del área es que lo
generado no se versiona, porque versionarlo convierte la copia en la fuente. Aquí se hace porque
**la herramienta no es una dependencia instalable**: sin el HTML confirmado, quien clone no puede
construir el sitio. Si algún día archify se publica en el registro, esto se revierte.

Tres cosas aprendidas al integrarlo, para no redescubrirlas:

- **`meta.locale: "es"`** pone en español la interfaz del visor. Sin eso sale en inglés.
- **`meta.legend.entries`** renombra la leyenda. Hace falta: los siete tipos de nodo traen etiquetas
  de arquitectura —«Interfaz de usuario», «Política»— que en un manual de Git confunden.
- **`meta.legend.mode: "auto"`** muestra solo los tipos que el diagrama usa. Con `"all"` aparecen los
  siete, incluidos cuatro vacíos.

## Publicación

**Pendiente de decidir dónde**, y hay una restricción medida: un sitio de GitHub Pages **con acceso
restringido exige GitHub Enterprise Cloud** — no basta Team ni Pro. Con un plan de organización
normal, el sitio sería legible por cualquiera en internet.

Como este manual va a nombrar repositorios, ramas y compuertas internas, la salida prevista es
**servirlo como imagen de contenedor** en infraestructura propia.
