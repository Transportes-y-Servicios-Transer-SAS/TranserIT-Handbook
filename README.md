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
| **Diagramas en SVG propio** | Van en línea en el markdown y usan las variables de tema de VitePress, así que siguen el modo claro y el oscuro sin duplicarse. Comprobado en los dos |

## Publicación

**Pendiente de decidir dónde**, y hay una restricción medida: un sitio de GitHub Pages **con acceso
restringido exige GitHub Enterprise Cloud** — no basta Team ni Pro. Con un plan de organización
normal, el sitio sería legible por cualquiera en internet.

Como este manual va a nombrar repositorios, ramas y compuertas internas, la salida prevista es
**servirlo como imagen de contenedor** en infraestructura propia.
