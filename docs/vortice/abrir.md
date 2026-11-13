---
title: Abrir una solicitud de cambio
---

# Abrir una solicitud

> Son cuatro casillas de texto y diez minutos. Es la mitad del trabajo de revisar, y la única que
> no puede hacer ninguna máquina.

Vale igual para **servidor** y **pantalla**: la plantilla es la misma, solo cambian los ejemplos.

## Los seis pasos

1. **Abre la solicitud en GitHub.** La plantilla aparece sola en el cuerpo.
2. **Escribe la historia** donde dice `VORT-`. Sin ella, la verificación falla.
3. **Asigna a tu revisor** en `Reviewers`, a la derecha. Según las designaciones del equipo.
4. **Responde las tres secciones** de abajo, reemplazando cada `_(pendiente)_`.
5. **Guarda.** La verificación corre sola.
6. **No borres `Para quien revisa`.** Esa mitad la llena quien revise, después.

::: tip ¿Ya la abriste con el cuerpo vacío?
Entra a la solicitud, pulsa el **lápiz** (`Edit description`) arriba a la derecha de la descripción,
y escribe ahí. No hace falta empujar nada: el flujo se vuelve a disparar al guardar.
:::

## Qué va en cada sección

### 1 · Historia

El identificador, tal cual: `VORT-125`. Nada más.

**Por qué lo pide:** sin él nadie puede ir del código al acuerdo que lo originó. La verificación
falla si no aparece.

### 2 · Qué entra, en una frase

**Qué puede hacer alguien que antes no podía.** No listes archivos: el diff ya los lista.

| Sirve | No sirve |
|---|---|
| «Se puede registrar, editar y retirar unidades de medida, y buscarlas por nombre o símbolo» | «Se agregó el módulo de unidades con sus controladores, servicios y repositorios» |

La segunda describe el diff. La primera dice para qué sirve el trabajo.

### 3 · Lo que decidiste tú, y la especificación no decía

**La sección que más vale, y la que más se deja en blanco.** Lo que tuviste que resolver por tu
cuenta porque el documento callaba.

| En el servidor | En la pantalla |
|---|---|
| Una forma, un valor por omisión, un orden, un mensaje | Un texto, un orden, un estado vacío, un plazo, qué pasa mientras carga |

::: warning Por qué existe esta sección
Tres derivaciones seguidas tuvieron el mismo defecto (el dígito de verificación, el formato del
teléfono y el patrón del número de documento), y las tres por lo mismo: **la especificación calló,
alguien decidió, y nadie se enteró** hasta que el dato ya estaba sembrado en una migración.

Decidir no está mal: hay que hacerlo para avanzar. Lo que no puede es quedar sin firmar.
:::

Si no decidiste nada, escríbelo: *«nada, la especificación cubría todos los casos»*. Es una
respuesta válida y se tarda cinco segundos. Dejarlo en `_(pendiente)_` no lo es.

### 4 · Huecos declarados que esta historia toca

Los huecos que la especificación dejó abiertos y que tu rama **roza o cierra**. Si cerraste uno, di
con qué valor y quién lo decidió.

> Ejemplo: *«UNMD-BE-AC9 dejaba abierto el tope del símbolo. Se sembró en 8 caracteres, decidido con
> el dueño del catálogo el 2026-11-04.»*

## Un ejemplo resuelto, de una solicitud real

La del catálogo de unidades de medida, `VORT-125`. Diecinueve criterios y cuarenta y cinco archivos.

::: details Ver el cuerpo completo

````markdown
## Historia

VORT-125

## Qué entra, en una frase

Se pueden registrar, consultar, editar, retirar y reactivar unidades de medida, con su
nombre, su abreviatura y su código internacional, y se siembran las que usa la operación
hoy.

## Lo que decidiste tú, y la especificación no decía

Siete cosas. Las tengo todas en `docs/reconciliacion/unidades-medida.md`, y estas son
las que de verdad hay que firmar:

- **El código de las sembradas no significa nada** (H1). La especificación dice que el
  código es la llave del catálogo, pero el archivo de origen no trae código, y
  `TUBO CARTUCHO` ni siquiera cabe en los diez caracteres de la columna. Hice lo mismo
  que marcas: vale su identificador, del 1 al 20.

- **Un código internacional en blanco cuenta como «sin código»** (H4), igual que el
  código tributario de tipos de documento. Si no, dos unidades con el campo vacío
  chocarían en la unicidad parcial.

- **Las mayúsculas del código internacional NO se normalizan** (H4): `mtr` y `MTR` son
  distintos. Los de la Recommendation 20 van siempre en mayúsculas, así que si se quiere
  imponer, es una regla nueva que alguien tiene que decidir.

- **El error de código duplicado nombra a la unidad que lo tiene** (H7): «ya lo tiene
  METRO (12)». Mismo patrón que tipos de documento, ciudades, prioridades y tipos de
  sede. **Dos costos que señaló la auditoría:** quien tenga `CREATE` sin `VIEW` puede
  averiguar nombres probando códigos, y cada choque toma una segunda conexión para leer
  a la dueña. Si se descarta aquí, hay que revisarlo en los otros cuatro.

- **Dos migraciones y no una** (V014 y V015). La segunda añade las unicidades de nombre
  y abreviatura, que faltaban, y va aparte porque V014 ya estaba aplicada. Si una base
  ya tiene dos unidades con el mismo nombre, la migración falla y nombra el valor
  repetido: cuál de las dos se corrige es una decisión sobre datos, no de una migración.

## Huecos declarados que esta historia toca

- **H6, los códigos internacionales no están confirmados contra la DIAN**, y el de UNIDAD
  estaba sin decidir entre cinco. Sembré los de la tabla de la especificación, como pide
  `AC17`. **Antes de que la facturación electrónica los lea, quien la lleve tiene que
  confirmarlos** contra la Tabla 6 del anexo técnico 1.9. Cambiarlos después es una
  edición desde la pantalla.

- **H3, el campo afectado en los 409.** `AC3`, `AC4` y `AC6` piden el código «indicando
  el campo», y el cuerpo solo trae `fields` en `VALIDATION_FAILED`. Respondo 409 con su
  código y sin `fields`, como marcas y colores. **Es un hallazgo abierto en los dos
  módulos**, no de esta historia.
````

:::

### El mismo catálogo, en la pantalla

`VORT-126`, la otra mitad. Diecisiete criterios, y un recorrido grabado de ocho pasos.

::: details Ver el cuerpo completo

````markdown
## Historia

VORT-126

## Qué entra, en una frase

La pantalla del catálogo de unidades de medida: se ven las veinte con su abreviatura y
su código internacional, se registran, se editan, se retiran y se reactivan, y la
entrada aparece en el menú solo para quien tenga permiso.

## Lo que decidiste tú, y la especificación no decía

- **La abreviatura no se uniforma a mayúsculas, ni al pintarla ni al escribirla.** La
  especificación no lo decía, pero en el Sistema Internacional `m` es metro y `M` no es
  nada, así que uniformar la columna convertiría un símbolo legal en otro que no existe.
  La columna **no lleva `text-transform`**, y el formulario tampoco: ni al pintar ni con
  el teclado en pantalla.

  **Eso no lo puede probar una prueba de unidad**, porque el DOM no tiene estilos. Por
  eso `UNMD-FE-AC2` se verifica en el recorrido y no entre las de unidad.

- **Una unidad sin código internacional lo dice con un texto, y la celda no queda en
  blanco** (`UNMD-FE-AC6`). La especificación no decía qué pintar; una celda vacía se
  lee como «falta el dato» o como «falla la pantalla», y aquí significa «esta unidad no
  tiene».

- **La pantalla no entra al paquete inicial** (`UNMD-FE-AC15`): se descarga al entrar a
  su ruta. No estaba pedido; lo hice porque es el patrón de las demás y porque el
  recorrido lo puede comprobar.

## Huecos declarados que esta historia toca

- **El rechazo por permiso nombra el permiso que falta** (`UNMD-FE-AC11`). La
  especificación solo dice «no se muestra ningún dato del catálogo». Nombrarlo sale de
  **ADR-044**, y está verificado en la prueba. **La especificación se quedó corta
  respecto de lo que se construyó**, y conviene actualizarla.

- **La densidad de las filas** (`UNMD-FE-AC14`) se verifica en píxeles, en el recorrido.
  La especificación habla de densidad sin dar un número; el número que se usa es el del
  sistema de diseño.
````

:::

### Lo que cambia entre los dos ejemplos

| | Servidor | Pantalla |
|---|---|---|
| De dónde salen las decisiones | El documento de **reconciliación** | Los **comentarios del código** y el recorrido |
| Qué prueba lo que no se ve | No aplica | El **recorrido grabado**: estilos, altura, foco, qué se descarga |

En el servidor la mitad del cuerpo ya estaba escrita en la reconciliación. **En la pantalla no hay
ese documento**, así que las decisiones hay que recordarlas: por eso conviene escribir el cuerpo al
abrir la solicitud, no una semana después.

### Lo que hay que ver en el primer ejemplo

**No se escribió nada nuevo.** Todo estaba ya en `docs/reconciliacion/unidades-medida.md`, con sus
fechas y su razonamiento. El trabajo no fue pensar: fue **subir a la superficie lo que ya se había
decidido**, para que quien revisa no tenga que encontrarlo.

Por eso son diez minutos y no una hora. Si tienes un documento de reconciliación, la mitad del
cuerpo ya está escrita.

**Y mira lo que le entrega al revisor.** El punto de H7 dice que *quien tenga `CREATE` sin `VIEW`
puede averiguar nombres probando códigos*. Eso es exactamente lo que la
[pregunta 2 del revisor](/vortice/revisar) existe para sacar a la superficie: una decisión sin
firmar, con consecuencia de seguridad, que lleva días esperando. Con el cuerpo lleno se ve en
treinta segundos; con el cuerpo vacío, no se ve nunca.

## Qué pasa después de guardar

| | |
|---|---|
| **Verde** | Tu mitad está completa. La solicitud espera revisión |
| **Rojo con «Plantilla sin diligenciar»** | Queda algún `_(pendiente)_`. Dice cuántos |
| **Rojo con «El cuerpo no nombra ninguna historia»** | Falta el `VORT-` del paso 2 |

El rojo **no impide fusionar**: la organización está en plan Free y no se puede exigir desde la
configuración de GitHub. Lo que hace es dejar constancia. El proceso funciona porque el equipo lo
respeta, no porque una máquina lo bloquee.

## Lo que NO tienes que hacer

- **Listar los archivos que tocaste.** El diff los lista.
- **Explicar el código.** Si hace falta explicarlo aquí, hace falta un comentario allá.
- **Responder las cuatro preguntas del revisor.** Esas son de quien revisa, y van en la otra mitad.
- **Pedir revisor por chat.** Se asigna en `Reviewers` al abrir, y ya está.

## Y luego, cuando te toque a ti revisar

Ve a [Revisar una solicitud](/vortice/revisar). Si lo revisado es la pantalla, además a
[Revisar la pantalla](/vortice/revisar-pantalla).
