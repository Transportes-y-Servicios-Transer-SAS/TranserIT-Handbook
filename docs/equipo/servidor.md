---
title: El entorno del servidor
---

# El entorno del servidor

> **Antes de empezar, tres condiciones.**
>
> **[Las herramientas base](/equipo/herramientas) instaladas** — Chocolatey, `git` y `gh`.
> **Permisos de administrador local**, para instalar.
> **Virtualización habilitada en el equipo.** El motor de contenedores la necesita, y en algunos
> equipos viene desactivada desde la BIOS. Si el paso 3 falla, es casi siempre eso, y se resuelve
> con Sistemas, no aquí.

## Qué se instala, y qué no

<Diagrama
  nombre="entorno-servidor"
  titulo="Arriba lo que instalas; abajo lo que trae el repositorio y lo que acaba corriendo en contenedores" />

| Se instala | Para qué |
|---|---|
| **Kit de desarrollo de Java** | Compilar y ejecutar |
| **Podman** | La base de datos local y las pruebas de integración |
| **Cliente de base de datos** | Mirar los datos sin adivinar |
| **Editor** | Opcional, pero nadie trabaja sin uno |

**No se instala ni Maven ni Gradle.** El repositorio trae el envoltorio —`mvnw` y `mvnw.cmd` en la
raíz—, que descarga la versión correcta la primera vez que se usa. Eso no es comodidad: **es lo que
garantiza que todos construyamos con la misma versión**, y que la integración use exactamente esa.

**Tampoco se instala Docker Desktop**, y la razón es de licenciamiento, no de preferencia técnica.
Está en el paso 2.

## 1 · El kit de desarrollo de Java

**PowerShell como administrador:**

```powershell
choco install openjdk -y
```

> ⚠️ **Ese comando instala la más reciente, no una fija**, así que quien monte su equipo otro día
> tendrá algo distinto al resto sin darse cuenta. Fija la que declara el repositorio:
>
> ```powershell
> choco search openjdk --all-versions
> choco install openjdk --version=26.0.2.1 -y
> ```
>
> **La referencia es la sección «Gobierno de versiones» del `CLAUDE.md` del repositorio**, no lo
> último que exista. El número de aquí es el vigente al escribir esto: **si el `CLAUDE.md` dice
> otro, gana el repositorio.**

**Cierra PowerShell y ábrelo de nuevo**, ya sin administrador:

```powershell
java -version
```

> **Tu kit es 26, pero el proyecto compila contra Java 25, y no es un descuido.** La 25 es la de
> soporte prolongado y es la que corre en los ambientes, así que el POM declara ese objetivo. Eso
> hace que el compilador **rechace cualquier API posterior a la 25**, de modo que no puedes escribir
> código que funcione en tu equipo y falle en el ambiente.
>
> Lo que no cubre son las herramientas del montaje: verás avisos que en el ambiente no salen. Es
> ruido conocido del kit 26, no un problema de tu código.

### `JAVA_HOME`, que viene mal

**Es el fallo más frecuente de este montaje**, y engaña porque `java -version` sí responde: el
ejecutable está en la ruta de búsqueda y solo falla el envoltorio, con un error que ni menciona la
variable.

Chocolatey la registra **sin el número de parche**, apuntando a una carpeta que no existe.
Compruébalo:

```powershell
$env:JAVA_HOME
Test-Path $env:JAVA_HOME
```

Si responde `False`, corrígela **como administrador**, sin escribir la versión a mano:

```powershell
# Toma la carpeta que de verdad existe, la más reciente si hubiera varias
$real = (Get-ChildItem 'C:\Program Files\OpenJDK' -Directory |
         Sort-Object Name -Descending | Select-Object -First 1).FullName

[Environment]::SetEnvironmentVariable('JAVA_HOME', $real, 'Machine')
$real
```

**Cierra PowerShell y ábrelo de nuevo**, y comprueba que `Test-Path $env:JAVA_HOME` responde `True`.

> ⚠️ **Esto se repite con cada actualización del kit.** La carpeta cambia de nombre al subir de
> versión y la variable vuelve a quedar desalineada. Está en el calendario del final.

## 2 · Podman y el resto

**PowerShell como administrador:**

```powershell
choco install podman-desktop dbeaver -y
```

> ⚠️ **Por qué Podman y no Docker Desktop, que es lo más común.**
>
> Docker Desktop **exige suscripción de pago en organizaciones de más de 250 empleados o más de diez
> millones de dólares de ingresos anuales**. Transer supera el primer umbral con holgura, así que
> instalarlo en los equipos del proyecto sería un incumplimiento de licencia, no un ahorro.
>
> Podman es libre, sin ese umbral, y compatible a nivel de comandos. Lo que **sí** cambia es la
> configuración de las pruebas de integración, y es el paso siguiente.

Y el editor, **solo si no tienes uno**:

```powershell
choco install intellijidea-community -y
# o bien
choco install vscode -y
```

## 3 · Dejar Podman listo para las pruebas

### La máquina

Podman en Windows corre sobre una máquina liviana de Linux. Se crea una vez:

```powershell
podman machine init
podman machine start
podman version
podman run --rm hello-world
```

El último descarga una imagen mínima, la ejecuta y la borra. Si imprime un saludo, el motor funciona.

> ⚠️ **Si falla con un mensaje sobre virtualización o sobre el subsistema de Linux**, no sigas
> intentando: es configuración del equipo y la resuelve Sistemas. Anota el mensaje exacto y pásalo.

### Decirle a las pruebas dónde está el motor

**Este paso es el que más se olvida, y sin él las pruebas de integración no arrancan.** La librería
que levanta contenedores busca el socket de Docker, que aquí no existe:

```powershell
@'
docker.host=npipe://./pipe/podman-machine-default
'@ | Set-Content "$env:USERPROFILE\.testcontainers.properties" -Encoding UTF8
```

> ⚠️ **El archivo va en tu carpeta de usuario, nunca en el repositorio.** Es configuración de tu
> equipo: quien use otro motor de contenedores necesita otra cosa ahí.

**No hace falta desactivar la limpieza de contenedores**, aunque muchas guías de Podman lo digan. Se
comprobó con la suite completa y al terminar no quedó ninguno. El aviso `Can not connect to Ryuk` es
ruidoso pero inofensivo.

## 4 · Traer el proyecto

```powershell
cd $env:USERPROFILE\código
git clone git@github.com:LA_ORGANIZACION/NOMBRE_DEL_REPOSITORIO.git
cd NOMBRE_DEL_REPOSITORIO
```

Se clona por SSH, que es lo que configuraste en [las llaves](/equipo/llaves). Si pide contraseña, la
llave no está cargada.

## 5 · Levantar la base de datos local

Desde la raíz del proyecto:

```powershell
podman compose up -d
podman compose ps
```

Debe aparecer como `running`. Los datos quedan en un volumen y sobreviven a apagar el contenedor.

**Para volver al estado inicial** —útil cuando una migración sale mal—:

```powershell
podman compose down -v
podman compose up -d
```

El `-v` borra el volumen. Es destructivo y es a propósito: en local, volver a empezar debe ser barato.

## 6 · Construir

```powershell
.\mvnw.cmd clean verify
```

La primera vez descarga el gestor de construcción y las dependencias, y tarda varios minutos. Las
siguientes son rápidas.

> ⚠️ **Siempre `.\mvnw.cmd`, nunca `mvn`.** Si tienes Maven instalado de antes y lo invocas directo,
> construyes con otra versión que el resto del equipo y que la integración. Los fallos que eso
> produce son de los que cuesta días encontrar.
>
> En Git Bash el comando es `./mvnw`, sin extensión.

## 7 · Ejecutar la aplicación

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
curl http://localhost:8080/actuator/health
```

Debe devolver un estado `UP`. Para detenerla, **Ctrl+C** en la misma ventana.

> ⚠️ **Sin el perfil no arranca, y el error no dice que falte un perfil.** La configuración base no
> declara origen de datos a propósito; el que lo declara es el perfil `local`. Si lo omites, el
> arranque falla por una causa que parece de otra cosa.

> **Las comillas tampoco sobran, y esto es de PowerShell.** Sin ellas, el intérprete puede partir el
> argumento por el `=` y Maven recibe la propiedad a medias: **arranca igual, pero sin el perfil**.
> En `cmd.exe` daría lo mismo; aquí no.

**Si la base local pide contraseña**, va en la sesión antes de arrancar —sale de la definición del
servicio del repositorio, y no se escribe en el comando para que no quede en el historial—:

```powershell
$env:VORTICE_DB_PASSWORD = '<la del servicio>'
```

## Comprobar que todo quedó bien

Cinco comandos, en orden. Si los cinco pasan, el entorno está listo:

```powershell
java -version                 # responde 26
podman machine list           # la máquina, running
podman compose ps             # la base de datos, running
.\mvnw.cmd clean verify       # compila y las pruebas pasan

# Y el arranque, que necesita el perfil
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

Y una sexta que no es un comando: **conéctate a la base de datos con el cliente** y confirma que ves
los esquemas del proyecto. Si están vacíos, las migraciones no corrieron.

## Problemas frecuentes

| Síntoma | Causa y salida |
|---|---|
| El envoltorio falla y `Test-Path $env:JAVA_HOME` responde `False` | La variable apunta a una carpeta inexistente. **Es el fallo más frecuente**, y engaña porque `java -version` sí responde. Paso 1 |
| `JAVA_HOME is not set` | Cierra y abre PowerShell. Si persiste, ponla según el paso 1 |
| `.\mvnw.cmd` no se reconoce | No estás en la raíz del repositorio. Comprueba que existe el archivo |
| `Could not find a valid Docker environment` | Falta `.testcontainers.properties`, o la máquina está detenida: `podman machine start` |
| `localhost:2375 failed to respond` | La máquina se quedó sin responder a media corrida. `podman machine stop` y `start` |
| Quedan contenedores vivos tras una corrida | `podman container prune -f`. Si pasa siempre, repórtalo: no es lo esperado |
| `podman machine` no arranca tras reiniciar | No se inicia sola. `podman machine start`, o déjalo abierto desde Podman Desktop |
| `port is already allocated` | Otro proceso usa ese puerto. Cámbialo en la definición del servicio |
| La compilación pide otra versión de Java | El `CLAUDE.md` manda. Instala la que diga, no la que tengas |
| Descarga lentísima la primera vez | Normal: baja el gestor y todas las dependencias. Solo pasa una vez |

## Reglas que aplican a todos

**La versión de las herramientas la manda el repositorio**, no tu equipo. El `CLAUDE.md` de la raíz
es la referencia; si no coincide con lo que tienes, se actualiza el equipo.

**Nunca se invoca el gestor de construcción directamente.** Siempre por el envoltorio. Es la única
forma de que todos y la integración construyan igual.

**No se instala Docker Desktop en equipos de la compañía.** Está por encima del umbral de licencia
gratuita. Si alguien lo necesita para otra cosa, se escala a Sistemas **antes** de instalarlo.

**La base de datos local es desechable.** No guardes ahí nada que te importe: se borra y se recrea a
diario. Lo que importa vive en los ambientes.

**Ningún secreto en el repositorio.** Si algo tiene que ser secreto, no se escribe en un archivo
versionado.

## Calendario de mantenimiento

Esto no es opcional, y conviene tenerlo a la vista desde el primer día:

| Cuándo | Qué |
|---|---|
| **Septiembre de 2026** | Java 26 deja de recibir actualizaciones. Toca subir a la 27 |
| Tras **cada** actualización del kit | Comprobar `Test-Path $env:JAVA_HOME`. La carpeta cambia de nombre y la variable se desalinea |
| Cada seis meses después | Nueva versión del kit, hasta la de soporte prolongado de 2027 |
| Continuo | El bot de actualización propone el resto: librerías, complementos e imágenes |

**La actualización se hace en el `CLAUDE.md` del repositorio y luego en los equipos, en ese orden.**
Nunca al revés: si cada quien actualiza cuando quiere, dejamos de construir igual.

<div class="siguiente">

**Si las cinco comprobaciones pasaron, puedes empezar.** Lo que sigue no es de instalación: es
[el día a día](/git/dia-a-dia), donde está el orden de la entrega y la compuerta que pasa este
repositorio.

</div>
