---
title: Revisar una solicitud de cambio, cuando no hay QA
---

# Revisar una solicitud

> No revisas código. Eso ya lo hicieron treinta y cuatro compuertas. Revisas las cuatro cosas que
> ninguna de ellas puede ver.

## El recorrido, de un vistazo

<Diagrama
  nombre="revision"
  titulo="Qué pasa cuando una historia entra en revisión: qué llena quien abre, qué prepara el flujo solo, y qué mira quien recibe el turno" />

## Por qué esta página existe

Medido antes de escribirla: **las cinco solicitudes anteriores se abrieron con el cuerpo vacío, y
dos se fusionaron sin que nadie las mirara.** Una de ellas se aprobó once segundos antes de
fusionarse, con cuarenta y tres archivos dentro.

No fue descuido de nadie. A quien revisa no se le dijo nunca **qué** mirar, y «revisa el código» de
un repositorio con [treinta y cuatro compuertas](/vortice/compuertas) no es una instrucción: es una
tarde perdida. Cuando revisar no tiene forma, se aprueba por cortesía.

En la organización no hay QA, y lo que lo sustituye no es mirar más código. Es mirar **otras cosas**.

## No eliges: te toca

El turno sale de la rueda, `/.github/rueda-de-revision.json`, que está duplicado igual en los dos
repositorios. **Te toca revisar a quien va justo antes que tú**, y quien cierra la lista revisa a
quien la abre.

El flujo te asigna solo, al abrirse la solicitud. No hay que pedir revisor, y por eso no hay
solicitudes esperando a que alguien se ofrezca un viernes a las seis.

::: tip Si abres solicitudes y no estás en la rueda
El flujo lo avisa en su registro, y hay que añadirte **en los dos repositorios**. Mientras tanto no
tienes turno, y la rotación está incompleta sin que nada falle.
:::

> **Por qué un solo revisor.** La organización está en plan Free con repositorios privados, y ese
> plan solo admite uno por solicitud. Tampoco se puede exigir la aprobación desde la configuración
> de GitHub: protección de ramas y reglas responden 403 las dos. Por eso la exigencia vive en el
> flujo, y lo que hace es dejar la solicitud en rojo, no impedir la fusión.

## Lo que la máquina te deja preparado

En la solicitud, pestaña **Checks**, flujo **Revisión**. El resumen aparece encima del registro, y
trae tres cosas:

| En el resumen | Para qué te sirve |
|---|---|
| **Los dos criterios que te tocan** | Sorteados por el número de la solicitud, para que no se puedan escoger los fáciles |
| **Dónde está la prueba de cada uno** | Para que no la busques |
| **Los archivos que se pisan entre ramas** | Migraciones, permisos, códigos de error y contrato |

Son **dos** criterios, no los diecinueve de la historia. Esa es la diferencia entre una revisión que
se hace y una que se abandona.

::: warning Si el resumen dice que la rama no aporta ningún criterio
Es lo normal en un cambio de estándar, de dependencias o de infraestructura. **En una derivación de
funcionalidad no lo es:** significa que el código llegó sin pruebas que citen la especificación, y
eso la compuerta de trazabilidad lo deja pasar porque no hay nada que citar mal. Salta la pregunta 1
y responde las otras tres.
:::

## Las cuatro preguntas

Se responden **escribiendo**, en el cuerpo de la solicitud. Ninguna se marca con una casilla: una
casilla se marca sin leer, y una frase no.

Abajo va cada una con un ejemplo real, el de la solicitud del catálogo de unidades de medida.

### 1 · ¿La prueba prueba el criterio?

La compuerta comprueba que la prueba **cite** el criterio, no que lo **verifique**. Una prueba
llamada `[UNMD-BE-AC7] el código no cambia` que afirme cualquier otra cosa pasa en verde.

Abre los dos criterios que te tocaron, lee qué pide cada uno en la especificación, y di si lo que la
prueba **afirma** es eso.

> **El ejemplo.** `UNMD-BE-AC12` pide: *cuando se reactiva una unidad retirada, vuelve a ofrecerse.*
> La prueba de dominio solo afirma que la unidad quedó activa, que es menos. La del adaptador cierra
> la diferencia:
>
> ```java
> assertThat(queries.page(false, PageRequest.of(0, 200)).content())
>     .extracting(MeasurementUnitListItemView::id).contains(unit.getId());
> ```
>
> Aquí hay que parar. **Si ese `false` significara «incluye las retiradas», la prueba encontraría la
> unidad aunque la reactivación no hubiera funcionado**, y estaría en verde sin probar nada. La
> única forma de saberlo es abrir la firma del puerto: `page(boolean includeRetired, Pageable)`. Con
> `false` el listado las excluye, así que la prueba sí demuestra lo que dice.
>
> Ese salto, de la prueba a la firma de lo que llama, es el trabajo entero de esta pregunta.

### 2 · ¿Los huecos siguen abiertos?

Un hueco se cierra con **la decisión de alguien**, no con un valor que alguien eligió mientras
escribía la prueba. Lee arriba lo que declaró quien abrió, y comprueba que lo que la rama sembró
corresponda.

> **El ejemplo.** La rama trae un documento de reconciliación con dieciséis diferencias numeradas, y
> **cuatro marcadas «Confirmar»** que llevaban seis días sin que nadie las confirmara. Una de ellas:
> el mensaje de código duplicado nombra a la unidad que ya lo tiene, y la auditoría señaló que
> **quien tenga permiso de crear sin permiso de ver puede averiguar nombres probando códigos**. Eso
> es una decisión, no un detalle de redacción, y es exactamente lo que esta pregunta tiene que sacar
> a la superficie.

### 3 · ¿Entró algo que la historia no pedía?

Mira **los nombres de los archivos**, no su contenido. Una migración de otro módulo, un permiso que
nadie pidió, una guía de 251 líneas, una dependencia. No es que esté mal: es que debería viajar en
su propia historia, donde se pueda discutir.

> **El ejemplo.** La rama trae **dos** migraciones: una crea la tabla y otra le añade las unicidades
> que faltaban, con esta explicación dentro: *«va en una migración nueva y no en la anterior porque
> la anterior ya estaba aplicada»*. Aplicada **en una base local**, que no es lo mismo que
> desplegada. La regla del equipo dice que una migración que nunca corrió en ningún ambiente **se
> edita en sitio**, y el único costo es recrear el esquema local.
>
> Puede que la decisión sea la correcta. Lo que no puede es quedar sin firmar.

### 4 · ¿Se puede usar?

Esta es la que sustituye al QA que no tenemos, y cambia según el repositorio.

::: code-group

```text [Servidor: ¿el error le sirve a quien lo recibe?]
Quien recibe estos errores es la pantalla, y lo que muestre va a ser lo que lea un
operador. Un código estable y un mensaje que diga QUÉ HACER, no qué falló por dentro.

  Sirve:    «Ya existe una unidad llamada METRO, sin contar mayúsculas. Puede estar
             retirada; si lo está, reactívala.»
  No sirve: «Constraint violation: uk_measurement_units_name»
```

```text [Pantalla: ¿se puede usar?]
El recorrido de extremo a extremo quedó GRABADO y se adjunta a la corrida de
«Verificar», en Artifacts, como informe-recorridos-<número>. Descárgalo y míralo.

No busques defectos de código. Mira la pantalla como la miraría quien va a trabajar
con ella ocho horas: qué pasa mientras carga, qué dice cuando no hay nada que
mostrar, si se puede terminar la tarea sin adivinar.
```

:::

**En la pantalla esta pregunta es la más larga de las cuatro, y la pregunta 1 tiene una trampa
propia:** una prueba puede citar su criterio y no poder probarlo, porque corre en un DOM sin
estilos. Las dos están en [Revisar la pantalla](/vortice/revisar-pantalla), con cómo se abre la
grabación y qué mirar en ella.

## El orden importa: primero responde, después apruebas

La compuerta trata las dos mitades de la plantilla en momentos distintos, a propósito:

| Mitad | Cuándo se exige |
|---|---|
| La de quien abre | **Desde que la solicitud se abre.** Sin historia o con marcadores sin llenar, falla |
| La tuya | **Solo cuando ya hay una aprobación** |

Así que si apruebas y dejas las preguntas sin responder, **la solicitud se pone en rojo**. No es un
castigo: es que aprobar es un clic y las cuatro preguntas no, y sin ellas la revisión no deja
constancia de qué se miró.

::: tip Si te pasa
Edita el cuerpo de la solicitud y responde. **No hace falta volver a aprobar:** el flujo se vuelve a
disparar solo al editar.
:::

## Qué hacer con lo que encuentres

**Si algo no te cuadra, no apruebes y escribe por qué.** Rechazar no es desconfiar de nadie: es la
única parte del proceso que no puede hacer una máquina, y es el motivo de que tengas turno.

Y no todo lo que encuentres bloquea. Tres salidas, y conviene decir cuál estás usando:

| Lo que viste | Qué haces |
|---|---|
| La prueba no prueba su criterio | **No apruebes.** Es el defecto que este proceso existe para atrapar |
| Una decisión sin firmar, que parece razonable | Apruébala **diciendo que la estás firmando tú**, o pide que la confirme quien manda en ese hueco |
| Algo que entró de más y no estorba | Apruébalo **y déjalo escrito**. Dicho es una decisión; callado es un olvido |

## Lo que no es tu trabajo

- **Leer el diff línea por línea.** Cuarenta y cinco archivos no se revisan así, y por eso no se
  revisan.
- **Volver a comprobar lo que está en verde:** arquitectura, módulos, permisos, contrato, orden de
  las migraciones, vulnerabilidades, idioma del código. Eso son las compuertas, y están en su
  [propia página](/vortice/compuertas).
- **Buscar números de migración repetidos.** Esa comprobación corre sobre el resultado de la fusión
  y pone la solicitud en rojo sola. Lo que sí te toca es **verlo venir**: por eso el resumen te
  lista los archivos que se pisan entre ramas, seis días antes de que renumerar deje de ser un
  cambio de nombre.
