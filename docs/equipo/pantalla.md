---
title: El entorno de la pantalla
---

# El entorno de la pantalla

> **Antes de empezar, dos condiciones.**
>
> **[Las herramientas base](/equipo/herramientas) instaladas** — Chocolatey, `git` y `gh`.
> **Permisos de administrador local**, para instalar. Si no los tienes, el paso 1 trae una vía que
> no los necesita.

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

## 5 · Levantar el servidor de desarrollo

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

## 6 · Los otros guiones

Los define el manifiesto; estos son los de cada día:

```powershell
bun run build        # construcción de producción
bun run test         # pruebas de componente y de pantalla
bun run type-check   # verificación de tipos, plantillas incluidas
```

> ⚠️ **`type-check` va aparte y hay que correrlo.** El compilador de tipos por sí solo **no revisa
> las plantillas**, que es donde más errores de tipo se cometen. Por eso existe ese guion separado y
> por eso la compuerta lo ejecuta.
>
> Y ojo con `bun run lint`: sus dos guiones llevan `--fix`, así que **arreglan en vez de verificar**.
> Para comprobar sin tocar nada están las variantes `verify:*`, en [el día a día](/git/dia-a-dia).

## Comprobar que todo quedó bien

Cuatro comandos, en orden. Si los cuatro pasan, el entorno está listo:

```powershell
bun --version        # responde con un número
bun install          # termina sin errores
bun run dev          # la aplicación abre en el navegador
bun run test         # las pruebas pasan
```

## Problemas frecuentes

| Síntoma | Causa y salida |
|---|---|
| `choco install bun` falla al descargar | El bloqueo de la red corporativa sobre el sitio del proveedor. Usa la vía alterna del paso 1 |
| `bun` no se reconoce tras instalar | Falta cerrar y abrir PowerShell. La ruta solo se actualiza en sesiones nuevas |
| `bun install` falla bajando paquetes | El registro sí responde desde la red interna; si falla, es otra cosa. Comprueba con `bun pm ls` y pasa el error |
| El editor no autocompleta en las plantillas | Falta la extensión oficial, o hay otra de Vue antigua en conflicto. Deja solo la oficial |
| `bun run dev` levanta pero no carga datos | El servidor no está corriendo, o apuntas al puerto equivocado. Revisa el paso 5 |
| Errores de tipo que el editor no marcaba | Corre `bun run type-check`. Las plantillas no se revisan con la verificación normal |

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

**Si las cuatro comprobaciones pasaron, puedes empezar.** Lo que sigue no es de instalación: es
[el día a día](/git/dia-a-dia), donde está el orden de la entrega y la compuerta que pasa este
repositorio.

</div>
