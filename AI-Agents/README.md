# AI-Agents

Cada subcarpeta es un **agente** usable desde Cursor (skill) o desde la línea de comandos (scripts).

## Agentes

| Agente | Descripción |
|--------|-------------|
| [sprint-health-check](sprint-health-check/) | Validación de salud del sprint en curso (Jira) |
| [po-expert-user-stories](po-expert-user-stories/) | Product Owner: épicas y documentos de negocio → historias detalladas (MD + CSV) |
| [po-prd-generator](po-prd-generator/) | SR Product Owner: cualquier documento → PRD .md de análisis inicial (14 secciones fijas, corte de MVP, RF/RNF, riesgos, plan, DoD) |
| [jira-load-user-stories](jira-load-user-stories/) | SM/PO: carga en Jira las historias del MD de po-expert (tras validación manual) |
| [jira-stories-to-architecture](jira-stories-to-architecture/) | Historias Jira → paquete de arquitectura (C4, ER, APIs, Mermaid + PNG) |
| [po-architect-agent](po-architect-agent/) | Alex: persona PO + Arquitecto SR con menú; delega en jira-stories-to-architecture |
| [miro-story-mapping](miro-story-mapping/) | Historias de usuario o análisis → Story Mapping en Miro (tablero nuevo o existente, sin pisar contenido; post-its linkeados al MD) |
| [po-poc-builder](po-poc-builder/) | SR PO + SR BA: descripción del cliente → POC web navegable (login, roles, flujos con datos mockeados, módulos en construcción) en GitHub Pages + Firebase, con manual de uso y flujos funcionales |
| [sm-mass-clone](sm-mass-clone/) | Clonado masivo de issues Jira (épica/sprint/backlog) con dry-run y reporte |
| [agent-efficiency-reviewer](agent-efficiency-reviewer/) | Audita agentes nuevos/modificados contra los presupuestos de tokens ([guía](../docs/agent-token-efficiency.md)) |

**Regla del repo:** todo agente nuevo o modificado pasa por `agent-efficiency-reviewer`
antes del commit (presupuestos en [docs/agent-token-efficiency.md](../docs/agent-token-efficiency.md);
paso a paso en [docs/playbook-nuevo-agente.md](../docs/playbook-nuevo-agente.md)).

## Convenciones

- `SKILL.md` — instrucciones para el agente de Cursor
- `config.json` — configuración del proyecto (tablero, estados, umbrales), cuando aplica
- `scripts/` — pipeline ejecutable, cuando aplica
- `references/` o archivos `*.md` hermanos — criterios, esquemas y documentación de apoyo

### Git sync (repo)

Al crear un agente nuevo o generar archivos en `AI-Outputs/`, respetá [`../config.json`](../config.json) → `git_sync` (`manual` | `automatic`). Ver [`../docs/git-sync.md`](../docs/git-sync.md).

## Instalación en Cursor (opcional)

Para invocar el agente por nombre en cualquier proyecto, copiá o enlazá el skill en:

```
~/.agents/skills/<nombre-del-agente>/
```

Ejemplos:

```
~/.agents/skills/sprint-health-check/
~/.agents/skills/po-expert-user-stories/
~/.agents/skills/jira-load-user-stories/
```

O pedile al agente de Cursor: *"usá el skill jira-load-user-stories del repo AI-Guideline"*.
