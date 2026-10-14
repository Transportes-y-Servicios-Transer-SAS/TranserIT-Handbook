---
title: De la pregunta al código
---

# De la pregunta al código

> Cómo una pregunta al negocio acaba siendo código con sus pruebas, sin que nadie invente nada por
> el camino.

## El recorrido completo

<Diagrama
  nombre="flujo-spec"
  titulo="Siete preguntas al negocio, una especificación que gobierna, las historias, la derivación y las compuertas" />

## 1 · Las siete preguntas

Es **lo único** que se le pide a quien conoce el negocio. Se responden en un correo o en un
comentario de la tarea: **no es un formato**.

| | |
|---|---|
| **1** | ¿Qué debe poder hacerse? |
| **2** | ¿Quién lo hace, en qué momento y con qué delante? |
| **3** | ¿Qué datos entran, y cuáles no pueden faltar? |
| **4** | ¿Qué se permite, qué no, y **qué pasa cuando alguien intenta lo que no se permite**? |
| **5** | ¿Quién puede hacerlo y quién no? |
| **6** | ¿De dónde salió cada regla? |
| **7** | ¿Qué **no** entra en esto? |

> **La cuarta es la que más rinde y la que más se deja a medias.** Sin su tercera parte sale un
> error técnico donde debía ir una explicación — y esa diferencia la paga quien está usando el
> sistema, no quien lo escribió.

## 2 · La especificación

La arma la *skill* `transer-spec-draft` a partir de esas respuestas. **Si falta una, pregunta: no
rellena.**

> ⚠️ **Una especificación con reglas inventadas es peor que no tenerla, porque se ve igual de bien.**
> Once códigos ante la autoridad tributaria estuvieron inventados durante meses. Los corrigió una
> reunión de una hora — que podía haberse tenido al principio.

### Dos especificaciones si hay pantalla. Siempre

En dos archivos, con dos claves de criterio y dos historias:

```text
backend/<funcionalidad>-be.md     clave CLAVE-BE
frontend/<funcionalidad>-fe.md    clave CLAVE-FE
```

**No tienen la misma fuente:** la de servidor sale del esquema; la de pantalla, del contrato que la
primera publica.

Y **la de pantalla no reenuncia reglas de negocio**: escribe su consecuencia visible. No *«la
dirección va completa o no va»*, sino *«el error va junto al campo»*. **Una regla copiada no tiene
quien la sincronice.**

## 3 · Al tablero

```powershell
.\publicar-en-plane.ps1 -Funcionalidad NOMBRE -Tema 'ETIQUETA'
```

**Simula por defecto: sin `-Aplicar` no escribe nada.** Las historias nacen en *Backlog* y sin ciclo
—el ciclo se asigna en la planificación— y **la de pantalla queda bloqueada por la de servidor**.

## 4 · La derivación

Ahí entran `transer-spec` y `transer-ui-spec`, que orquestan a las demás.

| Quieres… | Usa |
|---|---|
| Convertir lo que escribió el negocio en especificación, y subirla | `transer-spec-draft` |
| Construir el servidor desde una especificación | `transer-spec` |
| Construir la pantalla desde una especificación y el contrato | `transer-ui-spec` |
| Tocar el esquema o escribir una migración | `transer-schema` |
| Escribir un módulo o un caso de uso | `transer-module` · `transer-ui-module` |
| Escribir pruebas | `transer-test` · `transer-ui-test` |
| Revisar lo construido | `transer-audit` · `transer-ui-audit` |

**Dos reglas que valen para todas:**

**No se inventan símbolos de un marco.** Si no puedes señalar dónde está definida una clase, no la
escribas.

**El negocio viene de la especificación, nunca del módulo de referencia.** Los módulos del ejemplar
se llaman `document`, `catalog`, `log`: son **formas**, no dominio.

## La forma de una especificación, que es exigible

**Servidor, once secciones en este orden:**

```text
Módulo · Qué hace · Quién lo usa · Reglas · Qué ve el exterior · Quién puede hacerlo ·
Qué ve el usuario · Criterios de aceptación ·
Lo que esta especificación NO decide, y quién sí · Opcionales · Fichas de origen
```

**Pantalla, nueve:** las mismas menos *Reglas*, *Qué ve el exterior* y *Quién puede hacerlo* —que
son del servidor— más *De dónde sale esta especificación*, que es suya.

> **El orden es parte del contrato, no estilo.** Quien deriva lee de arriba abajo y busca cada
> sección por su nombre exacto. Una que está en otro sitio **se descubre al no encontrarla, a mitad
> de la derivación** — y entonces se inventa.

Lo comprueba `verificar-forma.ps1`: secciones y orden, elementos internos, la clave declarada contra
la que usan los criterios, numeración sin huecos ni repetidos, los cinco opcionales, el sufijo del
archivo y el enlace entre las dos mitades.

> **Antes de que ese verificador existiera, las catorce especificaciones coincidían por disciplina
> de quien las escribió.** Que es otra forma de decir que una sola distracción las separaba.

<div class="siguiente">

**Con esto puedes seguir el recorrido entero**, desde la pregunta hasta la derivación.

**Lo que falta son las compuertas**: qué comprueba cada una, cuál te va a tocar más, y las tres
costumbres que explican por qué existen.

</div>
