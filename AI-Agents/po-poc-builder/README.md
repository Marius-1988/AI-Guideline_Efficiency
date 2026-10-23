# po-poc-builder

Agente (skill) que actúa como **SR Product Owner + SR Business Analyst** y convierte la
descripción de un cliente en una **POC web navegable** publicada en GitHub Pages:

- Login con usuarios de prueba por rol (o un administrador total), errores claros y modo demo.
- Menú lateral con los **flujos principales funcionando** sobre datos mockeados y el resto del
  producto visible como módulos **"en construcción"** típicos del rubro.
- Dashboard temático con la paleta del cliente, panel de demo con escenarios guiados y
  restablecimiento de datos.
- Firebase (Auth + Firestore, plan gratuito) para que los cambios se compartan; si Firebase
  no está o falla, la demo sigue con datos locales.
- Entregables: link, `manual-usuario.md` y `flujos-funcionales.md`.

Reemplaza el prompt "CREADOR DE POCs". Referencia de calidad: la POC de
[Atlas Confirming](https://marianaybanezintive-cmd.github.io/atlas-confirming-poc/).

## Cómo usarlo

**Primera vez:** pedile al agente una POC; si no tenés repo y Firebase, te devuelve la guía
de setup (≈ 10 minutos, gratis) y espera tus datos.

> Usá el skill po-poc-builder. Cliente: Seguros Andes (seguros de autos, Chile). Paleta:
> #0B3D91, #00A3E0. Producto: gestión de siniestros con IA que estima el daño por fotos.
> Flujos principales: denuncia de siniestro, evaluación con IA, aprobación del liquidador.
> Roles: asegurado, liquidador, supervisor. Repo: https://github.com/<usuario>/andes-siniestros-poc
> Firebase: { ...firebaseConfig... }

El agente arma un brief (único punto de confirmación), construye, valida, publica y te
devuelve el link. Para iterar: *"en la POC de Seguros Andes agregá el flujo de reintegro"*.

## Salidas

| Dónde | Qué |
|-------|-----|
| `https://<usuario>.github.io/<repo>/` | POC publicada |
| Repo de la POC (`config.json → workspace_root`) | Código, `poc-config.json`, `data/seed.json`, `docs/` |
| `AI-Outputs/po-poc-builder/{slug}/` | `poc-brief.md`, `manual-usuario.md`, `flujos-funcionales.md`, `validacion.md` |

## Estructura

| Archivo | Para qué |
|---------|----------|
| `SKILL.md` | Rol, reglas duras y flujo de 8 pasos |
| `config.json` | Carpeta de trabajo local, contraseña común de prueba, espera de Pages |
| `references/setup-github-firebase.md` | Guía de setup para el usuario + diagnóstico de errores |
| `references/poc-brief-template.md` | Criterio SR PO/BA y estructura del brief |
| `references/rubro-catalog.md` | Módulos "en construcción" e IA típica por rubro |
| `references/poc-architecture.md` | Stack, contratos de vistas/datos, patrones UX, versionado, IA simulada |
| `references/poc-config.example.json` | Ejemplo completo de configuración (Atlas Confirming) |
| `references/docs-templates.md` | Plantillas del manual de uso y de flujos funcionales |
| `templates/` | Núcleo de la POC: `index.html`, CSS y `js/core` (login, router, UI, datos) |
| `scripts/scaffold_poc.py` | Genera tema, config y esqueletos desde `poc-config.json` |
| `scripts/seed_firebase.py` | Crea usuarios en Firebase Auth y carga la semilla en Firestore (solo API web pública) |
| `scripts/validate_poc.py` | Valida estructura, vistas, semilla, referencias, sintaxis JS, secretos y el sitio publicado |

Dependencias: Python 3.10+ (solo biblioteca estándar), Git con permisos de push al repo de
la POC; Node opcional (chequeo de sintaxis JS).

## Mantenimiento del núcleo

Las mejoras transversales (componentes, estilos, resiliencia) se hacen en `templates/` y
llegan a cada POC al re-correr `scaffold_poc.py` en una iteración. No editar `js/core/` en
los repos de las POCs.
