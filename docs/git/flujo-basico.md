---
title: El flujo básico, tu primer cambio de principio a fin
---

# El flujo básico: tu primer cambio, de principio a fin

> **Aquí sí hay comandos, y es el primer sitio donde aparecen.** Lo que sigue no añade ideas nuevas:
> le pone nombre a las cuatro de la parte 1 y enseña a decirlas en voz alta.
>
> **Nada de esta página se practica todavía en un repositorio del área.** Hay una carpeta de
> práctica para eso, y al final se explica qué falta antes de tocar lo de verdad.

## Dónde se escriben estos comandos

Git no tiene ventana. Se le habla escribiendo, en una **terminal**: una ventana donde escribes una
orden, pulsas Enter y te responde con texto.

En Windows la que usamos es **PowerShell**. La abres buscando «PowerShell» en el menú de inicio. No
hace falta saber nada de PowerShell: de todo lo que existe ahí, este manual usa tres cosas.

| Para | Se escribe |
|---|---|
| Ir a una carpeta | `cd C:\ruta\a\la\carpeta` |
| Ver qué hay en la carpeta donde estás | `ls` |
| Saber en qué carpeta estás | `pwd` |

**Los comandos de Git son idénticos en cualquier terminal y en cualquier sistema.** Lo único que
cambia entre Windows, macOS y Linux son esos tres de arriba, que no son de Git.

Una advertencia que ahorra media hora: **Git trabaja sobre la carpeta donde estás parado.** Si
ejecutas un comando y responde `not a git repository`, casi siempre es que estás fuera de la carpeta
del repositorio. Se arregla con `cd`, no reinstalando nada.

## Los cinco estados, que son los únicos que hay

Un archivo tuyo está siempre en uno de cinco sitios, y cada comando lo mueve al siguiente. Entender
este dibujo es entender el 90 % de Git en el día a día.

<Diagrama
  nombre="estados"
  titulo="Los cinco estados de un archivo, y el comando que lo mueve de cada uno al siguiente" />

El que cuesta es el tercero. **Entre «lo cambiaste» y «lo confirmaste» hay un paso intermedio**, y
casi todo el mundo se pregunta para qué.

Está porque **un *commit* es un cambio con sentido, no todo lo que tocaste hoy.** Si en una mañana
corriges un error y además arreglas un texto, son dos cosas distintas: con ese paso intermedio
confirmas una, la explicas, y luego la otra. Dentro de seis meses, quien lea la historia encuentra
dos notas claras en vez de una que dice «cambios de la mañana».

Y hay una segunda razón, menos obvia y más importante: **ese paso es el único momento en que ves
exactamente lo que va a salir.** Es donde se descubre que se coló una contraseña de prueba, un
archivo con datos de un cliente o un apunte personal.

## Decirle a Git quién eres

Esto se hace **una sola vez por equipo**, no por proyecto. Git firma cada *commit* con un nombre y
un correo, y si no se los das, escribe lo que encuentre.

```powershell
git config --global user.name "Nombre Apellido"
git config --global user.email "tu.correo@transer.com.co"
```

Comprueba que quedó:

```powershell
git config --global --list
```

> **El correo tiene que ser el corporativo**, el mismo de tu cuenta de GitHub. Es lo que hace que
> tus *commits* aparezcan como tuyos y no como de un desconocido.

## Práctica: una carpeta tuya, sin riesgo

Antes de tocar nada compartido, el ciclo completo en una carpeta de mentira. **Nada de esto sale de
tu equipo** y puedes borrarla al terminar.

### 1 · Crear el repositorio

```powershell
cd C:\Users\TU_USUARIO\Desktop
mkdir practica-git
cd practica-git
git init
```

`git init` es, literalmente, lo que convierte una carpeta normal en **una carpeta con memoria**. Lo
único que hace es crear una subcarpeta oculta llamada `.git`, que es donde vive toda la historia.

### 2 · La única pregunta: `git status`

```powershell
git status
```

Responde `No commits yet` y `nothing to commit`. Lógico: la carpeta está vacía.

> **`git status` es el comando que más vas a escribir, y con diferencia.** Siempre responde lo
> mismo: en qué rama estás, qué cambiaste y qué pasará si confirmas ahora. Cuando no sepas qué
> hacer, escríbelo. Nunca rompe nada.

### 3 · Crear un archivo y mirar qué dice Git

```powershell
"Primera línea" > notas.txt
git status
```

Ahora `git status` lista `notas.txt` bajo **`Untracked files`**: archivos sin seguimiento.

**Esta es la trampa que más veces se cae.** Git no sigue por su cuenta lo que nunca le presentaste.
Un archivo nuevo se queda fuera del *commit* mientras no lo añadas, y eso se descubre tarde: cuando
otra persona trae tu cambio y le falta una pieza.

### 4 · Elegir lo que va: `git add`

```powershell
git add notas.txt
git status
```

El archivo pasó a **`Changes to be committed`**. Ahí está el paso intermedio del dibujo: ya dijiste
que este sí va.

Si te arrepientes, sale de la lista sin perder lo que escribiste:

```powershell
git restore --staged notas.txt
```

### 5 · Confirmar: `git commit`

```powershell
git add notas.txt
git commit -m "docs: añade las notas de la primera prueba"
```

Git responde con un identificador corto —algo como `a3f91c2`— que es el nombre de ese punto en la
historia. **Ese punto ya no se pierde.**

### 6 · Ver la historia: `git log`

```powershell
git log --oneline
```

Una línea por *commit*: su identificador y su nota. Ahora cambia el archivo y repite el ciclo para
verlo crecer:

```powershell
"Segunda línea" >> notas.txt
git status
git add notas.txt
git commit -m "docs: añade la segunda línea"
git log --oneline
```

Dos puntos en la historia. **Eso es todo el ciclo**, y no hay más.

## El mismo ciclo, con un repositorio del área

### Traerlo: `git clone`

```powershell
cd C:\Users\TU_USUARIO\dev
git clone git@github.com:LA_ORGANIZACION/NOMBRE_DEL_REPOSITORIO.git
cd NOMBRE_DEL_REPOSITORIO
```

`git clone` trae **el repositorio entero, con toda su historia**, no la última versión. Por eso
tarda más que descargar una carpeta, y por eso después puedes consultar cualquier *commit* sin
conexión.

> La dirección exacta de cada repositorio y la llave que hace falta para acceder están en el manual
> de llaves de GitHub. Si `git clone` responde `Permission denied (publickey)`, es eso: Git no
> encuentra tu llave, no es que el repositorio no exista.

### Mirar antes de tocar

En un repositorio que ya tiene historia, estos tres responden casi todo:

| Comando | Qué responde |
|---|---|
| `git status` | En qué rama estoy y qué he cambiado |
| `git log --oneline -20` | Los últimos veinte *commits*, uno por línea |
| `git log --oneline -- ruta/del/archivo` | Qué le ha pasado a **ese** archivo |

Ese último es el que convierte la historia en algo útil: responde *quién tocó esto y por qué* sin
preguntarle a nadie.

### Traer lo que hicieron los demás

```powershell
git pull
```

Trae a tu equipo lo que otros publicaron. **Hazlo antes de empezar a trabajar, no después.** Es la
diferencia entre partir de lo último y descubrir a mitad de camino que ibas sobre una versión vieja.

### Y publicar lo tuyo: `git push`

`git push` es el que lleva lo confirmado a la copia central. Es el paso que falta para que tu
trabajo deje de depender de tu equipo.

**No lo practiques todavía**, y la razón no es técnica: en el área **nunca se trabaja directamente
sobre lo publicado**. Se trabaja en una rama propia, y eso es la parte 3. Hasta entonces, el ciclo
que ya sabes —`status`, `add`, `commit`— se queda en tu equipo sin molestar a nadie.

## La nota del *commit*

La nota es lo único de un *commit* que no se puede recuperar después. El código se puede volver a
leer; la razón por la que lo escribiste, no.

**Lo que hace buena a una nota:** que diga el *qué* y, cuando no sea obvio, el *porqué*.

| | |
|---|---|
| `cambios` | No dice nada |
| `arreglo` | ¿Cuál? |
| `feature/login-nuevo` | Es el nombre de la rama, no una nota — y ya ha pasado |
| `corrige el cálculo del peaje en rutas de varios tramos` | Esto sí |

En los repositorios del área el formato no es libre: lleva un tipo, un alcance y el número de la
tarea. **Está en el §2.4 de las convenciones del Core**, es lo que revisa la compuerta, y se explica
con los ejemplos reales en la parte 4. Por ahora basta con la idea: la nota se escribe para alguien
que no estaba ahí.

## Cuando algo no cuadra

| Lo que dice Git | Qué pasó |
|---|---|
| `not a git repository` | Estás fuera de la carpeta del repositorio. `cd` a ella |
| `Permission denied (publickey)` | Git no encuentra tu llave de GitHub. Está en el manual de llaves |
| `nothing to commit, working tree clean` | No hay nada que confirmar: o no cambiaste nada, o ya lo confirmaste |
| `Please tell me who you are` | Falta la configuración de nombre y correo de más arriba |
| `Your branch is behind` | Hay cosas publicadas que tú no tienes. `git pull` |

Y una regla general: **Git casi nunca borra trabajo sin avisar.** Cuando algo sale mal, lo normal es
que se haya quedado a medias, no que se haya perdido. Antes de buscar un comando para arreglarlo,
escribe `git status`: suele decir exactamente qué hacer.

## Antes de hacer esto en un repositorio del área

Tres cosas que esta página todavía no cubre, y que en los repositorios de verdad son obligatorias:

| | Dónde está |
|---|---|
| **Trabajar en una rama**, nunca sobre lo publicado | Parte 3 |
| **Los *commits* van firmados** — sin firma, el autor es un texto que cualquiera puede escribir | Parte 4 |
| **El formato de la nota**, y la compuerta que hay que pasar antes de publicar | Parte 4 |

<div class="siguiente">

**Si hiciste la práctica de la carpeta, ya cerraste el ciclo completo.** Cambiar, elegir, confirmar
y mirar la historia es lo que harás todos los días; lo que viene después son matices de *dónde*
haces ese ciclo.

**La parte 3 es la rama**: cómo trabajar sin estorbar a nadie, que es lo que hace que cinco personas
puedan tocar el mismo proyecto a la vez.

</div>
