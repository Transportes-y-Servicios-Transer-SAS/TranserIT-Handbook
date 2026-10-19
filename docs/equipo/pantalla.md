---
title: El entorno de la pantalla
---

# El entorno de la pantalla

> **Antes de empezar, tres condiciones.**
>
> **[Las herramientas base](/equipo/herramientas) instaladas** — Chocolatey, `git` y `gh`.
> **Permisos de administrador local**, para instalar. Si no los tienes, el paso 1 trae una vía que
> no los necesita.
> **El repositorio del servidor clonado en tu equipo**, aunque no vayas a tocarlo: de ahí salen el
> contrato y los permisos, que no vienen en el clon y sin los cuales esto no compila. Es el paso 5,
> y es el que más sorprende.

## Qué se instala, y qué no

<Diagrama
  nombre="entorno-pantalla"
  titulo="Arriba lo que instalas; abajo lo que trae el repositorio y contra qué acaba apuntando" />

| Se instala | Para qué |
|---|---|
| **Bun** | Gestor de dependencias y ejecutor de guiones |
| **Editor con la extensión del marco** | Autocompletado y verificación de tipos en las plantillas |

**No se instala Node.js.** Bun lo reemplaza para lo que necesitamos: instalar dependencias y correr
los guiones del proyecto.

**No se instala el empaquetador, ni el marco, ni la biblioteca de componentes.** Todo eso son
dependencias del proyecto: llegan con `bun install` y **sus versiones las manda el manifiesto**, no
tu equipo.

## 1 · Bun

**PowerShell como administrador:**

```powershell
choco install bun -y
```

**Cierra PowerShell y ábrelo de nuevo** antes de comprobar. Fija la versión que usa el proyecto:

```powershell
choco search bun --all-versions
choco install bun --version=1.3.14 -y
```

### Si falla la descarga

**El sitio de descarga de la herramienta está bloqueado en la red corporativa**, y está comprobado.
El registro de paquetes sí responde —las dependencias del proyecto se bajan sin problema—, pero el
instalador no se obtiene desde la red interna.

La vía que funciona hoy, **y que además no necesita permisos de administrador**:

```powershell
# 1. Descarga bun-windows-x64.zip de la página de publicaciones del proyecto en GitHub

# 2. Descomprime en tu perfil de usuario
$destino = "$env:USERPROFILE\.bun\bin"
New-Item -ItemType Directory -Force -Path $destino | Out-Null
Expand-Archive -Path "$env:USERPROFILE\Downloads\bun-windows-x64.zip" -DestinationPath $destino -Force

# 3. Añade esa carpeta a tu ruta de búsqueda, solo para tu usuario
$ruta = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($ruta -notlike "*$destino*") {
  [Environment]::SetEnvironmentVariable('Path', "$ruta;$destino", 'User')
}
```

**Cierra PowerShell y ábrelo de nuevo**: la ruta solo se actualiza en sesiones nuevas.

```powershell
bun --version
```

> ⚠️ **La versión que manda es la del repositorio**, declarada en el `CLAUDE.md` de su raíz — el
> mismo mecanismo que usa el servidor. Mientras ese archivo no exista, manda el número de arriba;
> cuando exista y declare otro, **se ajusta el equipo, no el archivo**.

## 2 · El editor

**Solo si no tienes uno.** PowerShell como administrador:

```powershell
choco install vscode -y
```

Y desde el propio editor, la extensión oficial del marco — busca **Vue (Official)** en el panel de
extensiones.

> ⚠️ **La extensión no es opcional.** Sin ella el editor no entiende las plantillas: no autocompleta,
> no navega a las definiciones y **no marca los errores de tipo donde más se cometen**.

## 3 · Traer el proyecto

```powershell
cd $env:USERPROFILE\código
git clone git@github.com:LA_ORGANIZACION/NOMBRE_DEL_REPOSITORIO.git
cd NOMBRE_DEL_REPOSITORIO
```

Se clona por SSH, que es lo que configuraste en [las llaves](/equipo/llaves). Si pide contraseña, la
llave no está cargada.

## 4 · Instalar las dependencias

```powershell
bun install
```

Lee el manifiesto y el archivo de candado, y baja **exactamente** las versiones que ahí figuran. La
primera vez tarda; las siguientes son casi instantáneas.

> ⚠️ **El archivo de candado se versiona y no se toca a mano.** Es lo que garantiza que todos y la
> integración instalemos lo mismo. Si aparece modificado en un cambio que no tocaba dependencias,
> algo se instaló mal: revísalo antes de entregarlo.

## 5 · Generar lo que el repositorio no trae

**Este paso no se puede saltar, y es el que más tiempo hace perder cuando falta.**

Hay tres archivos que el clon **no trae** porque se generan, y están ignorados por git a propósito.
Dos de ellos salen del **clon del servidor**:

```powershell
bun run scripts/generate-api-types.ts    C:\ruta\a\vortice-backend
bun run scripts/generate-permissions.ts  C:\ruta\a\vortice-backend
```

> ⚠️ **Son dos guiones y ninguno llama al otro.** Correr solo el primero deja los permisos viejos, y
> el síntoma es el mismo montón de errores. Van siempre juntos.

| Guion | Qué produce | De dónde lo saca |
|---|---|---|
| `generate-api-types` | Los tipos de cada operación y cada respuesta | Del contrato que publica el servidor |
| `generate-permissions` | La lista cerrada de permisos que existen | De las anotaciones del código del servidor |
| `generate:design` | Los colores y medidas de la marca | Del propio repositorio — **éste no necesita el servidor** |

El tercero se corre solo: `bun run dev` y `bun run build` lo ejecutan antes que nada. Solo hace
falta invocarlo a mano —`bun run generate:design`— si vas a correr las compuertas sin haber
levantado la aplicación antes.

### Decir dónde está el clon del servidor, una sola vez

Pasar la ruta en cada comando se olvida. Hay tres vías y **la tercera es la que conviene**: un
archivo en la raíz, que ya está ignorado por git.

```powershell
Copy-Item .vortice.local.json.example .vortice.local.json
# y edítalo con la ruta real de tu clon
```

Desde ahí, los dos guiones se invocan sin argumento. Las otras dos vías son el argumento de arriba
y la variable de entorno `VORTICE_BACKEND`, por si te sirve más en un servidor de integración.

> ⚠️ **Necesitas el repositorio del servidor clonado, aunque no vayas a tocarlo**, y
> **actualizado antes de generar**: lo que sale es la versión que tengas en disco, no la última que
> exista. Un clon viejo produce un contrato viejo, y el error que verás dirá lo contrario de lo que
> pasa — que algo *no existe*, cuando existe y tú no lo tienes.

**Por qué no se versionan, y no es un descuido:** versionar la copia la convertiría en la fuente y
empezaría la deriva — la pantalla acabaría creyendo un contrato que el servidor ya no publica. Que
haya que generarlos es lo que garantiza que nadie trabaje contra un contrato imaginario.

> ⚠️ **Y si no lo haces, lo que ves no te dice que falte este paso.** Salen **decenas de errores de
> tipo que dicen todos lo mismo** con nombres distintos:
>
> ```text
> Property 'DocumentTypeResponse' does not exist on type '{ … }'
> Property 'listDocumentTypes' does not exist on type 'operations'
> 'CORE:CITY_VIEW' is not assignable to type 'Permission'
> ```
>
> **Si ves eso, no busques el fallo en tu código: regenera los dos.** Y lo mismo cuando el servidor
> publica una funcionalidad nueva — lo generado ayer no la conoce.

> **Un aviso que sale y no es un fallo.** El generador de tipos avisa de los módulos que el contrato
> publica y este repositorio todavía no tiene. Es información, no error: **si uno de ésos es el que
> vas a derivar**, crea su carpeta —`mkdir src/modules/<módulo>`— y vuelve a generar.

## 6 · Levantar el servidor de desarrollo

```powershell
bun run dev
```

Abre la dirección que imprima en la consola. Los cambios en el código se reflejan sin recargar. Para
detenerlo, **Ctrl+C** en la misma ventana.

### Contra qué apunta

La aplicación necesita un servidor. Hay dos modos, y conviene saber cambiar entre ellos:

| Modo | Cuándo | Cómo |
|---|---|---|
| **Contra el servidor local** | Lo normal, cuando está levantado | La configuración por defecto apunta a su puerto |
| **Contra datos simulados** | Cuando no está listo, o para trabajar sin él | Se activa con la variable de entorno que declare el proyecto |

**El segundo modo es el que permite que la pantalla no espere al servidor.** Es un acuerdo del
equipo, no un truco: los datos simulados se pactan cuando se publica el contrato de la interfaz, y
se mantienen alineados con él.

## 7 · Los otros guiones

Los define el manifiesto; estos son los de cada día:

```powershell
bun run type-check      # verificación de tipos, plantillas incluidas
bun run test:unit:run   # las pruebas, una vez y sale
bun run test:unit       # las pruebas, quedándose a la escucha
bun run build           # construcción de producción
```

> **No existe `bun run test`.** Los guiones de pruebas llevan su apellido: `test:unit` se queda
> observando los archivos y `test:unit:run` corre una vez y termina — que es el que quieres en una
> comprobación y el que usa la integración. Para las de navegador, `test:e2e`.

> ⚠️ **`type-check` va aparte y hay que correrlo.** El compilador de tipos por sí solo **no revisa
> las plantillas**, que es donde más errores de tipo se cometen. Por eso existe ese guion separado y
> por eso la compuerta lo ejecuta.

> ⚠️ **Y ojo con `bun run lint`: NO verifica, arregla.** Sus dos guiones llevan `--fix`, así que
> tocan el árbol y terminan en verde. Para comprobar sin cambiar nada están `verify:eslint` y
> `verify:oxlint`, que están en [el día a día](/git/dia-a-dia) con el resto de la compuerta.

## Comprobar que todo quedó bien

Seis comandos, en orden. Si los seis pasan, el entorno está listo:

```powershell
bun --version                              # responde con un número
bun install                                # termina sin errores
bun run scripts/generate-api-types.ts      # el contrato
bun run scripts/generate-permissions.ts    # los permisos
bun run type-check                         # sin errores de tipo
bun run test:unit:run                      # las pruebas pasan
```

*Los dos generadores van sin argumento si ya dejaste tu `.vortice.local.json`; si no, la ruta del
clon del servidor va detrás de cada uno.*

Y una séptima que no es un comando: **`bun run dev` y que la aplicación abra en el navegador.**

> **El orden importa.** Si `type-check` falla con decenas de errores sobre propiedades que no
> existen, son el tercero y el cuarto: lo generado está viejo, o no se generó.

## Problemas frecuentes

| Síntoma | Causa y salida |
|---|---|
| `choco install bun` falla al descargar | El bloqueo de la red corporativa sobre el sitio del proveedor. Usa la vía alterna del paso 1 |
| `bun` no se reconoce tras instalar | Falta cerrar y abrir PowerShell. La ruta solo se actualiza en sesiones nuevas |
| `bun install` falla bajando paquetes | El registro sí responde desde la red interna; si falla, es otra cosa. Comprueba con `bun pm ls` y pasa el error |
| El editor no autocompleta en las plantillas | Falta la extensión oficial, o hay otra de Vue antigua en conflicto. Deja solo la oficial |
| **Decenas de errores de tipo que dicen todos lo mismo** | **Falta lo generado, o está viejo. Vuelve al paso 5 y corre los dos guiones** |
| `Cannot find module … contract.generated` | Lo mismo: esos archivos no se versionan, los genera el paso 5 |
| Solo fallan los permisos — `'CORE:…' is not assignable to type 'Permission'` | Corriste el generador de tipos pero no el de permisos. **Son dos** |
| `No sé dónde está el clon de vortice-backend` | Falta decir dónde está: `.vortice.local.json`, o la ruta como argumento. Paso 5 |
| `bun run test` no se reconoce | Ese guion no existe. Es `test:unit:run`, o `test:unit` si quieres que se quede observando |
| `bun run dev` levanta pero no carga datos | El servidor no está corriendo, o apuntas al puerto equivocado. Revisa el paso 6 |
| Errores de tipo que el editor no marcaba | Corre `bun run type-check`. Las plantillas no se revisan con la verificación normal |
| `bun run lint` termina en verde y el árbol quedó modificado | No es un fallo: `lint` arregla. Para verificar sin tocar, `verify:eslint` y `verify:oxlint` |

## Reglas que aplican a todos

**La versión de las herramientas la manda el repositorio**, no tu equipo. El `CLAUDE.md` de la raíz
es la referencia.

**El archivo de candado se versiona y no se edita.** Es lo que hace que todos instalemos lo mismo.

**Ningún secreto en el repositorio.** Si algo tiene que ser secreto, no se escribe en un archivo
versionado.

## Sobre la biblioteca de componentes

La elegida es **PrimeVue**, y llega como dependencia del proyecto: no se instala aparte.

Hay tres cosas que el stack pide validar **al elegirla, no después**, y conviene comprobarlas
mientras montas las primeras pantallas:

| Qué validar | Por qué importa |
|---|---|
| **La tabla de datos** | Es el componente más crítico: casi todas las pantallas del módulo son listados con filtro, orden y paginación |
| **Las dos densidades de interfaz** | La misma aplicación se usa en escritorio de oficina y en tableta de taller o portería |
| **La accesibilidad** | Navegación por teclado y lectores de pantalla. Es más barato comprobarlo ahora que rehacer pantallas después |

Si alguna de las tres no cubre lo que hace falta, **es mejor saberlo en la semana uno que en la
tercera**, cuando ya haya diez pantallas construidas encima.

<div class="siguiente">

**Si las cinco comprobaciones pasaron, puedes empezar.** Lo que sigue no es de instalación: es
[el día a día](/git/dia-a-dia), donde está el orden de la entrega y la compuerta que pasa este
repositorio.

</div>
