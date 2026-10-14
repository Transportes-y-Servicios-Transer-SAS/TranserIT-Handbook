---
title: Las llaves de GitHub, una para entrar y otra para firmar
---

# Las llaves de GitHub

> **Se hace una vez por persona y por equipo**, y da por hecho que las herramientas base ya están
> instaladas.
>
> **Reserva veinte minutos sin interrupciones.** Vas a inventar dos frases de paso que **no se
> pueden recuperar**.

## Dos llaves, y hacen cosas distintas

<Diagrama
  nombre="llaves"
  titulo="La llave SSH abre la puerta de GitHub; la GPG pone tu nombre dentro del commit" />

| | Para qué sirve | Qué pasa si falta |
|---|---|---|
| **Llave SSH** | Que Git traiga y publique sin pedirte contraseña | Tienes que autenticarte en cada operación |
| **Llave GPG** | Que tus *commits* salgan marcados como **Verified** | Cualquiera puede publicar un *commit* con tu nombre y tu correo |

**Lo segundo no es cosmético.** Git no verifica quién eres: el autor de un *commit* es un texto que
cualquiera puede escribir. **Firmar es lo único que ata un cambio a una persona**, y es lo que hace
que el rastro sirva como evidencia.

## 1 · Identificarte en Git

```powershell
git config --global user.name "Nombre Apellido"
git config --global user.email "tu.correo@transer.com.co"
```

> ⚠️ **El correo tiene que ser el mismo que tengas verificado en GitHub.** Si no coincide, los
> *commits* aparecerán sin verificar **aunque los firmes bien**. Es el error más común de toda esta
> página.

## 2 · Entrar a GitHub desde la terminal

```powershell
gh auth login
```

Responde:

| Pregunta | Qué elegir |
|---|---|
| What account do you want to log into? | **GitHub.com** |
| What is your preferred protocol? | **SSH** |
| Generate a new SSH key? | **No** — la creamos en el paso siguiente |
| How would you like to authenticate? | **Login with a web browser** |

Copia el código que muestra, pulsa Enter y autoriza en el navegador que se abre.

## 3 · La llave SSH, la que abre la puerta

```powershell
# Ed25519: más corta y más segura que RSA. Es lo que GitHub recomienda hoy
ssh-keygen -t ed25519 -C "tu.correo@transer.com.co"
```

Pregunta tres cosas:

1. **Dónde guardarla** — Enter para aceptar la ruta por defecto.
2. **Frase de paso** — **escribe una. No la dejes vacía.**
3. **Repetirla.**

> ⚠️ **La frase de paso sigue las reglas de contraseñas de la compañía** —la guía `5411-G2`: mínimo
> siete caracteres, con mayúscula, minúscula, número y símbolo.
>
> No es opcional: **una llave sin frase de paso es un archivo que, copiado, da acceso a todo el
> código.**

### Que no te la pida en cada operación

En una ventana **de administrador**, solo la primera vez:

```powershell
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent
```

Y con tu usuario normal:

```powershell
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"
```

### Subirla a GitHub y comprobar

```powershell
gh ssh-key add "$env:USERPROFILE\.ssh\id_ed25519.pub" --title "Equipo Transer - $env:COMPUTERNAME"
ssh -T git@github.com
```

Debe responder algo como *«Hi usuario! You've successfully authenticated…»*. La primera vez pregunta
si confías en el servidor: responde `yes`.

> **Sube la mitad pública, la del archivo `.pub`.** La otra mitad —la que no lleva extensión— es la
> privada y **no sale de tu equipo nunca**.

## 4 · La llave GPG, la que pone tu nombre

El GnuPG que usamos es el que vino dentro de Git, y **no está en la ruta de búsqueda**. Defínelo una
vez en la ventana donde vayas a trabajar:

```powershell
$gpg = "C:\Program Files\Git\usr\bin\gpg.exe"
```

Y crea la llave:

```powershell
& $gpg --full-generate-key
```

Responde así:

| Pregunta | Qué elegir |
|---|---|
| Please select what kind of key you want | **9** — ECC (sign and encrypt) |
| Please select which elliptic curve | **1** — Curve 25519 |
| Key is valid for? | **2y** — dos años |
| Is this correct? | **y** |
| Real name | Tu nombre completo |
| Email address | **El mismo correo verificado en GitHub** |
| Comment | Déjalo vacío |
| Change (N)ame, (C)omment, (E)mail or (O)kay? | **O** |

Después pide una **frase de paso**. Mismas reglas que antes, y **usa una distinta a la de SSH**.

> **La vigencia de dos años es a propósito.** Una llave sin fecha de expiración que se pierda queda
> válida para siempre. Se puede extender antes de que venza con `& $gpg --edit-key`, así que no hay
> riesgo de quedarte fuera.

### Averiguar su identificador

```powershell
& $gpg --list-secret-keys --keyid-format=long
```

Busca la línea que empieza por `sec` y toma lo que va **después de la barra**:

```text
sec   ed25519/A1B2C3D4E5F6A7B8 2026-08-28 [SC]
                ^^^^^^^^^^^^^^^^
                este es tu identificador
```

### Subirla a GitHub

```powershell
# Exportar la parte pública a un archivo temporal
& $gpg --armor --export TU_IDENTIFICADOR > "$env:TEMP\llave-gpg.asc"

# Subirla
gh gpg-key add "$env:TEMP\llave-gpg.asc"

# Borrar el temporal: ya cumplió
Remove-Item "$env:TEMP\llave-gpg.asc"
```

## 5 · Decirle a Git que firme

```powershell
git config --global user.signingkey TU_IDENTIFICADOR
git config --global commit.gpgsign true
git config --global tag.gpgsign true
git config --global gpg.program "C:/Program Files/Git/usr/bin/gpg.exe"
```

> ⚠️ **Esta última línea es la que más falla, y conviene entender por qué.**
>
> Puede haber más de un GnuPG en el equipo, y **cada uno guarda las llaves en una carpeta distinta**.
> Si creaste la llave con uno y aquí apuntas al otro, al firmar sale *«secret key not available»* y
> nada indica la causa.
>
> Compruébalo antes de seguir:
>
> ```powershell
> Test-Path (git config --global gpg.program)                                  # debe decir True
> & (git config --global gpg.program) --list-secret-keys --keyid-format=long
> ```
>
> La segunda orden debe listar **tu** llave. Si no aparece, estás apuntando al GnuPG equivocado.

> **Ojo con las barras.** En esa ruta van barras normales `/`, no invertidas: Git las interpreta bien
> y evita el problema de las barras dobles en su archivo de configuración.

## 6 · Comprobar que todo quedó bien

```powershell
cd $env:TEMP
mkdir prueba-firma; cd prueba-firma
git init
"prueba" > archivo.txt
git add archivo.txt
git commit -m "Prueba de firma"
```

Te pedirá la frase de paso de GPG. Después:

```powershell
git log --show-signature -1
```

Busca **`Good signature from "Tu Nombre <tu.correo@transer.com.co>"`**. Si aparece, está listo:

```powershell
cd $env:TEMP; Remove-Item -Recurse -Force prueba-firma
```

**La comprobación final es en GitHub:** haz un *commit* en cualquier repositorio del equipo y
confirma que sale la etiqueta verde **Verified** junto al mensaje.

## Problemas frecuentes

| Síntoma | Causa y salida |
|---|---|
| `gpg: signing failed: No secret key` | Git está usando otro gpg. Revisa la ruta del paso 5 |
| El *commit* sale **Unverified** | El correo del *commit* no coincide con el de la llave, o no está verificado en GitHub. `git config user.email` |
| `Permission denied (publickey)` | La llave SSH no está cargada. `ssh-add` otra vez, o revisa que el servicio `ssh-agent` esté iniciado |
| `gpg` no se reconoce | **Es lo esperado.** Invócalo por su ruta, o define `$gpg` como en el paso 4 |
| `secret key not available` al firmar | `gpg.program` apunta a un GnuPG que no tiene tu llave. Compruébalo con la orden del paso 5 |
| Pide la frase de paso en cada *commit* | Normal la primera vez tras reiniciar. El agente la recuerda el resto de la sesión |

## Reglas que aplican a todos

**La llave privada no sale de tu equipo.** Nunca por correo, ni por chat, ni copiada a una memoria.
Si necesitas trabajar desde otro equipo, **se genera una llave nueva ahí** — tener varias es normal
y es lo correcto.

**Las frases de paso siguen la guía `5411-G2`** de la compañía, igual que cualquier otra contraseña.

**Si pierdes el equipo o sospechas que alguien accedió a él, avisa el mismo día.** Las llaves se
revocan en GitHub y se generan nuevas. Una llave comprometida da acceso al código hasta que se
revoque.

**Al salir de la empresa, las llaves se revocan.** Está ligado al procedimiento de cierre de cuenta,
no es un trámite aparte.

## Por qué dos llaves y no una

GitHub también permite **firmar con la misma llave SSH**, sin GPG. Es más sencillo de montar y de
mantener.

Aquí usamos GPG porque **separa las dos funciones**: una llave para entrar y otra para firmar, de
modo que comprometer el acceso no compromete la capacidad de firmar en tu nombre. Si el equipo
decide simplificar más adelante, es un cambio de configuración y no obliga a regenerar nada.

<div class="siguiente">

**Con las dos llaves puestas, tu equipo ya habla con GitHub y tus *commits* llevan tu nombre.**

**Lo siguiente depende de a qué llegaste:** el entorno del servidor o el de la pantalla.

</div>
