---
title: Conflictos, cuando Git te pregunta
---

# Conflictos: cuando Git te pregunta

> La parte 3 dijo qué es un conflicto y la parte 5 lo nombró entre los problemas. Esta lo resuelve.
>
> **Un conflicto no es un error, ni un fallo tuyo, ni señal de que algo se rompió.** Es Git
> negándose a decidir por ti. Lo contrario —que eligiera solo— sería mucho peor: perderías trabajo
> sin enterarte.

## Cuándo aparece

Siempre al juntar dos líneas de trabajo, y casi siempre en uno de estos dos sitios:

| | |
|---|---|
| `git merge origin/develop` | Traes el tronco a tu rama y alguien tocó lo mismo que tú |
| `git pull` | Lo mismo, porque un *pull* es un *fetch* y un *merge* seguidos |

**Y solo si los cambios se pisan.** Que dos personas toquen el mismo archivo no basta: Git junta sin
preguntar mientras sean líneas distintas. Hace falta que sean **las mismas líneas**, o que uno borre
lo que el otro cambió.

## Lo que pasa cuando Git para

<Diagrama
  nombre="conflicto"
  titulo="El conflicto es un estado del que se sale por dos sitios: resolviéndolo o deshaciéndolo" />

Mientras dura, **Git no toca nada más**. Tu repositorio queda en un estado llamado `MERGING`, y lo
dice en cada `git status`. No hay prisa: puedes irte a almorzar.

## Cómo se ve

Git escribe los dos lados dentro del archivo, separados por marcas:

```
<<<<<<< HEAD
el precio incluye el peaje
=======
el precio no incluye el peaje
>>>>>>> origin/develop
```

| Marca | Qué hay debajo |
|---|---|
| `<<<<<<< HEAD` | **Lo tuyo**: lo que hay en la rama donde estás parado |
| `=======` | La frontera entre los dos |
| `>>>>>>> origin/develop` | **Lo que traes**: lo que viene de la otra rama |

> **Cuidado con «ours» y «theirs», que confunden a todo el mundo.** En un *merge*, `--ours` es **la
> rama donde estás** y `--theirs` **la que estás trayendo**. Cuando te traes `develop` a tu rama de
> trabajo, «ours» es tu rama y «theirs» es `develop` — aunque `develop` sea de todos y tu rama sea
> solo tuya. Se refiere a la posición, no a la propiedad.

## Resolverlo, paso a paso

### 1 · Pregunta qué pasó

```powershell
git status
```

Lista los archivos en conflicto bajo `Unmerged paths` y, abajo, dice exactamente qué hacer. **Es el
comando que más ayuda en esta situación**, no el que menos.

### 2 · Abre el archivo y decide

Te quedas con lo tuyo, con lo que viene, con una mezcla o con algo nuevo que escribas tú. **No hay
una respuesta mecánica**: es una decisión sobre qué tiene que decir ese código, y por eso la toma
una persona.

**Y borra las tres marcas.** `<<<<<<<`, `=======` y `>>>>>>>` no son parte del archivo: si una se
queda, entra al *commit* y rompe el archivo sin que nada avise.

> **El editor ayuda, y conviene usarlo.** Tanto VS Code como IntelliJ muestran los dos lados en
> columnas con botones para elegir, y al aceptar **quitan las marcas solos**. Es más seguro que
> borrarlas a mano.

### 3 · Dile a Git que ya está

```powershell
git add ruta/del/archivo
```

**No existe un comando llamado «resolver».** Añadir el archivo *es* decirle a Git que ese ya está
resuelto. Repite por cada archivo en conflicto; `git status` te va quitando los que faltan.

### 4 · Cierra la fusión

```powershell
git commit
```

Sin `-m`: Git propone un mensaje de fusión ya escrito y basta con aceptarlo. **Confirmar es lo que
cierra el estado `MERGING`.**

## Si te perdiste: deshacerlo

```powershell
git merge --abort
```

Deja **todo exactamente como antes de empezar**, sin rastro. Funciona en cualquier momento mientras
no hayas confirmado la fusión.

**Abortar y volver a empezar con calma es una salida legítima**, no una rendición. Sobre todo si el
conflicto es grande y conviene hablar antes con quien escribió el otro lado.

## Dos archivos nuestros que NO se resuelven a ojo

En nuestros repositorios hay dos archivos con regla propia, declarada en `.gitattributes`. **Si te
sale un conflicto en ellos, lo de arriba no aplica.**

### El contrato: no se fusiona, se reconstruye

`contract/*.json` está marcado `-merge`. El contrato **es un archivo generado**, una función pura del
código: después de fusionar dos ramas **ninguno de los dos lados es correcto**, porque cada uno
desconoce las operaciones del otro. Un JSON entrelazado por Git parecería válido sin corresponder a
ningún código, que es el peor resultado posible.

Con `-merge`, el conflicto deja el archivo entero de un lado y lo marca. Se sale así:

```powershell
git checkout --ours contract/openapi.json   # o --theirs; da igual cuál
.\mvnw.cmd verify                            # ESTO es lo que lo arregla
```

**El comando que lo resuelve es el segundo.** El primero solo quita el conflicto para poder seguir.
La decisión está en el **ADR-028**.

### El manifiesto de criterios: se queda con los dos lados

`acceptance-criteria.properties` está marcado `merge=union`, y es el caso contrario. **Se escribe a
mano**, y cada funcionalidad añade su propio bloque: los dos lados son correctos y lo que hace falta
es quedarse con ambos. Git los une sin preguntar.

> **Por qué importa que esté puesto:** sin esa regla, cada fusión daba `CONFLICT (add/add)` y se
> resolvía eligiendo un lado — **lo que borraba los criterios de la otra funcionalidad**. Y borrarlos
> no rompe nada visible: la comprobación solo mira las funcionalidades que el manifiesto nombra, así
> que la que desaparece **deja de comprobarse en silencio**.

**El precio de `union`:** si dos ramas añaden **la misma línea**, la duplica sin avisar. Por eso hay
una prueba que comprueba claves repetidas — `AcceptanceTraceabilityTest` en el servidor y
`gates/trazabilidad.spec.ts` en la pantalla. Si falla por una clave duplicada, no es un fallo de la
prueba: es `union` haciendo su trabajo y avisando.

## Cómo tener menos conflictos

Ninguno de estos es un truco de Git. Los tres son de organización:

| | |
|---|---|
| **Trae el tronco a menudo** | Un conflicto de un día se resuelve en minutos; el de tres semanas es un proyecto. Es el primer paso de la rutina de la mañana por esto |
| **Ramas cortas** | La regla de los días de la parte 4 existe, entre otras cosas, para esto |
| **Tareas que no se pisan** | Si dos personas tienen que tocar el mismo archivo a la vez, el problema se resolvió mal al repartir, no al fusionar |

## Problemas que vas a ver

| Lo que dice Git | Qué pasó |
|---|---|
| `CONFLICT (content): Merge conflict in …` | El caso normal: las mismas líneas por los dos lados |
| `CONFLICT (add/add)` | Los dos crearon un archivo con el mismo nombre |
| `CONFLICT (modify/delete)` | Uno lo cambió y el otro lo borró. Hay que decidir si el archivo sigue existiendo |
| `error: Merging is not possible because you have unmerged files` | Quedan archivos sin marcar con `add`. `git status` dice cuáles |
| `fatal: There is no merge to abort` | No hay fusión en curso: o ya la confirmaste, o el conflicto venía de otra cosa |

<div class="siguiente">

**Un conflicto resuelto no deja secuelas.** Queda un *commit* de fusión en la historia y se sigue
trabajando igual.

**La parte 7 es deshacer**: qué hacer cuando lo que quieres no es resolver un choque, sino volver
atrás — un *commit* que no debía, un archivo que no tocaba, algo que ya publicaste.

</div>
