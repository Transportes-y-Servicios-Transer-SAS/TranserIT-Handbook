---
title: Vórtice, qué estás construyendo y cómo se decide
---

# Vórtice: qué estás construyendo

> Esta sección es **del proyecto**, no del área. El resto del manual vale en cualquier repositorio
> de Transer; lo de aquí describe cómo trabaja Vórtice.
>
> Da por hecho que ya tienes [el equipo preparado](/equipo/herramientas) y que leíste
> [Git, de cero](/git/que-es) — al menos hasta la parte 4.

## Qué es

**Vórtice reemplaza a Milenio.** No es una versión nueva: es otro sistema, que se construye al lado
mientras Milenio sigue operando. Entra por partes, y **cada pieza entra cuando está completa y
probada**.

Hoy estamos en la base: las personas, las sedes, los permisos. Sobre eso se apoya lo demás.

## El método, en una frase

> **La especificación gobierna el código.**

El esquema, el código, el contrato y las pruebas **se derivan de ella**, en un orden que no es
negociable, y al final se comprueba que se sigan correspondiendo.

Eso tiene una consecuencia que cuesta interiorizar:

> ⚠️ **Si la especificación no dice algo, eso no es permiso para decidirlo.** Es un hueco, y se
> pregunta.

Y un reparto, medido por líneas sobre las especificaciones que existen:

| | |
|---|---|
| **43 %** | Conocimiento que **solo tiene el negocio** — las reglas, los permisos, de dónde salió cada exigencia |
| **57 %** | Se **deriva** de lo anterior — los criterios, los códigos de error, lo que el sistema expone |

**A nadie del negocio se le pide que escriba una especificación.** Responde siete preguntas y el
resto se arma con sus respuestas delante. Están en [el flujo](/vortice/flujo).

## Dónde se decide qué

<Diagrama
  nombre="precedencia"
  titulo="Los ADR gobiernan la especificación; la especificación gobierna el código, el contrato y las pruebas" />

| | Decide |
|---|---|
| **Los ADR** · `TranserIT-Architecture` | Arquitectura y proceso |
| **`convenciones-codigo.md`** | El estándar del área, y las desviaciones declaradas |
| **La especificación** · `vortice-specs` | El negocio de una funcionalidad |
| **El contrato** · `contract/openapi.json` | Lo que el servidor expone, y de ahí sale la pantalla |
| **El tablero** | Qué se hace y cuándo |

> **Por qué ninguna especificación te manda a leer un ADR.** El repositorio de arquitectura **no se
> clona con el proyecto**, y es deliberado: lo que un ADR decide va **transcrito** en la
> especificación, con el número al lado como rastro.
>
> Una especificación que obligara a abrir otro repositorio sería una que media parte del equipo no
> puede ejecutar. Ya pasó, y dejó una derivación detenida.

## Los repositorios

| Repositorio | Qué hay | Lo clonas si… |
|---|---|---|
| **`vortice-backend`** | El servidor | trabajas en servidor |
| **`vortice-frontend`** | La pantalla | trabajas en pantalla |
| **`vortice-specs`** | **Las especificaciones**, el verificador de forma y la publicación al tablero | **siempre** |
| **`TranserIT-Architecture`** | Los ADR, las convenciones y el stack | quieres saber por qué algo es como es |

## Tu primer día

```powershell
# 1. Clona lo tuyo y las especificaciones
git clone git@github.com:LA_ORGANIZACION/REPOSITORIO_QUE_TE_TOCA.git
git clone git@github.com:LA_ORGANIZACION/vortice-specs.git

# 2. Comprueba que lo que recibiste está entero, ANTES de tocar nada
cd vortice-backend;  .\mvnw.cmd verify                      # servidor
cd vortice-frontend; bun install; bun x vitest run gates/   # pantalla

# 3. Comprueba que las especificaciones están bien formadas
cd vortice-specs; .\verificar-forma.ps1
```

> ⚠️ **Si algo de eso sale rojo, no empieces a trabajar encima: avisa.** Heredar un árbol roto hace
> que el primer fallo tuyo sea indistinguible del que ya estaba, y eso cuesta días.

## Las ramas

Las mismas de todo el área, y están explicadas en [nuestra estructura](/git/estructura): tres largas
—`develop` como tronco, `test`, `master`— la funcionalidad sube siempre por solicitud de cambio y lo
transversal baja con fusión directa.

**Lo único propio de aquí** es la regla de qué va a dónde cuando trabajas sobre el estándar:

> **Lo que es estándar va a `master`; lo que es derivación va en su rama.** La regla práctica: si
> `git status` lo muestra como `??` suele ser derivación; si como `M` sobre algo que ya estaba,
> suele ser estándar.

Está en el **ADR-039**, con sus alternativas y por qué se descartaron.

<div class="siguiente">

**Ya sabes qué se construye, qué manda sobre qué y con qué repositorios.**

**Lo siguiente es el flujo**: cómo una pregunta al negocio acaba siendo código con sus pruebas.

</div>
