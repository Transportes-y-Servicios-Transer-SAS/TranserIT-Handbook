---
title: Revisar la pantalla, y por qué el recorrido grabado es el QA que no tenemos
---

# Revisar la pantalla

> Las cuatro preguntas son las mismas. Dos cambian de forma cuando lo revisado es una pantalla, y
> una de ellas es la que sustituye al QA.

Esta página **no repite** [Revisar una solicitud](/vortice/revisar): el turno, la ficha, el orden de
responder y aprobar y qué hacer con lo que encuentres son idénticos en los dos repositorios. Aquí
está solo lo que cambia.

## Qué cambia, en una tabla

| Pregunta | En el servidor | En la pantalla |
|---|---|---|
| **1 · ¿La prueba prueba el criterio?** | Leer la prueba | Leer la prueba **y preguntarse si ese criterio se puede probar ahí** |
| **2 · ¿Los huecos siguen abiertos?** | Igual | Igual |
| **3 · ¿Entró algo que no se pedía?** | Igual | Igual |
| **4** | ¿El error le sirve a quien lo recibe? | **¿Se puede usar?**, mirando el recorrido grabado |

## La pregunta 1 tiene una trampa propia aquí

En la pantalla, una prueba puede **citar su criterio, estar bien escrita, pasar en verde y aun así
no poder probarlo**. No por descuido de quien la escribió: porque corre en un DOM sin estilos.

Mira estos dos criterios del catálogo de unidades de medida, que son casi el mismo:

| | |
|---|---|
| `UNMD-FE-AC1` | cada unidad muestra su nombre y su abreviatura |
| `UNMD-FE-AC2` | la unidad METRO con abreviatura `m` **se ve en minúscula**: la columna no lleva `text-transform` |

La prueba del primero lee el texto de cada fila y lo compara con la siembra. Correcta. **Y sería
igual de verde si la columna llevara `text-transform: uppercase`,** porque el texto del DOM seguiría
diciendo `m` mientras la pantalla muestra `M`.

Y eso importa de verdad: en el Sistema Internacional `m` es metro y `M` no es nada, así que
uniformar esa columna convierte un símbolo legal en otro que no existe.

Por eso la prueba del segundo **no está entre las de unidad: está en el recorrido**, que corre sobre
el paquete construido, con los estilos puestos:

```ts
test('[UNMD-FE-AC2] la abreviatura se PINTA tal como está: m en minúscula, L en
      mayúscula, sin text-transform', ...)
```

::: tip La pregunta que hay que hacerse
Cuando te toque un criterio que hable de **cómo se ve** algo (mayúsculas, altura, color, orden
visual, qué se descarga y cuándo), comprueba **dónde** vive su prueba. Si está solo entre las de
unidad, probablemente cite el criterio sin poder verlo.
:::

> **El otro patrón que vale la pena reconocer.** Una prueba que afirma que **algo no pasó** (ninguna
> petición, ningún dato) está en cero por definición hasta que algo la rompa, y un cero puede ser
> real o puede ser que la prueba nunca llegó a ejecutar nada. Las buenas traen al lado su gemela que
> lo pone en no cero:
>
> ```ts
> expect(pedidas, 'Ni una petición al catálogo').toBe(0)
> ```
> ```ts
> it('con el permiso, la misma dirección sí pide el catálogo: el contador de arriba no está muerto')
> ```
>
> Si ves la primera sin la segunda, dilo. Es gratis de añadir y sin ella el cero no significa nada.

## La pregunta 4: ¿se puede usar?

**Esta es la que sustituye al QA que no tenemos**, y la única que pide mirar algo en movimiento.

No hay ambiente desplegado donde abrir la pantalla de una rama, y quien tiene permiso de solo
lectura no puede levantarla en su máquina. Lo que hay es **la grabación**: en integración, Playwright
graba en vídeo **todos** los recorridos, no solo los que fallan.

> **Por qué todos y no solo los que fallan.** Grabar solo los fallos es lo normal cuando el vídeo
> sirve para depurar. Aquí sirve para lo contrario: **el recorrido que pasa es justo el que hay que
> mirar**, porque es el material de la revisión funcional. Un recorrido en verde demuestra que la
> pantalla no se rompe, no que se pueda usar.

### Cómo se mira

1. En la solicitud, pestaña **Checks**, corrida de **Verificación**.
2. Abajo, en **Artifacts**, está `informe-recorridos-<número>`. Dura treinta días.
3. Descárgalo, descomprímelo y ábrelo con el visor, **no haciendo doble clic en el `index.html`**:
   el informe carga sus datos por red y desde un archivo suelto se queda en blanco.

```powershell
bun x playwright show-report .\informe-recorridos-123456
```

Cada recorrido trae su vídeo dentro. El resumen de la corrida de **Revisión** te lista además qué
recorridos aporta la rama, para que sepas cuáles buscar.

### Qué mirar, y qué no

Miras la pantalla **como la miraría quien va a trabajar con ella ocho horas**, no como quien busca
defectos de código:

| Sí | Por qué |
|---|---|
| Qué pasa **mientras carga** | Un salto de maquetación o una tabla que aparece vacía y luego se llena |
| Qué dice **cuando no hay nada** que mostrar | Una tabla vacía sin explicación es un error que parece normal |
| Si el **mensaje de error** se entiende sin saber cómo está hecho por dentro | Es el mismo criterio que la pregunta 4 del servidor, visto desde el otro lado |
| Si se puede **terminar la tarea sin adivinar** | Dónde está el botón, qué pasó después de guardar, cómo se vuelve |
| Si lo que se ve **corresponde al dato** | Mayúsculas, acentos, unidades, fechas, importes |

**Y lo que no**, porque ya lo comprobaron las [diecinueve compuertas](/vortice/compuertas) y volver a
mirarlo a mano es lo que hace que las revisiones se abandonen:

- **El contraste y el nivel AA.** Hay compuerta, y además los recorridos lo verifican con `axe`.
- **La navegación con el teclado y el foco visible.** Hay recorrido que lo exige.
- **Los textos sin traducir, el vocabulario y los componentes obsoletos.** Hay compuerta para cada uno.
- **Que cada criterio tenga una prueba que lo cite.** Hay compuerta, y es justo el límite que la
  pregunta 1 existe para cubrir.

::: warning Si la rama trae pantallas y ningún recorrido
El resumen lo avisa, y nombra las vistas que entraron. **No es un detalle de cobertura: es que la
pregunta 4 se queda sin material** y la revisión funcional no se puede hacer. Pídelo antes de
aprobar.
:::

## El ejemplo, para ver el tamaño real

La solicitud del catálogo de unidades de medida en la pantalla aporta **diecisiete criterios**, y el
sorteo te daría dos. Su recorrido tiene ocho pasos, y estos son los que **solo** existen ahí:

| El paso | Qué ve que ninguna prueba de unidad puede ver |
|---|---|
| La abreviatura se pinta tal como está | El `text-transform` que uniformaría `m` en `M` |
| En el formulario tampoco se uniforma | Lo mismo, pero con el teclado en pantalla |
| La altura de las filas corresponde a la densidad | Una medida en píxeles, que en un DOM sin estilos no existe |
| Con solo el teclado se alcanza cada acción, y el foco se ve | Que el anillo de foco exista **y sea visible** |
| La pantalla no viene en el paquete inicial | Que la ruta se descargue al entrar, no antes |

Mirar la grabación de esos ocho pasos cuesta unos minutos. Es lo más barato de todo el proceso, y
es lo único que mira la pantalla como la va a mirar quien la use.
