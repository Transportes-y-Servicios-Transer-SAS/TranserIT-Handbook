---
title: Ramas, trabajar sin estorbar a nadie
---

# Ramas: trabajar sin estorbar a nadie

> La parte 1 dijo **qué resuelve** una rama: que cinco personas trabajen a la vez sin pisarse. Esta
> dice **qué es** y cómo se usa.
>
> Aquí aparece el primer comando que sale de tu equipo. Hasta ahora todo se quedaba en tu carpeta;
> a partir de la mitad de esta página, lo que hagas lo va a ver alguien más.

## Qué es una rama, de verdad

Mucha gente lleva años usando ramas con la idea de que son «una copia del proyecto». No lo son, y
creerlo lleva a tenerles un respeto que no merecen.

**Una rama es un archivo con el identificador de un *commit* dentro.** Eso es todo. Cuarenta
caracteres de texto.

<Diagrama
  nombre="puntero"
  titulo="Los commits no se mueven nunca; los nombres —las ramas— sí, y apuntan al último de cada línea" />

De ahí salen tres consecuencias que explican todo lo demás:

| | |
|---|---|
| **Crear una rama es instantáneo** | No se copia nada. Se escribe un identificador en un archivo, y da igual que el proyecto tenga diez archivos o diez mil |
| **Confirmar mueve la rama sola** | No tienes que «guardar en la rama»: el nombre pasa a apuntar al *commit* nuevo, y el anterior queda detrás |
| **Tener ramas de más no cuesta nada** | Lo que cuesta es que **vivan mucho**, y eso no es por la rama: es porque el tronco se va alejando mientras tanto |

Y una cuarta, que es la que evita sustos: **`HEAD` es dónde estás parado.** Casi siempre apunta a
una rama, no a un *commit*. Cuando algo no cuadra, lo primero es mirar en cuál estás.

## Crear una rama y moverte entre ellas

```powershell
# Crea la rama y te mueve a ella, en un solo paso
git switch -c feature/vort-142-liquidacion-retencion

# Moverte a una que ya existe
git switch develop

# Volver a la anterior, sin escribir el nombre
git switch -

# Ver las que tienes, con la actual marcada
git branch
```

Y la pregunta de siempre, que también responde en qué rama estás:

```powershell
git status
```

> **En manuales viejos verás `git checkout` para esto.** Sigue funcionando, pero hacía dos cosas
> distintas —cambiar de rama y descartar cambios— con el mismo nombre, y de ahí salieron muchos
> trabajos perdidos. Se partió en dos: `git switch` para moverte y `git restore` para descartar.
> **Usa los nuevos.**

## Cómo se llama una rama

El nombre no es libre. Lleva tres partes:

```
tipo/vort-123-nombre-sustancial-de-la-rama
```

| Parte | Qué es |
|---|---|
| `tipo` | Uno de cuatro: **`feature`**, `bugfix`, `hotfix` o `spike`. No se inventa ninguno más |
| `vort-123` | El identificador de la historia en el tablero |
| el resto | Un nombre que diga de qué va, con guiones entre palabras |

> **Ojo con el tipo, porque hay dos vocabularios parecidos y no son el mismo.** La rama se llama
> `feature/…`, con la palabra entera. El *commit* que va dentro empieza por `feat:`, abreviado. Son
> dos listas distintas —la de ramas tiene cuatro tipos, la de *commits* tiene diez— y confundirlas
> es el error más común al empezar.

> ⚠️ **Todo en minúscula, sin excepción, y la razón no es estética.**
>
> **Git en Windows no distingue mayúsculas en las referencias** en varias configuraciones. Eso
> significa que `VORT-143` y `vort-143` pueden pisarse entre dos máquinas del mismo equipo, con el
> resultado de que una persona cree estar en su rama y está en la de otra. En minúscula ese caso
> no existe.

**Por qué el identificador de la historia va a mano:** nuestro tablero no se integra con Git. No hay
nada que enlace una rama con la tarea que la pidió salvo ese texto. Escribirlo mal no rompe nada hoy
— y por eso es peligroso: lo que se pierde es la trazabilidad, y se descubre meses después, cuando
alguien pregunta por qué entró un cambio.

Los cuatro tipos y cuánto dura cada uno están en el **§2.3 de las convenciones del Core**; que el
identificador de la historia vaya dentro, y que todo vaya en minúscula, lo añade el **ADR-039 §7**.

## Trabajar en ella es lo que ya sabes

Dentro de una rama, el ciclo es **exactamente** el de la parte 2 y no cambia nada: `git status`,
`git add`, `git commit`. La diferencia no está en los comandos, está en dónde caen los *commits*.

Lo nuevo es el final.

### Publicarla: `git push`

```powershell
git push -u origin feature/vort-142-liquidacion-retencion
```

**El `-u` se escribe una sola vez por rama.** Deja emparejada tu rama local con la del servidor, y a
partir de ahí basta `git push` a secas. Sin él tendrías que repetir el nombre completo cada vez.

Publicar una rama **no cambia nada para nadie**: lo publicado sigue igual. Lo único que consigues es
que tu trabajo deje de vivir solo en tu equipo, que es exactamente lo que quieres si esta tarde se
te derrama un café encima del portátil.

### Traer lo que entró mientras trabajabas

Tu rama salió de un punto del tronco, y el tronco siguió avanzando. Antes de pedir que te revisen,
trae lo que entró:

```powershell
git fetch origin
git merge origin/develop
```

> **Se trae de `origin/develop` y no de `develop`.** Tu copia local de la rama del tronco puede
> estar vieja, y no te enterarías hasta el primer conflicto. `git fetch` actualiza lo que el
> servidor tiene; `origin/develop` es eso recién traído.
>
> En este manual el tronco se llama `develop` porque es el de Vórtice. **El Core fija `main` para
> repositorios nuevos, y Vórtice tiene tres ramas largas por el ADR-039**; la parte 4 explica por
> qué difieren y cuál te toca a ti.

**Hazlo antes de pedir la revisión, no después.** Es lo que hace que quien revise vea tu cambio
sobre lo que de verdad hay, y no sobre lo que había hace cuatro días.

## Qué es un conflicto

Casi siempre, `git merge` termina solo y no te enteras. A veces para y dice que hay un conflicto.

**Un conflicto no es un error ni un fallo tuyo.** Es Git diciendo: *«dos personas cambiaron las
mismas líneas y no voy a decidir por ustedes cuál vale».* Es exactamente lo que quieres que haga.
Lo contrario —que elija— sería mucho peor.

Lo verás así dentro del archivo:

```
<<<<<<< HEAD
el precio incluye el peaje
=======
el precio no incluye el peaje
>>>>>>> origin/develop
```

Arriba lo tuyo, abajo lo que venía, y tú decides qué queda. **Resolverlo paso a paso es la parte 6**;
por ahora basta con reconocerlo y saber que no se arregla borrando la carpeta y clonando otra vez.

## Devolver el trabajo

Una rama terminada no se fusiona sola, ni la fusionas tú directamente. Se abre una **solicitud de
cambio**: una propuesta de que lo tuyo entre al tronco, que **otra persona revisa y aprueba**.

Eso no es burocracia: es el único punto del proceso donde alguien que no escribió el cambio lo mira
antes de que llegue a producción. **Y si el cambio se generó con asistencia, esa revisión es
obligatoria por política corporativa.**

Cómo se abre, qué lleva dentro y qué compuertas tiene que pasar antes es la **parte 4**.

## Tres cosas que no se hacen con una rama

| | Por qué |
|---|---|
| **Reescribir lo que ya publicaste** | `git commit --amend` y compañía cambian *commits* que otra persona puede haber traído ya. Si la rama salió de tu equipo, lo de dentro ya no es solo tuyo |
| **Dejarla viva semanas** | Una rama de tres semanas es gitflow aunque el repositorio no lo sea. La regla es **días**: si no cabe en días, la tarea era demasiado grande y había que partirla |
| **Trabajar directamente sobre el tronco** | Es lo que la rama existe para evitar. Si te encuentras confirmando en `develop`, es que te saltaste el `git switch -c` |

## Cuando algo no cuadra

| Lo que dice Git | Qué pasó |
|---|---|
| `fatal: a branch named '…' already exists` | Ya la creaste antes. `git switch` sin el `-c` te lleva a ella |
| `Your branch is ahead of 'origin/…' by 2 commits` | Confirmaste pero no publicaste. `git push` |
| `There is no tracking information for the current branch` | Falta el emparejamiento. Es el `-u` de más arriba |
| `Please commit your changes or stash them before you switch` | Tienes cambios a medias. Confírmalos antes de moverte |
| `CONFLICT (content): Merge conflict in …` | Lo de la sección anterior. No es un error |

<div class="siguiente">

**Con esto ya puedes trabajar sin estorbar a nadie**, que era la promesa de la parte 1: te separas,
haces lo tuyo, lo devuelves.

**La parte 4 es nuestra estructura**: cuáles son las ramas largas de verdad, por qué Vórtice tiene
tres cuando el Core pide una, en qué dirección se mueve cada cosa y qué compuerta hay en cada paso.
Es la parte donde este manual deja de hablar de Git y empieza a hablar de nosotros.

</div>
