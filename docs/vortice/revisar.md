---
title: Revisar una solicitud de cambio, cuando no hay QA
---

# Revisar una solicitud

> No revisas código. Eso ya lo hicieron las compuertas. Revisas las cuatro cosas que ninguna de
> ellas puede ver.

## Lo que tienes que hacer

1. Abre la solicitud, pestaña **`Checks`**, flujo **`Revisión`**.
2. Arriba del registro hay un **resumen**. Ahí están **los dos criterios que te tocan** y dónde está
   la prueba de cada uno.
3. Responde **las cuatro preguntas** de abajo, escribiendo, en el cuerpo de la solicitud.
4. Aprueba, o no. Si algo no cuadra, **no apruebes y escribe por qué**.

Son dos criterios, no los diecinueve de la historia. Esa es la diferencia entre una revisión que se
hace y una que se abandona.

::: danger Primero responde, después apruebas
Si apruebas sin responder, **la solicitud se pone en rojo**. Aprobar es un clic y las cuatro
preguntas no.

¿Te pasó? Edita el cuerpo y responde. **No hace falta volver a aprobar:** el flujo se dispara solo
al editar.
:::

## Las cuatro preguntas

| # | La pregunta | Dónde miras |
|---|---|---|
| 1 | ¿La prueba **prueba** el criterio? | Los dos criterios que te tocaron |
| 2 | ¿Los huecos siguen abiertos? | Lo que escribió quien abrió, arriba |
| 3 | ¿Entró algo que la historia no pedía? | Los **nombres** de los archivos |
| 4 | ¿Se puede usar? | El mensaje de error, o la grabación |

Se responden **escribiendo**. Ninguna se marca con una casilla: una casilla se marca sin leer, y una
frase no.

### 1 · ¿La prueba prueba el criterio?

La compuerta comprueba que la prueba **cite** el criterio, no que lo **verifique**. Una prueba
llamada `[UNMD-BE-AC7] el código no cambia` que afirme cualquier otra cosa pasa en verde.

**Qué haces:** abre el criterio en la especificación, lee qué pide, abre la prueba, y di si lo que
**afirma** es eso.

::: details Ejemplo resuelto · `UNMD-BE-AC12`
Pide: *cuando se reactiva una unidad retirada, vuelve a ofrecerse.*

La prueba de dominio solo afirma que la unidad quedó activa, que es menos. La del adaptador cierra
la diferencia:

```java
assertThat(queries.page(false, PageRequest.of(0, 200)).content())
    .extracting(MeasurementUnitListItemView::id).contains(unit.getId());
```

**Aquí hay que parar.** Si ese `false` significara «incluye las retiradas», la prueba encontraría la
unidad aunque la reactivación no hubiera funcionado, y estaría en verde sin probar nada. La única
forma de saberlo es abrir la firma: `page(boolean includeRetired, Pageable)`. Con `false` el listado
las excluye, así que la prueba sí demuestra lo que dice.

Ese salto, de la prueba a la firma de lo que llama, es el trabajo entero de esta pregunta.
:::

### 2 · ¿Los huecos siguen abiertos?

Un hueco se cierra con **la decisión de alguien**, no con un valor que alguien eligió mientras
escribía la prueba.

**Qué haces:** lee lo que escribió quien abrió y comprueba que lo que la rama sembró corresponda.

::: details Ejemplo resuelto
La rama traía un documento de reconciliación con dieciséis diferencias y **cuatro marcadas
«Confirmar»** que llevaban seis días sin confirmar. Una: el mensaje de código duplicado nombra a la
unidad que ya lo tiene, y **quien pueda crear sin poder ver puede averiguar nombres probando
códigos**. Eso es una decisión, no una redacción.
:::

### 3 · ¿Entró algo que la historia no pedía?

**Qué haces:** mira los **nombres** de los archivos, no su contenido. Una migración de otro módulo,
un permiso que nadie pidió, una dependencia. No es que esté mal: es que debería viajar en su propia
historia, donde se pueda discutir.

::: details Ejemplo resuelto
La rama traía **dos** migraciones: una crea la tabla y otra añade unicidades que faltaban, porque
*«la anterior ya estaba aplicada»*. Aplicada **en una base local**, que no es desplegada. La regla
del equipo dice que una migración que nunca corrió en ningún ambiente **se edita en sitio**.

Puede que la decisión sea la correcta. Lo que no puede es quedar sin firmar.
:::

### 4 · ¿Se puede usar?

Esta sustituye al QA que no tenemos, y cambia según el repositorio.

::: code-group

```text [Servidor: ¿el error le sirve a quien lo recibe?]
Lo que muestre la pantalla va a ser lo que lea un operador. Un código estable y un
mensaje que diga QUÉ HACER, no qué falló por dentro.

  Sirve:    «Ya existe una unidad llamada METRO, sin contar mayúsculas. Puede estar
             retirada; si lo está, reactívala.»
  No sirve: «Constraint violation: uk_measurement_units_name»
```

```text [Pantalla: ¿se puede usar?]
Hay una GRABACIÓN en vídeo de cada recorrido, y hay que mirarla. Cómo se abre y qué
mirar está en «Revisar la pantalla».

No busques defectos de código. Mira la pantalla como quien va a trabajar con ella
ocho horas: qué pasa mientras carga, qué dice cuando no hay nada, si se puede
terminar la tarea sin adivinar.
```

:::

En la pantalla esta pregunta es la más larga, y la pregunta 1 tiene una trampa propia: una prueba
puede citar su criterio y no poder probarlo, porque corre en un DOM sin estilos. Las dos están en
**[Revisar la pantalla](/vortice/revisar-pantalla)**.

## Si encuentras algo

No todo bloquea. Tres salidas, y conviene decir cuál usas:

| Lo que viste | Qué haces |
|---|---|
| La prueba no prueba su criterio | **No apruebes.** Es el defecto que este proceso existe para atrapar |
| Una decisión sin firmar, que parece razonable | Apruébala **diciendo que la firmas tú**, o pide que la confirme quien manda en ese hueco |
| Algo que entró de más y no estorba | Apruébalo **y déjalo escrito**. Dicho es una decisión; callado es un olvido |

## Lo que NO es tu trabajo

- **Leer el diff línea por línea.** Cuarenta y cinco archivos no se revisan así.
- **Volver a comprobar lo que está en verde:** arquitectura, módulos, permisos, contrato, orden de
  las migraciones, vulnerabilidades, idioma del código. Eso son las
  [compuertas](/vortice/compuertas).
- **Buscar números de migración repetidos.** Eso corre solo y pone la solicitud en rojo. Lo que sí
  te toca es **verlo venir**: el resumen te lista los archivos que se pisan entre ramas.

## Quién te asigna

**Quien abre la solicitud elige a su revisor al crearla**, en `Reviewers`, según las designaciones
del equipo. No hay sorteo.

::: warning Si abres una solicitud y no asignas a nadie
Nadie se entera de que existe. **La asignación es el único paso del proceso que no está
automatizado**, y por eso es el único que se puede olvidar.
:::

> **Por qué un solo revisor, y por qué el rojo no bloquea.** La organización está en plan Free con
> repositorios privados: ese plan solo admite un revisor por solicitud, y no deja exigir la
> aprobación desde la configuración de GitHub (protección de ramas y reglas responden 403). Por eso
> la exigencia vive en el flujo, y lo que hace es dejar constancia en rojo, no impedir la fusión.
> El proceso funciona porque el equipo lo respeta.

## Por qué esta página existe

Medido antes de escribirla: **las cinco solicitudes anteriores se abrieron con el cuerpo vacío, y
dos se fusionaron sin que nadie las mirara.** Una se aprobó once segundos antes de fusionarse, con
cuarenta y tres archivos dentro.

No fue descuido de nadie. A quien revisa no se le dijo nunca **qué** mirar, y «revisa el código» de
un repositorio con decenas de [compuertas](/vortice/compuertas) no es una instrucción: es una tarde
perdida. Cuando revisar no tiene forma, se aprueba por cortesía.

En la organización no hay QA, y lo que lo sustituye no es mirar más código. Es mirar **otras cosas**.

## El recorrido completo

<Diagrama
  nombre="revision"
  titulo="Qué pasa cuando una historia entra en revisión: qué llena quien abre, qué prepara el flujo solo, y qué mira quien revisa" />
