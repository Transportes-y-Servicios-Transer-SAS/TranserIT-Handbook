---
title: De la historia a la solicitud
---

# De la historia a la solicitud

> Te asignaron una historia. Esto es todo lo que pasa desde ese momento hasta que pides que te la
> revisen, en orden y con los comandos exactos.

## El recorrido, de un vistazo

| | Paso | Dónde |
|---|---|---|
| **1** | Leer la historia y comprobar que está lista | el tablero |
| **2** | Crear la rama | tu repositorio |
| **3** | Dejar las fuentes al día | el verificador |
| **4** | Generar los tipos del contrato | solo la pantalla |
| **5** | Derivar | la sesión con el agente |
| **6** | Verificar | tu repositorio |
| **7** | Confirmar y publicar | git |
| **8** | Abrir la solicitud de cambio | GitHub |

## 1 · Antes de tocar nada: ¿está lista?

Toda historia trae un **Definition of Ready**: lo que tiene que existir para poder empezar. Léelo
primero, y comprueba una por una las cosas que nombra.

**Si falta alguna, no empieces: pídela.** No es burocracia, es la diferencia entre derivar y adivinar.
Lo que más falta, por orden: la especificación sin confirmar en `vortice-specs`, el contrato del
servidor sin publicar, y una regla de negocio que nadie decidió.

::: warning La historia que pide algo que el servidor no promete
Si la especificación de la pantalla pide un dato o una operación que el contrato no publica,
**ahí se para**. La pantalla no pide cambios al servidor para que le quede cómodo un ejemplo, y el
servidor no inventa operaciones. Se levanta en el tablero y se decide.
:::

## 2 · La rama

Sale de `develop`, nunca de `master`, y el nombre lleva el identificador de la historia:

```powershell
git switch develop
git pull
git switch -c feature/vort-142-liquidacion-retencion
```

La forma es `tipo/vort-123-nombre-sustancial`, y está explicada en [Ramas](/git/ramas). **En
minúsculas**, siempre: Windows no distingue mayúsculas y `VORT-143` y `vort-143` pueden pisarse entre
dos máquinas del mismo equipo.

## 3 · Preparar la derivación

El mismo comando hace **dos cosas**, y el nombre de la funcionalidad decide si hace una o las dos.

**Sin nombre: pone las fuentes al día y nada más.** Sirve para comprobar cómo están tus clones en
cualquier momento, sin ir a derivar nada.

::: code-group

```powershell [vortice-backend]
.\verificar-fuentes.ps1
```

```bash [vortice-frontend]
bun run scripts/verificar-fuentes.ts
```

:::

**Con el nombre: además te dice qué vas a derivar.** Es lo que se usa al empezar una historia.

::: code-group

```powershell [vortice-backend]
.\verificar-fuentes.ps1 sedes
```

```bash [vortice-frontend]
bun run scripts/verificar-fuentes.ts sedes
```

:::

```text
  «sedes» se deriva de:
    especificación  ...\vortice-specs\backend\sedes-be.md
    requerimiento   ...\vortice-specs\requerimientos\core\sedes.md
```

En los dos casos te dice de qué commit vas a leer. **Apunta ese commit: va al mensaje del commit de
la derivación.** Todo el detalle está en [De dónde se lee](/vortice/fuentes).

## 4 · Los tipos del contrato · solo la pantalla

```bash
bun run scripts/generate-api-types.ts C:/ruta/a/vortice-backend
```

Los tipos **no se escriben a mano**: salen del contrato del servidor. Si el generador se queja de que
el contrato está sin confirmar en el clon, hazle caso: generar contra algo que nadie más tiene
produce una pantalla que compila en tu equipo y en ningún otro.

## 5 · Derivar

La sesión arranca con una frase:

```text
Implementa la especificación de sedes
```

**Lo que hace la skill, y conviene saberlo para notar cuando no lo hizo:** lee la especificación del
clon, numera los criterios, escribe el código y las pruebas que los citan, y declara cada criterio en
el manifiesto. No empieza por el código: empieza por entender qué exige cada criterio.

**Tres cosas que no se hacen, pase lo que pase:**

| No se hace | Por qué |
|---|---|
| Inventar símbolos de un marco | Si no puedes señalar dónde está definida una clase, no la escribas |
| Sacar el negocio del módulo de referencia | El ejemplar tiene **formas**, no dominio. El negocio sale de la especificación |
| Decidir una regla que la especificación no dice | Se anota en el tablero y se pregunta. Una regla inventada se ve igual de bien que una real |

::: tip Lo que aparece y la especificación no dice
Pasa en casi toda derivación, y **no es un fallo de nadie**: una forma de dato, un mensaje, un caso
límite. Se anota en la historia **mientras trabajas**, no al final, y sigues con lo demás. Lo que no
se hace es rellenarlo: ese hueco es información, y rellenarlo lo borra.
:::

## 6 · Verificar, antes de pedir revisión

::: code-group

```bash [vortice-frontend]
bun run type-check        # vue-tsc, incluidas las plantillas
bun run verify:oxlint     # red rápida
bun run verify:eslint     # fronteras entre módulos y capas
bun run test:unit:run     # pruebas y compuertas
bun run build             # la construcción real
```

```powershell [vortice-backend]
.\mvnw verify
```

:::

Y una vez, antes de pedir revisión, el verificador **con el ejemplar injertado**, que mide lo que las
compuertas solas no ven:

```powershell
.\.claude\skills\verify-reference-module.ps1
```

**Si algo falla, el mensaje dice qué hacer.** Están escritos para eso: nombran el archivo, el criterio
o la clave, y qué se esperaba. Lo que **no** se hace es cambiar la compuerta para que pase. Si crees
que la compuerta está mal, eso es una conversación, no un *commit*.

Qué vigila cada compuerta está en [Las compuertas](/vortice/compuertas).

## 7 · Confirmar y publicar

Los *commits* van **firmados**, y la firma se activa una vez por repositorio:

```powershell
git config commit.gpgsign true
```

El mensaje sigue la convención de tipos (`feat:`, `fix:`, `docs:`) y **dice de qué commit de la
especificación salió**: la procedencia es un commit, no una huella.

```powershell
git push -u origin feature/vort-142-liquidacion-retencion
```

## 8 · La solicitud de cambio

**Contra `develop`.** Nunca contra `master` ni contra `test`: hacia arriba se sube por revisión, rama
por rama, y eso está en [Nuestra estructura](/git/estructura).

**El cuerpo viene con plantilla, y la mitad de arriba la llenas tú.** Esto es lo que pide:

| En la solicitud | Para qué |
|---|---|
| Qué historia cierra | `VORT-142`, para poder leer sus criterios |
| Qué entra, en una frase | Qué puede hacer alguien que antes no podía. No listes archivos: el diff ya los lista |
| **Lo que decidiste tú, y la especificación no decía** | Una forma, un valor por omisión, un orden, un mensaje. Si no hubo nada, «Nada» |
| Qué huecos declarados toca esta historia | Lo que la especificación dejó abierto y con dueño. «Ninguno» vale |

Ninguna se deja en blanco: **la compuerta de revisión falla si queda un `_(pendiente)_` en tu
mitad**, y también si el cuerpo no nombra una historia. La tercera existe por una medición, no por
gusto: tres derivaciones seguidas produjeron el mismo defecto porque el documento calló, alguien
decidió, y nadie se enteró hasta que el dato ya estaba sembrado.

**La verificación corre sola sobre la solicitud**, y también sobre las tres ramas largas. Una
solicitud en rojo no se revisa: se arregla primero.

## Y después

La revisión puede pedirte cambios, y casi siempre pide alguno. Cuando se aprueba, la solicitud se
fusiona a `develop` y de ahí sube por su camino.

**El turno de revisarla no se pide: lo reparte la rueda y lo asigna el flujo.** Qué mira quien lo
recibe, y por qué no es el código, está en [Revisar una solicitud](/vortice/revisar). Vale la pena
leerla aunque hoy te toque abrir y no revisar: **es la lista de lo que te van a preguntar.**

**La rama se borra al fusionar.** Lo que vale queda en `develop`; una rama vieja en el remoto solo
confunde a quien busca la actual.
