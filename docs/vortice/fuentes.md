---
title: De dónde se lee
---

# De dónde se lee

> La especificación, el requerimiento y los guiones de base de datos **se leen del repositorio que
> los versiona**. No se copian a ningún sitio, y en los proyectos ya no hay dónde copiarlos.

## La regla, en una frase

**Nada de lo que gobierna una derivación vive en el repositorio donde se construye.**

| Qué | Dónde vive | Se copia al proyecto |
|---|---|---|
| El requerimiento | `vortice-specs/requerimientos/<módulo>/` | **No** |
| La especificación del servidor | `vortice-specs/backend/` | **No** |
| La especificación de la pantalla | `vortice-specs/frontend/` | **No** |
| Los guiones de base de datos | `vortice-sql/dominios/` | **No** |
| El contrato de la API | el clon del servidor | **No** |

## Se configura una vez

Copia `.vortice.local.json.example` a `.vortice.local.json` y pon las rutas de tus clones. Git lo
ignora: **es de tu equipo, no del repositorio**.

::: code-group

```json [vortice-backend]
{
  "specs": "C:/ruta/a/vortice-specs",
  "sql": "C:/ruta/a/vortice-sql"
}
```

```json [vortice-frontend]
{
  "backend": "C:/ruta/a/vortice-backend",
  "specs": "C:/ruta/a/vortice-specs",
  "sql": "C:/ruta/a/vortice-sql"
}
```

:::

También valen las variables de entorno `VORTICE_SPECS`, `VORTICE_SQL` y `VORTICE_BACKEND`, que es lo
que usa una tubería. **Ninguna de las dos vías tiene valor por omisión, y es deliberado:** adivinar
la ruta produce una derivación que funciona en un equipo y falla en el de al lado, con un mensaje que
no dice por qué.

## El primer paso de toda derivación

Antes de abrir ninguna especificación, se corre el verificador **con el nombre de la funcionalidad**:

::: code-group

```powershell [vortice-backend]
.\verificar-fuentes.ps1 sedes
```

```bash [vortice-frontend]
bun run scripts/verificar-fuentes.ts sedes
```

:::

```text
  vortice-specs
    ruta    C:/Users/.../vortice-specs
    commit  f4e32ec1a1e3  (ya estaba al día)
  vortice-sql
    ruta    C:/Users/.../vortice-sql
    commit  962f4ce6e477  (ya estaba al día)

  «sedes» se deriva de:
    especificación  ...\vortice-specs\backend\sedes-be.md
    requerimiento   ...\vortice-specs\requerimientos\core\sedes.md
```

**Basta el nombre, no la ruta.** La ruta ya está configurada, así que volver a teclearla es escribir
dos veces lo mismo. Valen `sedes`, `sedes-be` y `sedes-be.md`. El módulo del requerimiento tampoco se
pregunta: se busca, así que da igual si está en `core` o en `flota`.

Y la sesión arranca con una sola frase:

```text
Implementa la especificación de sedes
```

### Qué comprueba, y qué hace cuando algo falla

| Situación | Qué pasa |
|---|---|
| No hay ruta configurada | Se detiene y escribe las dos formas de configurarla |
| La ruta no es un clon de git | Se detiene: la procedencia de una especificación es un commit, no una carpeta |
| El clon está en otra rama | Se detiene: lo vigente se publica en `master`, y una rama de trabajo no es lo vigente |
| El clon tiene cambios sin confirmar | **Se detiene y los nombra, sin tocar nada.** Un `pull` encima de trabajo a medias es peor que el atraso |
| El clon está detrás de su remoto | **Lo pone al día** con `git pull --ff-only` y dice cuántos commits traía |
| La funcionalidad no existe | Lista las que sí hay. Sugiere solo por coincidencia parcial, nunca por parecido |

Al terminar deja en `reports/fuentes.json` el commit del que se leyó cada fuente, **y ese commit va
al mensaje del commit de la derivación**: la procedencia es un commit, no una huella.

## Por qué, y cuánto costó

::: danger El 2026-10-27, la pantalla de terceros
Se derivó entera contra una especificación de **31 criterios cuando la vigente tenía 39**.

Nadie hizo nada mal. El procedimiento de entonces decía que la especificación se descargaba del
tablero a `docs/spec/`, y el `README` de esa carpeta lo dejaba escrito: «El contenido NO se versiona:
viene del tablero». El adjunto de la historia era del 20 de octubre, de una semana antes, y nadie lo
reemplazó cuando la especificación se corrigió esa misma mañana. La coincidencia es byte a byte:
**21.609 bytes el adjunto, 21.609 bytes la copia usada**.

**El daño:** ocho criterios sin prueba, y uno de ellos implementado **al revés** de lo que la
especificación pide. La derivación se descartó completa y hubo que repetirla.

**Y la compuerta de trazabilidad dio verde**, porque comparaba el manifiesto contra las pruebas y
**los dos los escribe el mismo agente en la misma sesión**: son coherentes entre sí aunque falte un
tercio de la especificación. Verde perfecto con 31 de 39.
:::

Por eso las carpetas `docs/spec/` y `docs/sql/` se retiraron de los dos proyectos. Mantener viva una
carpeta donde copiar la especificación es lo que permitió derivar contra una versión de hace una
semana sin que nada avisara.

## La compuerta tiene tres capas, y solo una mira fuera

| Capa | Qué compara | Dónde corre |
|---|---|---|
| **1** | La numeración de los criterios que citan las pruebas: si se cita `AC1` y `AC3`, falta el `AC2` | en todas partes |
| **2** | El manifiesto contra las pruebas | en todas partes |
| **3** | **La especificación vigente del repositorio** contra el manifiesto | **solo donde se deriva** |

Las dos primeras miran únicamente dentro del proyecto, y ahí está su límite: comparan artefactos que
escribe la misma mano en la misma sesión. **La capa 3 es la única que puede detectar que falta un
criterio**, porque es la única que lee la fuente.

Corre donde se deriva, que es donde existe el clon y donde está el riesgo. En integración avisa y se
salta: traérselo allí obligaría a dar acceso de lectura entre repositorios para comprobar algo que ya
se comprobó antes de confirmar.

::: tip Lo que encontró el primer día
En su primera corrida contra datos reales, la capa 3 detectó que la especificación de departamentos
declaraba **veinte** criterios y el manifiesto diecinueve. Al tirar del hilo apareció algo peor: un
criterio se había **intercalado** cinco semanas antes, y eso corrió un puesto los nueve siguientes.
Desde entonces cada prueba citaba el número del criterio anterior, y nadie lo había notado.
:::

## Un criterio nuevo va al final

Cuando una especificación **ya derivada** gana un criterio, va al final de la lista con el número
siguiente, **nunca intercalado** en su sitio temático.

Intercalar renumera todo lo que viene detrás, y lo que viene detrás ya está citado en el código. Al
corregir el caso de departamentos se midieron las dos vías:

| Vía | Costo |
|---|---|
| Renumerar el código para que siga a la especificación | 34 citas en 10 archivos, y rehacer pruebas |
| **Mover el criterio al final de la especificación** | **cero líneas de código** |

El documento se renumera gratis. El código no.
