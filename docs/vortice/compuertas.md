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

## El defecto que más se repite, y tiene una forma reconocible

> **Algo que parece conectado y no está conectado a nada.**

Te lo vas a encontrar, así que conviene reconocerlo. **Cuatro casos reales**, todos de semanas
seguidas:

| | |
|---|---|
| Una compuerta de trazabilidad corría **seis pruebas en verde** comparando contra un manifiesto **que no existía** | Comparar contra una lista vacía siempre sale bien |
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
