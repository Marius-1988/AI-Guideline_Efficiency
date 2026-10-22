---
name: miro-story-mapping
description: >-
  Crea un Story Mapping en Miro (tablero nuevo o existente, sin borrar ni pisar nada)
  desde un MD de historias de usuario o de análisis: épicas, carriles MUST/SHOULD/COULD/
  SPIKES y un post-it linkeado por HU, HT, tarea y spike. Usar al pedir un story map
  en Miro.
disable-model-invocation: true
---

# Miro Story Mapping

**Rol:** PO que convierte el backlog refinado en un story map navegable en Miro, con el
template fijo de [references/storymap-template.md](references/storymap-template.md).

## Reglas duras

1. **Nunca borrar ni pisar:** solo `canvas_create_from_svg` (aditivo); jamás
   `data-deleted`; `canvas_update_from_svg` solo sobre ids devueltos **en esta corrida**.
2. **Todos los grupos del template completos:** lo valida `render`; con `INCOMPLETO`
   no se sube nada.
3. **Un post-it por ítem**, debajo de su épica, con título y link al documento.
4. Antes de cualquier SVG: `canvas_get_canvas_composer_skill` (sin paso, luego
   `design` y `dsl`), una vez por corrida.
5. Voseo con el usuario; textos del tablero en español neutro.
6. **Cierre en chat = resumen + rutas + conteos.** Nunca volcar el SVG ni el JSON.

## Flujo

### Paso 0 — Dos preguntas iniciales (siempre, en un solo `AskQuestion`)

1. «¿El tablero está en el equipo de Miro al que accede el MCP?» — opciones: sí / no sé
   cómo verificarlo. Si no sabe: explicarle con
   [references/setup-miro-mcp.md](references/setup-miro-mcp.md) (leerlo solo en ese caso).
2. «¿Creo un tablero nuevo o usás uno existente?» — si existe, pedir la URL
   `https://miro.com/app/board/<id>/` (los links `welcomeonboard` no sirven).

### Paso 1 — Insumo → JSON

Documento de `po-expert-user-stories` (13 secciones):

```bash
python AI-Agents/miro-story-mapping/scripts/build_storymap.py parse --md <historias.md> --out AI-Outputs/miro-story-mapping/<AAAA-MM-DD>-<slug>
```

Toma épicas, HU (§6), HT (§7), tareas (§8), spikes (§9), y MVP/objetivos del PRD
enlazado (o `--prd`). Los links salen del remoto git (`--doc-url` si no hay).
Otro documento de análisis: armar `storymap.json` a mano según el esquema del template.
Revisar los `AVISO` y completar en el JSON lo que falte (épica de tareas/spikes, MVP,
objetivos) antes de seguir.

### Paso 2 — Validar y renderizar (bloqueante)

```bash
python AI-Agents/miro-story-mapping/scripts/build_storymap.py render --json <dir>/storymap.json
```

`INCOMPLETO`: completar los campos `FALTA` en el JSON y re-ejecutar hasta `OK`. Con
aviso de tamaño (> 190.000 chars) renderizar por partes con `--epics`.

### Paso 3 — Tablero

- **Nuevo:** `board_create` con `board_name` del JSON (≤ 60 chars; ajustarlo si conviene).
  Si responde «temporarily unavailable», reintentar una vez; si persiste, pedir al usuario
  que lo cree a mano y pase la URL.
- **Existente:** probar acceso con `canvas_get_canvas_composer_skill(miro_url)`. «Board
  access denied» = equipo distinto → setup-miro-mcp.md. Luego `canvas_search`
  (`result_mode="overview"`) para conocer el contenido; si ya hay un frame con el mismo
  título, agregar la fecha al `subtitle` del JSON y re-renderizar.

### Paso 4 — Subir

Leer `storymap.svg` y enviarlo tal cual con `canvas_create_from_svg` (la colocación evita
colisiones con lo existente). Si reporta dimensiones distintas o superposiciones, mover
solo esos ids con `canvas_update_from_svg`, envolviéndolos en el frame
(`<g data-frame data-miro-id>` + su `rect data-type="frame"`). Al final, `board_show`
una vez con `?moveToWidget=<frame_id>`.

### Paso 5 — Informe y cierre

```bash
python AI-Agents/miro-story-mapping/scripts/build_storymap.py report --json <dir>/storymap.json --board-url <url> --frame-id <id>
```

Chat (≤ 8 líneas): tablero y frame, conteos por tipo y carril, avisos/pendientes, ruta
de `informe.md`. Luego git sync según `config.json` raíz (`apply_to.agent_outputs`):
`storymap.json`, `storymap.svg` e `informe.md`.

## Checklist de cierre

- [ ] Paso 0 respondido; acceso al tablero verificado
- [ ] `render` devolvió `OK` (sin `FALTA`)
- [ ] Ningún widget preexistente borrado ni editado
- [ ] Superposiciones corregidas y `board_show` ejecutado una vez
- [ ] Chat = resumen + rutas + conteos
