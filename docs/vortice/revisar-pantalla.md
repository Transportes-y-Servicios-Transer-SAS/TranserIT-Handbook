---
title: Revisar la pantalla, y por qué el recorrido grabado es el QA que no tenemos
---

# Revisar la pantalla

> Las cuatro preguntas son las mismas de [Revisar una solicitud](/vortice/revisar). Aquí está solo
> lo que cambia: **dos de ellas**.

| Pregunta | En el servidor | En la pantalla |
|---|---|---|
| 1 · ¿La prueba prueba el criterio? | Leer la prueba | Leerla **y preguntarse si ese criterio se puede probar ahí** |
| 2 y 3 · Huecos y lo que entró de más | Igual | Igual |
| 4 · ¿Se puede usar? | ¿El error sirve a quien lo recibe? | **Mirar el recorrido grabado** |

::: danger Los criterios sorteados y el recorrido NO son lo mismo
Es la confusión más fácil de tener, y no la aclara ninguna pantalla de GitHub.

**Los dos criterios que te toca revisar se LEEN**, en la prueba que los cite, y esa prueba
normalmente es **de unidad**, no un recorrido. Si el sorteo te da `UNMD-FE-AC1` y `UNMD-FE-AC11`,
no los busques en la grabación: no están, y es correcto que no estén.

**El recorrido cubre otros criterios**, justo los que una prueba de unidad no puede ver: el
`text-transform`, la altura en píxeles, el foco visible, qué se descarga. Eso es la pregunta 4.

Dos preguntas, dos materiales. Que no coincidan es el diseño, no un fallo.
:::

## Cómo se ve la grabación

Esto es lo único del proceso que pide mirar algo en movimiento, y es lo que sustituye al QA.

### Paso 1 · Descarga el informe

1. En la solicitud, pestaña **`Checks`**, corrida de **`Verificación`**.
2. **Baja del todo**, hasta la sección **`Artifacts`**.
3. Hay un archivo llamado **`informe-recorridos-`** seguido de un número largo.

::: tip Ese número no es el de la solicitud
Es el identificador de la corrida, algo como `informe-recorridos-43340211321`. **No tienes que
saberlo:** lo descargas desde ahí mismo. Pesa unos **10 MB** y está disponible **treinta días**.
:::

### Paso 2 · Ábrelo con el visor

Descomprime el archivo y, desde la carpeta donde quedó:

```powershell
bun x playwright show-report .\informe-recorridos-43340211321
```

Se abre solo en el navegador.

::: danger No abras el `index.html` con doble clic
El informe carga sus datos por red. Desde un archivo suelto se queda **en blanco** y parece roto
cuando no lo está. El comando de arriba levanta un servidor local, y entonces sí se ve.
:::

### Paso 3 · Abre el rastro, no el vídeo

**Aquí es donde todo el mundo se atasca.** El informe abre con la lista de recorridos, todos en
verde, y desde ahí no se ve nada:

1. **Haz clic en el nombre de un recorrido.** Se abre su detalle, con los pasos que dio.
2. **Baja hasta el final**, a la sección de adjuntos.
3. Ahí hay **un rastro (`trace`) y un vídeo**. Abre el rastro.

::: warning El vídeo dura dos segundos, y no es un error
Medido el 2026-11-13: los 59 recorridos de una corrida tardan **1,9 minutos en total**. Playwright
actúa a velocidad de máquina, así que cada vídeo dura lo que un parpadeo.

**Por eso se mira el rastro.** El rastro no depende de la velocidad: guarda **una captura por
acción**, el DOM de cada paso, la red y la consola. Se recorre hacia adelante y hacia atrás al
ritmo de quien mira, y se puede parar en cualquier punto a inspeccionar la pantalla.

El vídeo se queda como complemento, porque es lo único que muestra transiciones y animaciones.
:::

En el rastro, la línea de tiempo de arriba son las acciones. Haz clic en una y verás **cómo estaba
la pantalla antes y después**, con el DOM de ese instante. Eso es lo que sustituye a abrir la
aplicación: no un vídeo, un recorrido paso a paso que puedes parar.

::: tip Cuáles abrir
Hay ocho o diez por pantalla y no hace falta verlos todos. El resumen de la corrida de **`Revisión`**
te lista **qué recorridos aporta la rama**: esos son los tuyos.
:::

> **Por qué se graban todos y no solo los que fallan.** Grabar solo los fallos es lo normal cuando
> la grabación sirve para depurar. Aquí sirve para lo contrario: **el recorrido que pasa es justo
> el que hay que mirar**, porque es el material de la revisión funcional. Un recorrido en verde
> demuestra que la pantalla no se rompe, no que se pueda usar.

## Qué mirar en la grabación, y qué no

Miras la pantalla **como quien va a trabajar con ella ocho horas**, no como quien busca defectos de
código.

| Mira | Por qué |
|---|---|
| Qué pasa **mientras carga** | Un salto de maquetación, o una tabla que aparece vacía y luego se llena |
| Qué dice **cuando no hay nada** | Una tabla vacía sin explicación es un error que parece normal |
| Si el **mensaje de error** se entiende sin saber cómo está hecho por dentro | Es la pregunta 4 del servidor, vista desde el otro lado |
| Si se puede **terminar la tarea sin adivinar** | Dónde está el botón, qué pasó al guardar, cómo se vuelve |
| Si lo que se ve **corresponde al dato** | Mayúsculas, acentos, unidades, fechas, importes |

**No mires esto**, porque ya hay compuerta y volver a mirarlo a mano es lo que hace que las
revisiones se abandonen:

- El contraste y el nivel AA. Los recorridos lo verifican con `axe`.
- La navegación con el teclado y el foco visible. Hay recorrido que lo exige.
- Textos sin traducir, vocabulario, componentes obsoletos. Hay compuerta para cada uno.
- Que cada criterio tenga una prueba que lo cite. Hay compuerta, y es el límite que la pregunta 1
  existe para cubrir.

::: warning Si la rama trae pantallas y ningún recorrido
El resumen lo avisa y nombra las vistas que entraron. **No es un detalle de cobertura: es que la
pregunta 4 se queda sin material.** Pídelo antes de aprobar.
:::

## La trampa de la pregunta 1: el DOM no tiene estilos

En la pantalla, una prueba puede **citar su criterio, estar bien escrita, pasar en verde y aun así
no poder probarlo**. No por descuido: porque corre en un DOM sin estilos.

Dos criterios casi iguales del catálogo de unidades:

| | |
|---|---|
| `UNMD-FE-AC1` | cada unidad muestra su nombre y su abreviatura |
| `UNMD-FE-AC2` | METRO con abreviatura `m` **se ve en minúscula**: la columna no lleva `text-transform` |

La prueba del primero lee el texto de cada fila y lo compara con la siembra. Correcta. **Y sería
igual de verde si la columna llevara `text-transform: uppercase`**, porque el DOM seguiría diciendo
`m` mientras la pantalla muestra `M`.

Y eso importa: en el Sistema Internacional `m` es metro y `M` no es nada. Uniformar esa columna
convierte un símbolo legal en otro que no existe.

Por eso la prueba del segundo **no está entre las de unidad: está en el recorrido**, que corre sobre
el paquete construido, con los estilos puestos.

::: tip La pregunta que hay que hacerse
Cuando te toque un criterio que hable de **cómo se ve** algo (mayúsculas, altura, color, orden
visual, qué se descarga y cuándo), comprueba **dónde** vive su prueba. Si está solo entre las de
unidad, probablemente cite el criterio sin poder verlo.
:::

## El otro patrón: un cero que no significa nada

Una prueba que afirma que **algo no pasó** (ninguna petición, ningún dato) está en cero por
definición hasta que algo la rompa. Ese cero puede ser real, o puede ser que la prueba nunca llegó a
ejecutar nada.

Las buenas traen al lado su gemela que lo pone en no cero:

```ts
expect(pedidas, 'Ni una petición al catálogo').toBe(0)
```
```ts
it('con el permiso, la misma dirección sí pide el catálogo: el contador de arriba no está muerto')
```

**Si ves la primera sin la segunda, dilo.** Es gratis de añadir, y sin ella el cero no significa
nada.

## El tamaño real, con un ejemplo

La solicitud del catálogo de unidades aporta **diecisiete criterios**, y el sorteo te da dos. Su
recorrido tiene ocho pasos, y estos **solo** existen ahí:

| El paso | Qué ve que ninguna prueba de unidad puede ver |
|---|---|
| La abreviatura se pinta tal como está | El `text-transform` que uniformaría `m` en `M` |
| En el formulario tampoco se uniforma | Lo mismo, con el teclado en pantalla |
| La altura de las filas corresponde a la densidad | Una medida en píxeles, que sin estilos no existe |
| Con solo el teclado se alcanza cada acción, y el foco se ve | Que el anillo de foco exista **y sea visible** |
| La pantalla no viene en el paquete inicial | Que la ruta se descargue al entrar, no antes |

Mirar esos ocho pasos cuesta unos minutos. Es lo más barato de todo el proceso, y lo único que mira
la pantalla como la va a mirar quien la use.

> **Para verlos:** [abre la grabación](#paso-1-descarga-el-informe), entra al recorrido que te
> interese y, en sus adjuntos, **abre el rastro**. No el vídeo: ese dura dos segundos.
