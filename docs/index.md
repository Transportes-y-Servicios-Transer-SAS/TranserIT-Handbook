---
layout: home

hero:
  name: Manual de IT
  text: Cómo trabaja el área
  tagline: "Control de versiones, proceso y entornos. Para quien escribe código y para quien no."
  actions:
    - theme: brand
      text: Empezar por el principio
      link: /git/que-es
    - theme: alt
      text: Cómo leer esto
      link: "#por-donde-empezar"
    - theme: alt
      text: Sobre este manual
      link: /sobre

features:
  - title: Git, de cero
    details: "Siete partes, de qué es Git hasta cómo deshacer. La primera no trae un solo comando: está escrita para entender, no para ejecutar."
    link: /git/que-es
    linkText: Las siete partes
  - title: Preparar el equipo
    details: "Las herramientas, las llaves de GitHub y los dos entornos de desarrollo. Lo que se hace una vez, el primer día."
    link: /equipo/herramientas
    linkText: Montar una máquina
  - title: Vórtice
    details: "El proyecto: qué se construye, cómo una pregunta al negocio acaba siendo código, y qué lo comprueba antes de salir."
    link: /vortice/que-es
    linkText: Entrar al proyecto
---

<div class="inicio">

## Por dónde empezar

**No todo el mundo necesita leerlo entero**, y leerlo en el orden equivocado es la forma más rápida
de abandonarlo. Busca tu caso:

### No escribes código, pero trabajas con quien lo escribe

Lee **[la parte 1 de Git](/git/que-es)** y para ahí. Son unos quince minutos, no trae un solo
comando, y al terminar puedes seguir una conversación sobre ramas, revisiones y por qué un cambio
tardó.

Si además quieres saber cómo se decide lo que se construye, sigue con
**[qué estás construyendo](/vortice/que-es)**.

### Es tu primer día en el equipo

En este orden, y sin saltarte el principio aunque ya sepas Git:

| | |
|---|---|
| **1** | [Las herramientas base](/equipo/herramientas) y [las llaves](/equipo/llaves) — hacen falta las dos antes de clonar nada |
| **2** | Tu entorno: [el del servidor](/equipo/servidor) o [el de la pantalla](/equipo/pantalla) |
| **3** | [Git, de cero](/git/que-es), partes 1 a 4. La 4 es la nuestra y no se parece a lo que hayas visto |
| **4** | [Vórtice](/vortice/que-es) — las tres páginas, en orden |
| **5** | [El día a día](/git/dia-a-dia), que es la que vas a tener abierta a partir de entonces |

### Ya trabajas aquí y vienes a consultar algo

| | |
|---|---|
| El orden exacto de la entrega, o el comando de una compuerta | [El día a día](/git/dia-a-dia) |
| Salir de un conflicto | [Conflictos](/git/conflictos) |
| Deshacer algo | [Deshacer](/git/deshacer), que empieza por un árbol de decisión |
| Qué rama recibe qué, y en qué dirección | [Nuestra estructura](/git/estructura) |
| Qué comprueba cada compuerta, y por qué | [Las compuertas](/vortice/compuertas) |

## Qué es esto, y qué no

**Es el manual del área, no el de un proyecto.** Las dos primeras secciones valen en cualquier
repositorio de Transer; la tercera describe Vórtice, y está separada por eso.

**Explica el proceso; no es la norma.** Las *skills* de derivación, los registros de decisión y las
especificaciones son la norma, y cada una vive donde se aplica. Aquí se dice **cuándo y por qué** se
usa cada cosa, y se remite al sitio donde está el **cómo**.

> Eso no es ceremonia: es lo que impide que este manual se vuelva una copia más que se desvía. Un
> documento que repite una regla y se queda atrás es peor que no tenerlo, porque alguien lo cita.

**Los diagramas se abren.** Todos son interactivos: pulsa cualquiera para explorarlo a pantalla
completa, con foco por elemento y el detalle de cada paso.

</div>

<style scoped>
.inicio {
  max-width: 1152px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
}
.inicio h2 {
  margin: 2.5rem 0 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.inicio h3 {
  margin: 2rem 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.inicio p,
.inicio li {
  line-height: 1.75;
}
.inicio table {
  display: table;
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
}
.inicio thead {
  display: none;
}
.inicio th,
.inicio td {
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  text-align: left;
}
.inicio td:first-child {
  width: 1%;
  white-space: nowrap;
}
.inicio blockquote {
  margin: 1.25rem 0;
  padding-left: 1rem;
  border-left: 3px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
</style>
