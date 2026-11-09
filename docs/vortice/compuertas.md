---
title: Las compuertas, y las costumbres que explican por qué existen
---

# Las compuertas

> Un comando por repositorio. Dentro, bastante más de lo que parece.

## Qué vigila cada una

<Diagrama
  nombre="compuertas"
  titulo="Las compuertas del servidor y de la pantalla, con lo que comprueba cada una" />

| | El comando |
|---|---|
| **Servidor** | `.\mvnw.cmd verify` — arquitectura, modularidad, idioma de los identificadores, catálogo de permisos, captura del contrato y trazabilidad |
| **Pantalla** | `bun x vitest run gates/` — adherencia al ejemplar, códigos de error contra el contrato, componentes obsoletos, contraste, estados de pantalla, trazabilidad, vocabulario y vulnerabilidades |

Los comandos completos del día a día —incluido el orden en que se ejecutan y la trampa de
`bun run lint`— están en [la rutina](/git/dia-a-dia).

## La de trazabilidad es la que más te va a tocar

**Cada criterio de la especificación necesita una prueba que lo cite en su nombre visible:**

```java
@DisplayName("[SEDE-BE-AC2] una sede sin ciudad se rechaza")
```

Y el criterio tiene que estar en el manifiesto, `acceptance-criteria.properties`, que es
**acumulativo**: cada derivación añade el bloque de su funcionalidad y **no retira los demás**.

> **Por qué se fusiona por unión de líneas.** Sin esa regla, cada fusión daba conflicto y se resolvía
> eligiendo un lado — **lo que borraba los criterios de la otra funcionalidad**. Y borrarlos no rompe
> nada visible: la compuerta solo comprueba las funcionalidades que el manifiesto nombra, así que la
> que desaparece **deja de comprobarse en silencio**.
>
> El detalle de esa fusión, y de la otra regla de `.gitattributes`, está en
> [conflictos](/git/conflictos).

### Tres capas, y solo una mira fuera del proyecto

| Capa | Qué compara | Dónde corre |
|---|---|---|
| **1** | La numeración de lo citado: si se cita `AC1` y `AC3`, falta el `AC2` | en todas partes |
| **2** | El manifiesto contra las pruebas | en todas partes |
| **3** | **La especificación vigente del repositorio** contra el manifiesto | **solo donde se deriva** |

Las dos primeras miran únicamente dentro del proyecto, y ahí está su límite: **comparan artefactos
que escribe la misma mano en la misma sesión**, así que son coherentes entre sí aunque falte un
tercio de la especificación. La capa 3 es la única que puede detectar que falta un criterio, porque
es la única que lee la fuente.

Corre donde se deriva, que es donde existe el clon de `vortice-specs` y donde está el riesgo. En
integración avisa y se salta: traérselo allí obligaría a dar acceso de lectura entre repositorios
para comprobar algo que ya se comprobó antes de confirmar.

### La capa 3 no confía en que hayas corrido el verificador: lo exige

Que el primer paso de la derivación sea correr el verificador es **una instrucción en un documento**,
no una garantía. Sin nada que lo respalde, bastaba con no poner al día `vortice-specs` para que la
capa 3 comparara contra una especificación vieja **y diera verde**: el mismo fallo de siempre, con un
clon en vez de una copia pegada.

Por eso la compuerta lo mide ella, y **sin tocar la red**, porque una compuerta que hace `fetch` es
lenta y falla sin conexión:

| Qué mide | A quién caza |
|---|---|
| El atraso que el clon ya conoce de su remoto | al que no corrió el verificador teniendo información fresca |
| Horas desde el último `fetch`, con 24 de límite | al que lleva días sin preguntar, y por eso su atraso marca cero por no saber nada |

Las dos se arreglan con el mismo comando, el verificador, y el mensaje lo dice.

### Un criterio puede estar declarado y no construido, pero hay que escribirlo

Una especificación puede declarar un criterio **antes** de que exista su código. Pasa al ampliar algo
ya entregado: se decide que la funcionalidad crezca, se escribe el criterio, y el código llega
después con su propia historia.

Para eso se marca con **`(pendiente)`**, justo después de la clave:

```text
- [ ] `DEPT-FE-AC20` (pendiente) **Dado** más departamentos de los que caben en una página,
      **cuando** se busca uno que no está en la primera, **entonces** se encuentra
```

La capa 3 lo entiende: **lo cuenta y lo dice en su salida, pero no lo exige**.

::: warning La marca no lo esconde, lo declara
Sin ella, un criterio declarado y no construido saldría como «falta en el manifiesto»
**para siempre**, y una compuerta en rojo permanente se desactiva en una semana. Con ella, sigue
apareciendo en cada corrida, contado.

**La diferencia entre deuda y olvido es que alguien escribió la palabra.**
:::

## El defecto que más se repite, y tiene una forma reconocible

> **Algo que parece conectado y no está conectado a nada.**

Te lo vas a encontrar, así que conviene reconocerlo. **Cuatro casos reales**, todos de semanas
seguidas:

| | |
|---|---|
| Una compuerta de trazabilidad corría **seis pruebas en verde** comparando contra un manifiesto **que no existía** | Comparar contra una lista vacía siempre sale bien |
| Una pantalla se derivó contra **31 criterios cuando la vigente tenía 39**, y la compuerta dio verde | El manifiesto y las pruebas coincidían **entre sí**: los escribe la misma mano en la misma sesión |
| Un `.pptx` pasaba la comprobación de integridad y el programa lo declaraba dañado | Las cabeceras decían una cosa y el directorio central otra; cada herramienta leía la suya |
| Una especificación afirmaba *«comprobado mirando: el módulo existe»* | Sobre un módulo que no existía en ninguna rama |
| Un guion proponía **crear** 33 historias que ya existían con otro nombre | Con `-Aplicar` las habría duplicado |

## Las tres costumbres que salen de ahí

No son consejos. Son lo que separa una compuerta que sirve de una que decora.

### 1 · Medir, no estimar

*«Unas decenas»* se convirtió en 33. *«Más de mil»*, en 1122. **Las dos veces el número real cambiaba
la decisión**, y las dos veces costaba un comando averiguarlo.

### 2 · Una compuerta no está lista hasta que se demuestra que muerde

**Se rompe algo a propósito y se comprueba que lo ve.** Una compuerta que nunca ha fallado no es una
compuerta probada: es una compuerta sin probar que da tranquilidad, que es peor que no tenerla.

### 3 · Lo que falta se marca, no se rellena

Un `⚠️ SIN COMPROBAR` es **una deuda con dueño**. Una suposición plausible es **una trampa**, porque
se lee igual que un hecho y nadie vuelve a mirarla.

## Lo que está abierto hoy

Para que no lo descubras tropezando. **Esto caduca**: es el estado a octubre de 2026.

| | |
|---|---|
| **La autenticación no existe** | La pantalla lleva una marca de pendiente y una banda fija. No hay especificación de ingreso, de ninguno de los dos lados |
| **Veintidós criterios de la pantalla no vienen de ninguna especificación** | Son del trabajo de fundación, anteriores al método |
| **Un criterio de accesibilidad se fusionó sin prueba** | Cero violaciones AA, afirmado y no comprobado |
| **La reconciliación con el esquema del núcleo** | Pendiente en varios puntos, cada uno declarado dentro de su especificación |

<div class="siguiente">

**Con esto tienes el proyecto entero**: qué se construye, qué manda sobre qué, cómo una pregunta
acaba siendo código, y qué lo comprueba.

**Lo que no está aquí está en las *skills***, que son la norma: esta sección dice *cuándo* y *por
qué*, y ellas dicen *cómo*.

</div>
