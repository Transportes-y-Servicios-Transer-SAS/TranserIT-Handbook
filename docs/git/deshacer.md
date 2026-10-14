---
title: Deshacer, volver atrás sin romper nada
---

# Deshacer: volver atrás sin romper nada

> Esta es la parte que se busca con prisa, así que va al grano.
>
> **La pregunta no es qué hiciste mal. Es hasta dónde llegó.** Eso decide el comando, y decide si
> deshacerlo es gratis o le cambia el suelo a otra persona.

## El árbol, y empieza siempre por la raíz

<Diagrama
  nombre="deshacer"
  titulo="Qué comando deshace lo tuyo, según hasta dónde llegó: editado, elegido, confirmado o publicado" />

## 1 · Solo lo editaste

Nada de `add`, nada de `commit`. El cambio está en tu carpeta y en ningún sitio más.

```powershell
# Un archivo, a como estaba en el último commit
git restore ruta/del/archivo

# Todo lo que no hayas elegido todavía
git restore .
```

> ⚠️ **Aquí sí se pierde de verdad.** Lo que nunca llegó a un *commit* no está guardado en ninguna
> parte, y `git restore` lo borra sin red. Si tienes dudas, aparta en vez de borrar:
>
> ```powershell
> git stash
> ```
>
> Lo guarda a un lado, te deja la carpeta limpia, y vuelve con `git stash pop`.

## 2 · Hiciste `git add` pero no confirmaste

El archivo está elegido para el próximo *commit* y quieres sacarlo de ahí **sin perder lo que
escribiste**:

```powershell
git restore --staged ruta/del/archivo
```

Vuelve al estado anterior del diagrama de la parte 2: modificado, pero no elegido. **El cambio sigue
intacto.**

## 3 · Confirmaste, pero no has publicado

El *commit* existe solo en tu equipo. Puedes reescribirlo con total libertad, porque **no existe
para nadie más**.

### Si solo quieres arreglar el último

```powershell
# Cambiar la nota
git commit --amend -m "feat: la nota correcta [VORT-142]"

# Se te olvidó un archivo: añádelo al commit que ya hiciste
git add ruta/que/faltaba
git commit --amend --no-edit
```

`--no-edit` conserva la nota tal como estaba.

### Si quieres deshacer el *commit* y conservar lo que hiciste

```powershell
git reset --soft HEAD~1
```

El *commit* desaparece y **tus cambios vuelven a estar elegidos**, listos para rehacerlos mejor — por
ejemplo para partirlos en dos *commits* con sentido.

| Variante | Qué pasa con tus cambios |
|---|---|
| `--soft` | Se quedan **elegidos**. Es la que casi siempre quieres |
| `--mixed` (la de por defecto) | Se quedan en la carpeta, sin elegir |
| `--hard` | **Se borran.** Sin vuelta atrás para lo que no esté confirmado |

> ⚠️ **`git reset --hard` es el único comando de este manual que destruye trabajo de verdad.** Úsalo
> solo con `git status` limpio y sabiendo exactamente qué estás tirando.

## 4 · Ya lo publicaste

Aquí cambia la regla, y no por gusto: **otra persona puede haberlo traído ya.** Reescribir lo
publicado le cambia el suelo a quien está trabajando encima.

```powershell
git revert id-del-commit
```

`git revert` **no borra nada**: crea un *commit* nuevo que hace lo contrario. La historia queda más
larga y eso es exactamente lo que se quiere — queda registrado qué entró, qué se deshizo y cuándo.

**En una rama larga —`develop`, `test`, `master`— es la única opción.** No se reescribe.

### Y si de verdad hay que reescribir una rama de trabajo publicada

Pasa: te das cuenta de que un *commit* lleva un dato que no debía salir. Entonces:

```powershell
git push --force-with-lease
```

**Nunca `--force` a secas.** `--force-with-lease` se niega si alguien publicó algo mientras tanto, en
vez de pisarlo.

> ⚠️ **Y avisa a quien la esté revisando.** Sus comentarios pueden haberse desligado de las líneas a
> las que apuntaban, y verá cambios que no entiende.
>
> **Si lo que se publicó fue una credencial, reescribir no basta: hay que rotarla.** Estuvo en un
> servidor remoto; asumir que nadie la vio no es una medida de seguridad.

## La red de seguridad que casi nadie conoce

```powershell
git reflog
```

Lista **dónde estuvo `HEAD`**: cada cambio de rama, cada *commit*, cada *reset*. No es el historial
de la rama — es el tuyo, local, y conserva durante semanas *commits* que ninguna rama nombra ya.

```powershell
# Encuentras el identificador en el reflog y vuelves ahí
git switch -c rescate a3f91c2
```

**Si creías haber perdido un *commit*, mira ahí antes de rehacer el trabajo.** Casi siempre sigue
estando.

## Lo que sí se pierde, para que lo sepas

| | |
|---|---|
| **Lo que nunca llegó a un *commit*** | `git restore` y `git reset --hard` lo borran de verdad |
| **Un archivo que nunca añadiste** | Git no sigue lo que no le presentaste: para él no existe |
| **Un *stash* descartado** | `git stash drop` sí borra |

Todo lo demás —*commits*, ramas, fusiones— **se recupera**, porque sigue existiendo aunque nada lo
nombre.

## Problemas que vas a ver

| Lo que dice Git | Qué pasó |
|---|---|
| `error: your local changes would be overwritten` | Tienes cambios sin confirmar que estorban. `git stash` y repite |
| `fatal: ambiguous argument 'HEAD~1'` | El repositorio tiene un solo *commit*: no hay anterior al que volver |
| `Updates were rejected` tras un `--amend` | Reescribiste algo ya publicado. Es el caso del `--force-with-lease` |
| `You are in 'detached HEAD' state` | Te moviste a un *commit* y no a una rama. `git switch -c nombre` para quedarte ahí, o `git switch -` para volver |

<div class="siguiente">

**Con esto se cierra «Git, de cero».** Qué es y qué problema resuelve · el flujo básico · las ramas ·
nuestra estructura · el día a día · los conflictos · y deshacer.

**Si llegaste hasta aquí leyendo seguido, ya sabes más de Git que la mayoría de quienes lo usan a
diario.** Lo que queda es práctica, y para eso está la parte 5 abierta en otra pestaña.

</div>
