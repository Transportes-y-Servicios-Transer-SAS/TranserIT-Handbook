---
title: El día a día, la rutina de verdad
---

# El día a día: la rutina de verdad

> Esta es la parte que vas a tener abierta mientras trabajas. Las cuatro anteriores explican **por
> qué**; esta dice **qué tecleas y en qué orden**.
>
> Si algo de aquí no te cuadra, el porqué está en la parte 4.

## Con qué empieza la mañana

Cuatro comandos, siempre los mismos, antes de tocar nada:

```powershell
# 1. ¿Tengo algo sin confirmar? Si lo hay, resuélvelo antes de moverte de rama
git status -sb

# 2. Trae todo del remoto, y borra las referencias a ramas que ya no existen allá
git fetch --prune origin

# 3. Actualiza las tres ramas largas sin cambiar de rama
#    (solo funciona si no estás parado en ninguna de las tres)
git fetch --prune origin master:master develop:develop test:test

# 4. Vuelve a lo tuyo y tráete lo último del tronco
git switch feature/vort-123-tu-rama
git merge origin/develop
```

> **El `--prune` no es cosmético.** Sin él, las ramas borradas en el servidor siguen apareciendo en
> tu lista durante semanas, y acabas partiendo una rama nueva de una referencia que ya no existe en
> ningún sitio.

El paso 3 **se niega** a actualizar una rama que se haya separado del remoto, así que no se pierde
nada en silencio. Si falla en alguna, mira *Cuando trabajaste donde no debías*, más abajo.

## Saber si tienes la última versión

```powershell
git fetch origin
git status -sb
```

| Lo que sale | Qué significa |
|---|---|
| `## develop...origin/develop` | Estás al día |
| `## develop...origin/develop [behind 3]` | Te faltan 3 *commits*: `git pull --ff-only` |
| `## develop...origin/develop [ahead 2]` | Tienes 2 *commits* locales sin publicar |
| `[ahead 2, behind 3]` | Las dos se separaron. No sigas sin mirar qué pasó |

> ⚠️ **Si el `git fetch` da error, el `git status` te miente.** Compara contra la copia vieja del
> remoto, y te dirá que estás al día cuando no lo estás. Lee la salida del *fetch* antes de fiarte.

## Empezar una tarea

```powershell
git fetch origin
git switch -c feature/vort-123-nombre-de-la-rama origin/develop
git push -u origin feature/vort-123-nombre-de-la-rama
```

> **Se parte de `origin/develop`, no de `develop`.** Tu copia local puede estar desactualizada y no
> te enterarías hasta el primer conflicto. El nombre de la rama, en la parte 3.

## Entregar el trabajo

El orden no es una preferencia. Dos de estos pasos se hacen mal con frecuencia y el resultado es una
compuerta que pasa en falso.

<Diagrama
  nombre="entrega"
  titulo="El orden de la entrega, con los dos sitios donde ese orden importa de verdad" />

```powershell
# 1. Confirma dónde estás y qué tocaste
git status -sb

# 2. Aplica el formato ANTES de confirmar (el comando cambia por repositorio, más abajo)

# 3. Agrega por ruta y revisa exactamente lo que va
git add ruta/del/archivo1 ruta/del/archivo2
git diff --staged

# 4. Confirma, con el formato del historial
git commit -m "feat: liquida con retención especial [VORT-142]"

# 5. Tráete lo último del tronco (con merge, nunca con rebase)
git fetch origin
git merge origin/develop

# 6. Pasa la compuerta completa (más abajo)

# 7. Publica
git push
```

**Los dos pasos que importan en ese orden:**

**El formato va en el paso 2, no al final.** Si formateas después de confirmar, el *commit* que
revisa otra persona no es el que pasa la compuerta, y acabas con un *commit* extra que solo mueve
espacios.

**La compuerta va en el 6, DESPUÉS del merge.** Así pruebas el código que de verdad va a salir, con
los cambios de todos ya dentro. Al revés pruebas una versión que no existe en ningún sitio.

> **`git diff --staged` es la última oportunidad** de ver que no va ningún secreto, ningún dato
> personal ni ningún archivo que no corresponde. **Agregar por ruta y no con `git add .`** es lo que
> hace que ese *diff* sea corto y se pueda leer de verdad.
>
> Y conviene saberlo antes que después: **una vez publicado, quitarlo del último *commit* no lo
> quita de la historia.**

## La compuerta, que es distinta en cada repositorio

### `vortice-backend`

```powershell
# Paso 2 — formato
.\mvnw.cmd spotless:apply

# Paso 6 — compuerta completa
.\mvnw.cmd clean verify
```

### `vortice-frontend`

```powershell
# Paso 2 — formato
bun run format

# Paso 6 — las cinco, por separado para saber cuál falla
bun run type-check
bun run verify:eslint
bun run verify:oxlint
bun run test:unit:run
bun run build

# Y el verificador del ejemplar, que es el listón de verdad
.\.claude\skills\verify-reference-module.ps1 -Backend C:\ruta\a\vortice-backend
```

> ⚠️ **En el frontend, `bun run lint` NO sirve para verificar.** Sus dos guiones llevan `--fix`:
> arreglan el árbol y terminan en verde, así que te dicen que todo está bien **después de haberlo
> cambiado**. Las variantes `verify:*` son las que solo miran.

**Pasa la compuerta en local aunque la integración vaya a repetirla.** Enterarte en tu máquina cuesta
minutos; enterarte en el servidor cuesta una vuelta entera, y con ella el tiempo de quien esperaba
para revisar.

## Promover hacia abajo lo transversal

Esto **no es** entregar trabajo: es propagar algo que ya está decidido y verificado en `master`.

```powershell
# De master a develop
git switch develop
git pull --ff-only
git merge master
git push

# Y de develop a test
git switch test
git pull --ff-only
git merge develop
git push
```

Si la rama no se ha separado, la fusión será un avance rápido y ni siquiera creará un *commit* de
fusión.

## Cuidados

| Situación | Qué hacer |
|---|---|
| `git status` muestra cambios y necesitas cambiar de rama | Confírmalos, o guárdalos con `git stash` |
| `pull --ff-only` falla en una rama larga | Hay *commits* locales que no deberían estar ahí. Míralos con `git log origin/develop..develop` **antes de tocar nada** |
| Traerte el tronco a tu rama | `git merge origin/develop`. **Nunca `rebase`** sobre una rama ya publicada |
| Reescribiste una rama ya publicada | `git push --force-with-lease`, nunca `--force` a secas. **Y avisa a quien la esté revisando**: sus comentarios pueden haberse desligado |

### Cuando trabajaste donde no debías

Pasa, y tiene arreglo. **Sin *commits* todavía** — crear la rama se lleva contigo lo que no has
confirmado:

```powershell
git switch -c feature/vort-123-tu-rama
```

**Con *commits* locales** — primero ponlos a salvo, después deja la rama como el remoto:

```powershell
# 1. Crea la rama aquí: tus commits quedan a salvo en ella
git switch -c feature/vort-123-tu-rama

# 2. Vuelve y deja la larga igual que el remoto
git switch develop
git reset --hard origin/develop

# 3. Retoma lo tuyo
git switch feature/vort-123-tu-rama
```

> ⚠️ **`git reset --hard` borra sin recuperación lo que no esté confirmado** en la rama donde estás.
> Ejecútalo solo con `git status` limpio, y **después** de haber creado la rama del paso 1.

## Problemas que vas a ver

| Lo que dice Git | Causa y salida |
|---|---|
| `Permission denied (publickey)` | No encuentra tu llave de GitHub. Compruébalo con `ssh -T git@github.com`, y si falla, [revisa la llave](/equipo/llaves) |
| `fatal: Not possible to fast-forward, aborting` | Tu rama y el remoto se separaron. Mira la fila de `pull --ff-only` de arriba |
| `Updates were rejected because the remote contains work` | Alguien publicó algo que tú no tienes. `git pull --ff-only` y vuelve a intentarlo |
| `CONFLICT (content): Merge conflict in …` | Dos cambios sobre las mismas líneas. Es la parte 6 |
| `nothing to commit, working tree clean` | Ya confirmaste, o no cambiaste nada. `git log --oneline -3` te lo aclara |

<div class="siguiente">

**Con esto tienes el día completo**: con qué empiezas, cómo abres una tarea, en qué orden entregas,
qué compuerta pasa cada repositorio y cómo salir de los enredos más comunes.

**La parte 6 es el conflicto**: qué hacer exactamente cuando Git para y te pregunta cuál de los dos
cambios vale.

</div>
