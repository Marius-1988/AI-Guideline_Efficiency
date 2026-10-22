# Template del Story Mapping (fijo)

Referencia visual: tablero «Flexxus — Story Mapping intenciones»
(`https://miro.com/app/board/uXjVEW2LpRg=/`), generado el 2026-10-22 desde
`AI-Outputs/po-expert-user-stories/po-historias-usuario-2026-10-22-flexxus-intenciones-vendedor-administrativo.md`.
El layout lo produce `scripts/build_storymap.py render`; este archivo define **qué** debe
contener cada grupo, no se dibuja a mano.

## Grupos de información (todos obligatorios)

| # | Grupo | Contenido | Campo JSON |
|---|---|---|---|
| 1 | Frame | Un frame blanco «{producto} · {subtitle}» que contiene todo | `product`, `subtitle` |
| 2 | Encabezado | Título (67 px, negrita) y subtítulo (33 px) | `title`, `subtitle` |
| 3 | MVP | Una frase: qué hace el producto en el MVP y qué todavía no | `mvp` |
| 4 | Épicas | Listado `CÓDIGO · nombre` | `epics[]` |
| 5 | Objetivos | `OBJ-n texto`, uno por línea | `objetivos[]` |
| 6 | Fuentes | Links al documento de historias y al PRD/análisis | `fuentes[]` |
| 7 | Referencias | Leyenda de 4 post-its: Historia de usuario (light_green), Historia técnica (light_blue), Tarea técnica (gray), Spike (pink) | fija |
| 8 | Cabecera de épica | Banda violeta `#8f7fee` con `CÓDIGO` en negrita y el nombre, una por columna | `epics[]` |
| 9 | Carriles | Filas MUST · MVP 1, SHOULD · MVP 2, COULD · MVP 3 y SPIKES (etiqueta `#dedaff`, fondo `#f4f2fd`) | `items[].lane` |
| 10 | Post-its | Uno por HU, HT, tarea y spike, bajo su épica y en su carril: `<a href=url>CLAVE — Título</a>` | `items[]` |

Orden dentro de cada celda épica × carril: HU, HT, tareas, spikes. Las tareas van al
carril MUST; los spikes al carril SPIKES. Columnas por épica: entre 3 y 6, según el
carril más poblado.

## Esquema de `storymap.json`

```json
{
  "title": "Flexxus: de pantallas a intenciones",
  "subtitle": "Story Mapping",
  "product": "Flexxus ERP",
  "board_name": "Flexxus — Story Mapping",
  "mvp": "Intención «Vender en mostrador»: …",
  "epics": [{"code": "ROL", "name": "Experiencia por rol: entrada y navegación"}],
  "objetivos": ["OBJ-1 Roles Vendedor y Administrativo definidos"],
  "fuentes": [{"label": "Historias de usuario (md)", "url": "https://github.com/…/historias.md"}],
  "items": [{"key": "ROL-01", "title": "Entrar a la pantalla de inicio de mi rol",
             "type": "HU", "epic": "ROL", "lane": "Must",
             "url": "https://github.com/…/historias.md#rol-01--entrar-a-la-pantalla-de-inicio-de-mi-rol"}],
  "warnings": []
}
```

- `type`: `HU` | `HT` | `T` | `S`. `lane`: `Must` | `Should` | `Could` | `Spike`.
- `url`: ancla estilo GitHub del título de la tarjeta (minúsculas, sin puntuación,
  espacios → guiones; acentos codificados). Tareas y spikes sin título propio enlazan a
  la sección §8 o §9 del documento.
- Prioridades admitidas en el MD: Must/Should/Could o Alta/Media/Baja; sin prioridad → Must.

## Cómo completar desde un documento que no es de `po-expert-user-stories`

- Cada épica o módulo del análisis → `epics[]`; cada requerimiento, historia o capacidad
  → un `items[]` de tipo `HU` (funcional) o `HT` (endpoint/técnico).
- Decisiones abiertas o dudas → `S` en carril `Spike`; habilitadores → `T`.
- `mvp` y `objetivos` salen del resumen ejecutivo y de los objetivos del documento; si no
  existen, redactarlos desde el alcance y marcarlos con «(propuesto)».
- `url`: link al encabezado del documento de origen más cercano al ítem.
