# miro-story-mapping

Crea un Story Mapping en Miro a partir del documento de historias de usuario de
`po-expert-user-stories` (o de otro documento de análisis), con el mismo template que el
tablero «Flexxus — Story Mapping intenciones».

## Cómo usarlo

En el chat de Cursor:

> Usá el skill **miro-story-mapping** con `AI-Outputs/po-expert-user-stories/<historias>.md`

El agente pregunta primero si el tablero está en el equipo de Miro del MCP y si querés
uno nuevo o uno existente. Nunca borra ni modifica contenido previo del tablero.

## Requisitos

- MCP de Miro conectado en Cursor, autorizado sobre el equipo del tablero
  ([setup](references/setup-miro-mcp.md)).
- Python 3.9+ (solo librería estándar).

## Salida

`AI-Outputs/miro-story-mapping/<AAAA-MM-DD>-<slug>/`: `storymap.json` (datos editables),
`storymap.svg` (lo que se sube a Miro) e `informe.md` (URL del tablero y conteos).

## Estructura

- `SKILL.md` — flujo del agente
- `references/storymap-template.md` — grupos obligatorios y esquema JSON
- `references/setup-miro-mcp.md` — cómo alinear el equipo de Miro con el MCP
- `scripts/build_storymap.py` — `parse`, `render` (valida completitud) y `report`
