---
title: Nuestra estructura, desarrollo sobre tronco
---

# Nuestra estructura: desarrollo sobre tronco

> **Hasta aquí, Git. Desde aquí, nosotros.** Las tres partes anteriores valen en cualquier empresa
> del mundo; esta describe cómo están montados **nuestros** repositorios y por qué.
>
> Esto es lo que rige en todos los repositorios del área, **y en los que se creen de ahora en
> adelante**.

## Qué es «desarrollo sobre tronco», y qué no es

Es fácil creer que se trata de tener pocas ramas. No es eso.

> **Lo que hace a un flujo desarrollo sobre tronco no es el número de ramas: es la duración.**

Una rama que vive tres semanas es gitflow aunque el repositorio tenga una sola rama larga. Una que
vive tres días es desarrollo sobre tronco aunque haya tres. **La regla, por tanto, es la duración**,
y todo lo demás de esta página existe para que esa regla se pueda cumplir.

## Las tres ramas largas

| Rama | Ambiente | Qué vive ahí |
|---|---|---|
| `master` | **producción** | Lo liberado, **y el estándar**: dependencias, *skills*, el ejemplar, las compuertas |
| `test` | pruebas de negocio | Lo que alguien de operaciones entra a comprobar antes de liberar |
| `develop` | desarrollo | La integración de lo que el equipo va terminando |

**El tronco es `develop`.** `test` y `master` **no son líneas de desarrollo paralelas**: son
promoción. Nadie desarrolla en ellas.

## Dos direcciones, y las reglas son distintas

Esta es la idea que ordena todo lo demás, y no es evidente hasta que se hacen dos funcionalidades
seguidas: **hay dos clases de trabajo, y se mueven en sentidos opuestos.**

<Diagrama
  nombre="direcciones"
  titulo="La funcionalidad sube y siempre se revisa; lo transversal baja desde master con fusión directa" />

### Hacia arriba: nunca sin revisión

```
feature/vort-123-… ──solicitud──▶ develop ──solicitud──▶ test ──solicitud──▶ master
```

**Ninguna excepción.** Tampoco para una línea, tampoco con prisa. Es el único punto del proceso
donde alguien que no escribió el cambio lo mira antes de que llegue a producción.

**Y si el cambio se generó con asistencia, esa revisión es obligatoria por política corporativa.**

### Hacia abajo: sin solicitud, porque no hay nada que proponer

```
master ──git merge──▶ develop ──git merge──▶ test
```

Lo transversal —una dependencia actualizada, la corrección de una *skill*, una compuerta nueva—
**nace en `master` y desciende**, porque es lo que todas las ramas necesitan tener antes de empezar.

**Esto no es una laguna de control.** Lo que baja ya se revisó al entrar a `master`: pedir una
solicitud de cambio sería pedir que alguien apruebe por segunda vez lo mismo. Y lo que de verdad
produciría es retraso en el peor sitio posible — **los ambientes compartidos quedándose atrás en una
dependencia vulnerable**.

## Por qué tres ramas y no una

Las convenciones del Core describen **una sola rama larga**, protegida y sin envío directo. Es la
regla correcta para un proyecto que despliega a un sitio. **Nosotros desplegamos a tres**, y eso
cambia el problema.

Tres ambientes que se pueblan desde el mismo repositorio necesitan tres puntas distintas. Con una
sola rama larga, la única forma de tener tres estados es desplegar etiquetas a mano — y entonces
**el estado de cada ambiente deja de ser visible en Git**, que es justo lo que uno quiere poder mirar
cuando algo falla en pruebas y no en desarrollo.

La decisión completa, con las alternativas que se descartaron, está en el **ADR-039**.

## La solicitud de cambio

Es el instrumento de la dirección de subida. Lo que pide:

| | |
|---|---|
| **Al menos un revisor** que apruebe | Dos para seguridad, infraestructura, contratos públicos o migraciones irreversibles |
| **El revisor no es el autor** | En ningún caso. Nadie se aprueba a sí mismo |
| **La integración en verde** | Si la compuerta falla, no se aprueba aunque el código «se vea bien» |
| **La rama al día con su destino** | Por eso se trae lo nuevo del tronco **antes** de pedir la revisión, no después |
| **Las conversaciones resueltas** | Un comentario abierto es una pregunta sin responder |

**Quien fusiona es el autor, después de la aprobación.** No es un detalle de permisos: mantiene la
responsabilidad del cambio con quien lo escribió hasta que llega a producción.

> **Los comentarios son sobre el código, nunca sobre la persona.** «Esta función tiene efectos
> colaterales ocultos» ✅. «Escribiste mal esta función» ❌. Es una regla del Core y se aplica en las
> dos direcciones: quien recibe un comentario así tampoco tiene que defenderse.

## Las tres ramas se verifican, no solo las solicitudes

Las solicitudes de cambio siempre pasaron por la compuerta. **Los envíos a `develop` y a `test`
no**, y ahí había un hueco: una promoción hacia abajo movía una rama de ambiente **sin que nada la
comprobara**.

> **El hueco no era teórico.** `test` del frontend llegó a llevar tres *commits* de retraso, incluido
> el que cerraba tres avisos de seguridad en una dependencia. Nadie se habría enterado: nada
> verificaba esa rama.

Desde el 2026-10-01, la integración se dispara también en los envíos a las tres ramas largas. **Qué
comprueba cada compuerta y con qué comando cambia según el repositorio**, y eso es la parte 5.

## Los *commits* van firmados

**Sin firma, el autor de un cambio es un texto que cualquiera puede escribir.** La llave se crea una
sola vez, en [preparar el equipo](/equipo/llaves); dentro de cada repositorio se activa así:

```powershell
git config commit.gpgsign true
```

Y se comprueba antes de publicar la rama:

```powershell
git log --format="%h %G? %an — %s" origin/develop..HEAD
```

| Marca | Significado |
|---|---|
| `G` | Firmado y verificado. Es lo que debe salir |
| `N` | **Sin firmar.** Falta la configuración de arriba |
| `E` | **Firmado con una llave que no se puede verificar.** Peor que `N`, porque parece firmado |

> ⚠️ **Compruébalo antes de enviar la rama.** Corregir la firma reescribe el *commit*, y reescribir
> una rama ya publicada es lo que la parte 3 pide evitar. Lo barato es que nunca falte: deja puesto
> `commit.gpgsign` y no vuelvas a pensar en esto.

## La regla que sostiene todo lo demás

**Una rama de trabajo vive días, y vuelve al tronco antes de que `develop` se le haya ido tan lejos
que integrarla sea un proyecto aparte.**

**Si una rama lleva semanas abierta, el problema no es la rama: es que la tarea era demasiado grande
y había que partirla.** Esa es la conversación que hay que tener, y es mejor tenerla el segundo día
que el vigésimo.

<div class="siguiente">

**Ya sabes dónde cae cada cosa y por qué.** Las ramas largas, las dos direcciones, qué pide una
solicitud de cambio y qué comprueba la integración.

**La parte 5 es la rutina del día**: con qué empiezas la mañana, en qué orden van los pasos antes de
pedir una revisión, y los comandos exactos de la compuerta de cada repositorio.

</div>
