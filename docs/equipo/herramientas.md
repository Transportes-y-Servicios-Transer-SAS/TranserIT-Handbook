---
title: Las herramientas base, lo primero que se instala
---

# Las herramientas base

> **Esto se hace una vez por equipo, y es lo primero.** Todo lo demás —las llaves, el entorno del
> servidor, el de la pantalla— da por hecho que esta página ya está hecha.
>
> **Necesitas ser administrador local de tu equipo.** Si no lo eres, pídelo a Sistemas antes de
> empezar: sin eso, nada de aquí funciona.

## Qué se instala, y qué trae dentro

<Diagrama
  nombre="herramientas"
  titulo="Chocolatey instala git y gh; lo importante es lo que viene dentro de git" />

Son **dos paquetes**. Lo que importa de verdad está dentro de uno de ellos.

## 1 · Chocolatey

Chocolatey es un gestor de paquetes para Windows: instala programas desde la terminal, igual que
`apt` en Linux o `brew` en macOS.

**Lo usamos para que todos instalemos lo mismo con el mismo comando**, en lugar de que cada quien
busque su instalador y acabe con una versión distinta.

**Abre PowerShell como administrador** —clic derecho en el icono, *Ejecutar como administrador*— y
ejecuta:

```powershell
# La política se cambia solo para esta ventana; al cerrarla vuelve a como estaba
Set-ExecutionPolicy Bypass -Scope Process -Force

# Fuerza TLS 1.2, que es lo que exige el servidor de descarga
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072

# Descarga y ejecuta el instalador oficial
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Cierra PowerShell y ábrelo de nuevo**, otra vez como administrador. Comprueba:

```powershell
choco --version
```

Si responde con un número, está listo.

## 2 · Git y la línea de comandos de GitHub

En la misma ventana de administrador:

```powershell
choco install git gh -y
```

| | Qué es |
|---|---|
| **git** | El control de versiones. Trae además `ssh-keygen`, Git Bash y **su propio GnuPG** |
| **gh** | La línea de comandos de GitHub. Sirve para subir las llaves sin pegarlas a mano en el navegador |

> ⚠️ **No instalamos Gpg4win, y la razón importa.**
>
> Git para Windows ya incluye GnuPG, y los dos guardan las llaves **en carpetas distintas**: el de
> Git en `C:\Users\<tu usuario>\.gnupg`, el de Gpg4win en `%APPDATA%\gnupg`.
>
> Teniendo los dos, es fácil crear la llave con uno y pedirle a Git que firme con el otro — y
> entonces falla con *«secret key not available»* sin que nada explique la causa. **Con una sola
> herramienta ese problema no existe.**

**Comprueba que quedó:**

```powershell
git --version
gh --version
```

## Fijar la versión cuando haga falta

`choco install` sin más trae **la última**. Para que todos tengamos la misma:

```powershell
choco search NOMBRE --all-versions     # qué hay disponible
choco install NOMBRE --version=X.Y.Z -y
```

**Dónde importa esto:** en el kit de Java y en Bun, donde la versión la fija el repositorio. Cada
entorno lo dice en su página.

## Problemas frecuentes

| Síntoma | Causa y salida |
|---|---|
| `choco` no se reconoce | Falta cerrar y volver a abrir PowerShell después de instalar |
| `Access denied` al instalar | La ventana no es de administrador. Ciérrala y ábrela con *Ejecutar como administrador* |
| La descarga falla | El bloqueo de la red corporativa sobre el sitio del proveedor. Cada página de entorno trae una vía alterna |
| `gpg` no se reconoce | **Es lo esperado**: el GnuPG de Git no se añade a la ruta de búsqueda. Se invoca por su ruta completa, y la página de llaves explica cómo |

<div class="siguiente">

**Con esto el equipo tiene lo mínimo.** Dos paquetes, y dentro de uno de ellos todo lo que hace falta
para lo que viene.

**Lo siguiente son las llaves**: una para entrar a GitHub sin escribir contraseñas, y otra para que
tus *commits* lleven tu nombre de verdad.

</div>
