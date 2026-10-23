"""Genera o actualiza la estructura de una POC a partir de poc-config.json.

Uso:
    python scaffold_poc.py --config <poc-config.json> --out <carpeta-del-repo-poc>

Siempre (re)escribe: núcleo JS, styles.css, index.html, css/theme.css, js/poc-config.js,
js/views/index.js y README.md. Nunca pisa: js/views/<vista>.js, data/seed.json, docs/.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import quote_plus

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = ROOT / "templates"

DEFAULT_PALETTE = {
    "primary": "#1E3A8A", "secondary": "#0EA5E9", "accent": "#F59E0B",
    "background": "#F4F6FA", "surface": "#FFFFFF", "text": "#1F2937", "muted": "#6B7280",
    "border": "#E5E7EB", "success": "#16A34A", "warning": "#D97706", "danger": "#DC2626",
    "info": "#2563EB", "sidebar": None, "sidebarText": None,
}
HEX = re.compile(r"^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
VIEW_ID = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def fail(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    rgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast_text(bg: str) -> str:
    return "#FFFFFF" if luminance(bg) < 0.45 else "#111827"


def validate(cfg: dict) -> list[str]:
    errors = []
    if not SLUG.match(str(cfg.get("slug", ""))):
        errors.append("slug obligatorio, en minúsculas con guiones (ej. atlas-confirming)")
    app = cfg.get("app") or {}
    for k in ("name", "client"):
        if not app.get(k):
            errors.append(f"app.{k} obligatorio")
    for k, v in (cfg.get("palette") or {}).items():
        if v and not HEX.match(str(v)):
            errors.append(f"palette.{k} debe ser hex (#RRGGBB): {v}")
    roles = cfg.get("roles") or []
    role_ids = {r.get("id") for r in roles}
    if not roles:
        errors.append("roles: al menos uno")
    if not any("*" in (r.get("permissions") or []) for r in roles):
        errors.append("roles: al menos un rol con permissions ['*'] (administrador)")
    users = cfg.get("users") or []
    if not users:
        errors.append("users: al menos un usuario de prueba")
    for u in users:
        for k in ("email", "password", "name", "role"):
            if not u.get(k):
                errors.append(f"users[{u.get('email', '?')}].{k} obligatorio")
        if u.get("role") and u["role"] not in role_ids:
            errors.append(f"users[{u.get('email')}].role '{u['role']}' no existe en roles")
        if u.get("password") and len(u["password"]) < 6:
            errors.append(f"users[{u.get('email')}].password: mínimo 6 caracteres (Firebase Auth)")
    menu = cfg.get("menu") or []
    ids = [m.get("id") for m in menu]
    if len(ids) != len(set(ids)):
        errors.append("menu: ids duplicados")
    for m in menu:
        if not m.get("id") or not VIEW_ID.match(m["id"]) or not m.get("label"):
            errors.append(f"menu: cada ítem necesita id (minúsculas/guiones) y label: {m}")
        kinds = [bool(m.get("view")), m.get("status") == "construction", bool(m.get("href"))]
        if sum(kinds) != 1:
            errors.append(f"menu[{m.get('id')}]: debe tener exactamente uno de view | status:'construction' | href")
        if m.get("view") and not VIEW_ID.match(m["view"]):
            errors.append(f"menu[{m.get('id')}].view inválido: {m['view']}")
        for r in m.get("roles") or []:
            if r != "*" and r not in role_ids:
                errors.append(f"menu[{m.get('id')}].roles: '{r}' no existe en roles")
    if not any(m.get("view") for m in menu):
        errors.append("menu: al menos una vista funcional (view)")
    fb = cfg.get("firebase") or {}
    if fb and any("<" in str(v) for v in fb.values()):
        errors.append("firebase: reemplazá los valores de ejemplo por la configuración real, o poné firebase: null")
    return errors


def fonts_url(fonts: dict) -> str:
    fams = []
    for f in dict.fromkeys([fonts["heading"], fonts["body"]]):
        fams.append(f"family={quote_plus(f)}:wght@400;500;600;700")
    return "https://fonts.googleapis.com/css2?" + "&".join(fams) + "&display=swap"


def theme_css(palette: dict, fonts: dict, radius: int) -> str:
    p = {**DEFAULT_PALETTE, **{k: v for k, v in palette.items() if v}}
    p["sidebar"] = p["sidebar"] or "#0F172A"
    p["sidebarText"] = p["sidebarText"] or contrast_text(p["sidebar"])
    names = {
        "primary": "--c-primary", "secondary": "--c-secondary", "accent": "--c-accent",
        "background": "--c-bg", "surface": "--c-surface", "text": "--c-text", "muted": "--c-muted",
        "border": "--c-border", "success": "--c-success", "warning": "--c-warning",
        "danger": "--c-danger", "info": "--c-info", "sidebar": "--c-sidebar", "sidebarText": "--c-sidebar-text",
    }
    lines = [f"    {var}: {p[key]};" for key, var in names.items()]
    lines += [
        f"    --c-primary-contrast: {contrast_text(p['primary'])};",
        "    --c-primary-soft: color-mix(in srgb, var(--c-primary) 12%, white);",
        f"    --font-heading: '{fonts['heading']}';",
        f"    --font-body: '{fonts['body']}';",
        f"    --radius: {radius}px;",
        "    --shadow: 0 10px 30px rgba(15, 23, 42, .08);",
    ]
    return "/* Generado por scaffold_poc.py desde poc-config.json: no editar a mano. */\n:root {\n" + "\n".join(lines) + "\n}\n"


def pages_url(cfg: dict) -> str:
    deploy = cfg.get("deploy") or {}
    if deploy.get("pagesUrl"):
        return deploy["pagesUrl"].rstrip("/") + "/"
    m = re.match(r"https://github\.com/([^/]+)/([^/.]+)", deploy.get("repoUrl", ""))
    return f"https://{m.group(1).lower()}.github.io/{m.group(2)}/" if m else ""


def docs_url(cfg: dict) -> str:
    if cfg["app"].get("docsUrl"):
        return cfg["app"]["docsUrl"]
    deploy = cfg.get("deploy") or {}
    repo = deploy.get("repoUrl", "").rstrip("/").removesuffix(".git")
    return f"{repo}/blob/{deploy.get('branch', 'main')}/docs/manual-usuario.md" if repo else ""


VIEW_STUB = """// Vista "{label}". Reemplazar este esqueleto por el flujo real (ver poc-architecture.md §4).
import {{ registerView }} from '../core/registry.js';

registerView('{view}', {{
    async render(el, {{ ui }}) {{
        el.innerHTML = `${{ui.pageHeader('{label}', 'Vista pendiente de implementar')}}
            <div class="card">${{ui.emptyState('Vista en preparación', 'El agente todavía no generó esta vista.', 'ph-hammer')}}</div>`;
    }},
}});
"""


def readme(cfg: dict, url: str) -> str:
    app = cfg["app"]
    roles = {r["id"]: r.get("label", r["id"]) for r in cfg["roles"]}
    rows = "\n".join(f"| {u['name']} | {roles.get(u['role'], u['role'])} | `{u['email']}` | `{u['password']}` |" for u in cfg["users"])
    return f"""# {app['name']} — POC {app.get('version', 'v1.0.0')}

Prueba de concepto para **{app['client']}**{f" ({app['industry']})" if app.get('industry') else ''}. Datos 100 % ficticios.

**Abrir la POC:** {url or '(configurar deploy.repoUrl en poc-config.json)'}

## Usuarios de prueba

| Nombre | Rol | Usuario | Contraseña |
|--------|-----|---------|------------|
{rows}

También podés usar **Ingresar en modo demo** en la pantalla de login.

## Documentación

- [Manual de uso](docs/manual-usuario.md)
- [Flujos funcionales](docs/flujos-funcionales.md)

## Vista previa local (opcional, solo equipo técnico)

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080`. Sin servidor (doble clic en `index.html`) no funciona porque usa módulos ES.
"""


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    cfg = json.loads(args.config.read_text(encoding="utf-8-sig"))
    errors = validate(cfg)
    if errors:
        fail("poc-config.json inválido:\n  - " + "\n  - ".join(errors))

    out: Path = args.out
    out.mkdir(parents=True, exist_ok=True)
    fonts = {"heading": "Montserrat", "body": "Open Sans", **(cfg.get("fonts") or {})}
    cfg["app"].setdefault("version", "v1.0.0")
    cfg["app"]["docsUrl"] = docs_url(cfg)
    url = pages_url(cfg)

    shutil.copytree(TEMPLATES / "js" / "core", out / "js" / "core", dirs_exist_ok=True)
    (out / "css").mkdir(exist_ok=True)
    shutil.copy2(TEMPLATES / "css" / "styles.css", out / "css" / "styles.css")
    if not (out / "firestore.rules").exists():
        shutil.copy2(TEMPLATES / "firestore.rules", out / "firestore.rules")
    (out / ".nojekyll").touch()

    html = (TEMPLATES / "index.html").read_text(encoding="utf-8-sig")
    html = (html.replace("{{APP_NAME}}", cfg["app"]["name"]).replace("{{CLIENT}}", cfg["app"]["client"])
            .replace("{{FONTS_URL}}", fonts_url(fonts)))
    (out / "index.html").write_text(html, encoding="utf-8")
    (out / "css" / "theme.css").write_text(theme_css(cfg.get("palette") or {}, fonts, int(cfg.get("radius", 10))), encoding="utf-8")

    public_cfg = {k: v for k, v in cfg.items() if k != "deploy"}
    (out / "js" / "poc-config.js").write_text(
        "// Generado por scaffold_poc.py desde poc-config.json: editar el JSON y regenerar.\n"
        f"export const POC_CONFIG = {json.dumps(public_cfg, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    (out / "poc-config.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    views_dir = out / "js" / "views"
    views_dir.mkdir(parents=True, exist_ok=True)
    view_ids = list(dict.fromkeys(m["view"] for m in cfg["menu"] if m.get("view")))
    created = []
    for m in cfg["menu"]:
        if m.get("view") and not (views_dir / f"{m['view']}.js").exists():
            (views_dir / f"{m['view']}.js").write_text(VIEW_STUB.format(view=m["view"], label=m["label"].replace("'", "\\'")), encoding="utf-8")
            created.append(m["view"])
    (views_dir / "index.js").write_text(
        "// Generado por scaffold_poc.py: importa cada vista funcional del menú.\n"
        + "".join(f"import './{v}.js';\n" for v in view_ids),
        encoding="utf-8",
    )

    (out / "data").mkdir(exist_ok=True)
    if not (out / "data" / "seed.json").exists():
        (out / "data" / "seed.json").write_text('{\n  "collections": {}\n}\n', encoding="utf-8")
    (out / "docs").mkdir(exist_ok=True)
    (out / "README.md").write_text(readme(cfg, url), encoding="utf-8")

    construction = sum(1 for m in cfg["menu"] if m.get("status") == "construction")
    print(f"OK scaffold en {out}")
    print(f"  vistas funcionales: {len(view_ids)} ({', '.join(view_ids)})")
    print(f"  esqueletos nuevos: {len(created)} ({', '.join(created) or '-'})")
    print(f"  ítems en construcción: {construction}")
    print(f"  usuarios: {len(cfg['users'])} | roles: {len(cfg['roles'])} | firebase: {'sí' if (cfg.get('firebase') or {}).get('apiKey') else 'no (modo local)'}")
    print(f"  URL esperada: {url or '-'}")


if __name__ == "__main__":
    main()
