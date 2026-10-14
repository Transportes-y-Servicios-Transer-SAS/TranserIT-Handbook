---
title: Qué es Git y qué problema resuelve
---

# Qué es Git, y qué problema resuelve

> **Esta página no trae un solo comando, y es a propósito.** Está escrita para entender qué hace el
> equipo con el control de versiones. Si al terminar puedes explicarle a alguien qué pasa cuando
> alguien «sube un cambio», hizo su trabajo.
>
> Los comandos empiezan en la parte 2.

## El problema, que ya lo has vivido

No con código. Con un documento:

<div class="caos">

`informe.docx` · `informe-v2.docx` · `informe-v2-REVISADO.docx` ·
`informe-v2-REVISADO-JUAN.docx` · `informe-FINAL.docx` · `informe-FINAL-ESTE-SI.docx`

</div>

Y al final del día hay tres preguntas que nadie puede responder:

| | |
|---|---|
| **¿Cuál vale?** | El de la fecha más nueva, salvo que alguien guardara encima del viejo |
| **¿Qué cambió entre uno y otro?** | Abrirlos los dos y comparar a ojo |
| **¿Quién cambió esto, y por qué?** | Preguntando. Si esa persona sigue en la empresa |

**Eso es exactamente el problema que Git resuelve.** No es una herramienta de programadores: es una
herramienta de *gente que cambia archivos y necesita saber qué pasó con ellos*.

## Qué es, en una frase

> **Git guarda un solo archivo y toda su historia aparte**, de forma que puedas ver qué cambió,
> quién lo cambió, cuándo y por qué — y volver atrás si hace falta.

No hay `v2`. No hay `FINAL`. Hay **un archivo** y **una línea de tiempo**.

Ese mismo informe, llevado así, se ve de esta otra forma:

<Diagrama
  nombre="historia"
  titulo="El mismo informe, con su historia: un solo archivo, y cada punto dice qué cambió, quién lo cambió y por qué" />

## Las cuatro ideas, y con estas cuatro basta

### 1 · El repositorio: la carpeta que tiene memoria

Un **repositorio** es una carpeta normal con una diferencia: **recuerda todo lo que le ha pasado.**

Cada persona tiene una copia completa en su equipo —con toda la historia, no solo la última
versión— y hay una copia central, en nuestro caso en GitHub, que es con la que todos se sincronizan.

### 2 · El *commit*: una foto con una nota pegada

Y aquí está la idea que más cuesta, porque **no es «guardar»**.

Guardar un documento **borra lo anterior**. Un *commit* **no borra nada**: añade un punto nuevo a la
línea de tiempo y **obliga a escribir por qué**.

| | Guardar un documento | Un *commit* |
|---|---|---|
| **Lo anterior** | Se reemplaza. Deja de existir | Se queda. Se añade un punto nuevo |
| **Qué cambió** | Hay que abrir los dos y compararlos a ojo | Línea por línea, y lo dice solo |
| **Quién y cuándo** | La fecha del archivo, y poco más | Queda registrado |
| **Por qué** | Nadie lo pregunta | **Es obligatorio escribirlo** |

**Esa nota es la que convierte la historia en algo útil.** Sin ella sabrías *qué* cambió pero no
*para qué*, y dentro de un año eso es casi lo mismo que no saber nada.

### 3 · La historia: lo que de verdad compras

Tener la historia completa te da tres cosas que, por separado, ya justificarían la herramienta:

| | |
|---|---|
| **Volver atrás** | Algo se rompió el martes. Se mira qué entró el martes y se deshace **eso**, sin tocar el resto |
| **Saber quién y por qué** | Cada línea de cada archivo sabe de qué *commit* vino, y ese *commit* trae su nota y su autor |
| **Rastro para auditoría** | No es un registro que alguien lleva aparte y puede olvidar: **es el propio archivo** |

### 4 · La rama: trabajar sin estorbar a nadie

Una **rama** es tu copia de todo el expediente, para trabajar tranquilo. Lo que haces ahí **no lo ve
nadie** hasta que tú lo entregas, y mientras tanto **lo que está publicado sigue funcionando**.

<Diagrama
  nombre="rama"
  titulo="Trabajar en una rama: te separas de lo publicado, haces tus cambios aparte, y alguien los revisa antes de devolverlos" />

**Esto es lo que permite que cinco personas trabajen a la vez sin pisarse.** Cada una en su rama;
al final, cada una devuelve lo suyo.

## Y cuando dos personas tocan lo mismo

Casi siempre Git junta los dos trabajos solo, sin preguntar: si tú cambiaste el capítulo 3 y otro el
capítulo 7, no hay nada que decidir.

Pero si los dos cambiaron **la misma línea**, aparece lo que se llama un **conflicto**. Y el nombre
engaña:

> **Un conflicto no es un error ni un daño. Es una pregunta.**
>
> Git dice: *«aquí dos personas escribieron cosas distintas en el mismo sitio, y no voy a adivinar
> cuál vale. Decide tú.»*
>
> **Que pregunte es exactamente lo que quieres.** La alternativa sería que eligiera en silencio.

## Las cinco palabras que vas a oír

Con estas cinco se sigue el noventa por ciento de una conversación del equipo:

| Palabra | Lo que significa |
|---|---|
| **Repositorio** | La carpeta con memoria. Nosotros tenemos varios, uno por sistema |
| **Commit** | Un punto en la historia: qué cambió, quién, cuándo y **por qué** |
| **Rama** | Una copia para trabajar sin estorbar. Se devuelve cuando está lista |
| **Solicitud de cambio** | *(o «PR»)* Pedir que lo de tu rama entre a lo publicado. **Alguien lo revisa antes** |
| **Fusionar** | Juntar el trabajo de una rama con el de otra |

Y una de regalo, porque se oye mucho y confunde:

> **GitHub no es Git.** Git es la herramienta, y funciona sin internet, en tu equipo. GitHub es el
> sitio donde guardamos la copia central y donde se revisan las solicitudes de cambio. Se puede usar
> Git sin GitHub; no al revés.

## Qué NO es Git

Tres confusiones que conviene quitar de en medio desde el principio:

| No es | Por qué importa la diferencia |
|---|---|
| **Una copia de respaldo** | Un respaldo guarda el estado de ayer. Git guarda **todos** los estados, con su razón. Que sirva de respaldo es un efecto secundario |
| **Una carpeta compartida** | En una carpeta compartida, dos personas se pisan. Aquí cada una trabaja aparte y hay un momento declarado para juntar |
| **Un sitio donde se guardan documentos** | Es para lo que **cambia y hay que poder auditar**. Un contrato firmado en PDF no va aquí |

## Lo que sigue

<div class="siguiente">

**Si llegaste hasta aquí y lo de arriba tiene sentido, esta página cumplió.** No hace falta más para
entender de qué habla el equipo.

**La parte 2 empieza con comandos** y está pensada para quien va a usarlo. Si no es tu caso, puedes
parar acá sin perderte nada.

</div>

<style scoped>
.caos {
  display: flex; flex-wrap: wrap; gap: 0.5rem 0.75rem;
  padding: 1rem 1.25rem; margin: 1.25rem 0;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.9;
}
</style>
