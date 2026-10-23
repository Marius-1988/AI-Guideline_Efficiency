"""Valida una POC antes de publicarla y, opcionalmente, el sitio ya publicado.

Uso:
    python validate_poc.py --repo <carpeta-del-repo-poc> [--stage build|final] [--url <pages-url>] [--report <archivo.md>]

--stage final exige además docs/manual-usuario.md y docs/flujos-funcionales.md.
--url verifica que GitHub Pages sirva la versión local (HTTP 200 + versión coincidente).
Imprime PASS/FAIL con conteos; el detalle va al reporte si se indica --report.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

REQUIRED = ["index.html", ".nojekyll", "poc-config.json", "css/theme.css", "css/styles.css", "js/poc-config.js",
            "js/core/app.js", "js/core/auth.js", "js/core/data-service.js", "js/core/registry.js", "js/core/ui.js",
            "js/views/index.js", "data/seed.json"]
DOCS = ["docs/manual-usuario.md", "docs/flujos-funcionales.md"]
FORBIDDEN = [
    (re.compile(r"[A-Za-z]:\\\\?(Users|Documents|Downloads)"), "ruta absoluta de Windows"),
    (re.compile(r"/Users/[a-z]"), "ruta absoluta de macOS"),
    (re.compile(r"file:///"), "URL file://"),
    (re.compile(r'"private_key"\s*:'), "clave privada de cuenta de servicio"),
    (re.compile(r"ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}"), "token de GitHub"),
]
STUB_MARK = "Vista pendiente de implementar"


class Report:
    def __init__(self):
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.info: list[str] = []

    def err(self, m): self.errors.append(m)
    def warn(self, m): self.warnings.append(m)
    def ok(self, m): self.info.append(m)


def check_structure(repo: Path, stage: str, r: Report) -> None:
    for f in REQUIRED + (DOCS if stage == "final" else []):
        if not (repo / f).exists():
            r.err(f"falta {f}")
    for f in repo.rglob("*"):
        if f.name in (".env", "credentials.json") or f.name.endswith("-firebase-adminsdk.json"):
            r.err(f"archivo sensible en el repo: {f.relative_to(repo)}")


def check_config(repo: Path, r: Report) -> dict:
    try:
        cfg = json.loads((repo / "poc-config.json").read_text(encoding="utf-8-sig"))
    except Exception as e:  # noqa: BLE001
        r.err(f"poc-config.json ilegible: {e}")
        return {}
    menu = cfg.get("menu", [])
    functional = [m for m in menu if m.get("view")]
    construction = [m for m in menu if m.get("status") == "construction"]
    if len(construction) < 4:
        r.warn(f"solo {len(construction)} ítems en construcción: sumá opciones del rubro para dar sensación de producto completo (mín. 4)")
    for m in construction:
        if not m.get("upcoming"):
            r.warn(f"menu[{m['id']}] en construcción sin 'upcoming' (lista de lo que vendrá)")
    views_dir = repo / "js" / "views"
    for m in functional:
        f = views_dir / f"{m['view']}.js"
        if not f.exists():
            r.err(f"falta la vista js/views/{m['view']}.js")
            continue
        src = f.read_text(encoding="utf-8-sig")
        if f"registerView('{m['view']}'" not in src and f'registerView("{m["view"]}"' not in src:
            r.err(f"js/views/{m['view']}.js no registra registerView('{m['view']}')")
        if STUB_MARK in src:
            r.err(f"js/views/{m['view']}.js sigue siendo el esqueleto del scaffold")
    if not (cfg.get("firebase") or {}).get("apiKey"):
        r.warn("sin firebase en poc-config.json: la POC corre en modo local (los cambios no se comparten entre usuarios)")
    if not (cfg.get("demo") or {}).get("scenarios"):
        r.warn("sin demo.scenarios: agregá escenarios guiados para los flujos principales")
    r.ok(f"menú: {len(functional)} funcionales, {len(construction)} en construcción; usuarios: {len(cfg.get('users', []))}; roles: {len(cfg.get('roles', []))}")
    return cfg


def check_seed(repo: Path, r: Report) -> None:
    try:
        seed = json.loads((repo / "data" / "seed.json").read_text(encoding="utf-8-sig")).get("collections", {})
    except Exception as e:  # noqa: BLE001
        r.err(f"data/seed.json inválido: {e}")
        return
    if not seed:
        r.err("data/seed.json no tiene colecciones")
    total = 0
    for col, rows in seed.items():
        ids = [str(x.get("id", "")) for x in rows]
        if any(not i or "/" in i for i in ids):
            r.err(f"seed[{col}]: hay documentos sin id o con '/'")
        if len(ids) != len(set(ids)):
            r.err(f"seed[{col}]: ids duplicados")
        if len(rows) < 5:
            r.warn(f"seed[{col}]: {len(rows)} registros (recomendado ≥ 8 para que listados y gráficos se vean reales)")
        total += len(rows)
    views_src = " ".join(p.read_text(encoding="utf-8-sig") for p in (repo / "js" / "views").glob("*.js"))
    for col in seed:
        if f"'{col}'" not in views_src and f'"{col}"' not in views_src:
            r.warn(f"la colección '{col}' no se usa en ninguna vista")
    r.ok(f"seed: {len(seed)} colecciones, {total} registros")


def check_refs(repo: Path, r: Report) -> None:
    html = (repo / "index.html").read_text(encoding="utf-8-sig") if (repo / "index.html").exists() else ""
    for ref in re.findall(r'(?:src|href)="([^"#]+)"', html):
        if not ref.startswith(("http", "//", "mailto:")) and not (repo / ref).exists():
            r.err(f"index.html referencia un archivo inexistente: {ref}")
        if ref.startswith("/") and not ref.startswith("//"):
            r.err(f"ruta absoluta '{ref}' rompe GitHub Pages (usar rutas relativas)")
    for js in (repo / "js").rglob("*.js"):
        for imp in re.findall(r"""(?:import\s+(?:[^'"]+from\s+)?|import\()\s*['"](\.[^'"]+)['"]""", js.read_text(encoding="utf-8-sig")):
            if not (js.parent / imp).resolve().exists():
                r.err(f"{js.relative_to(repo)} importa un archivo inexistente: {imp}")


def check_forbidden(repo: Path, r: Report) -> None:
    for f in repo.rglob("*"):
        if f.is_dir() or ".git" in f.parts or f.suffix not in (".js", ".html", ".css", ".json", ".md"):
            continue
        text = f.read_text(encoding="utf-8-sig", errors="ignore")
        for pat, what in FORBIDDEN:
            if pat.search(text):
                r.err(f"{what} en {f.relative_to(repo)}")


def check_syntax(repo: Path, r: Report) -> None:
    node = shutil.which("node")
    if not node:
        r.warn("node no disponible: se omite el chequeo de sintaxis JS")
        return
    with tempfile.TemporaryDirectory() as tmp:
        for js in (repo / "js").rglob("*.js"):
            target = Path(tmp) / (js.stem + ".mjs")
            shutil.copy2(js, target)
            res = subprocess.run([node, "--check", str(target)], capture_output=True, text=True)
            if res.returncode != 0:
                msg = (res.stderr.strip().splitlines() or ["error"])
                r.err(f"sintaxis JS en {js.relative_to(repo)}: {next((l for l in msg if 'Error' in l), msg[0])}")


def check_url(repo: Path, url: str, r: Report, wait: int) -> None:
    url = url.rstrip("/") + "/"
    cfg = json.loads((repo / "poc-config.json").read_text(encoding="utf-8-sig"))
    version = cfg.get("app", {}).get("version", "")
    deadline = time.time() + wait
    last = ""
    while True:
        try:
            with urllib.request.urlopen(url + f"js/poc-config.js?t={int(time.time())}", timeout=20) as res:
                body = res.read().decode("utf-8", "ignore")
            with urllib.request.urlopen(url, timeout=20) as res:
                html = res.read().decode("utf-8", "ignore")
            if f'"version": "{version}"' in body and cfg["app"]["name"] in html:
                r.ok(f"publicado OK: {url} sirve {version}")
                return
            last = "el sitio responde pero todavía sirve otra versión"
        except Exception as e:  # noqa: BLE001
            last = f"no responde ({e})"
        if time.time() > deadline:
            r.err(f"{url}: {last}. Verificá Settings > Pages (rama y carpeta raíz) y el estado de Actions.")
            return
        time.sleep(15)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", required=True, type=Path)
    ap.add_argument("--stage", choices=["build", "final"], default="build")
    ap.add_argument("--url")
    ap.add_argument("--wait", type=int, default=300, help="segundos máximos esperando el deploy de Pages")
    ap.add_argument("--report", type=Path)
    args = ap.parse_args()

    r = Report()
    check_structure(args.repo, args.stage, r)
    if not r.errors:
        check_config(args.repo, r)
        check_seed(args.repo, r)
        check_refs(args.repo, r)
        check_forbidden(args.repo, r)
        check_syntax(args.repo, r)
        if args.url:
            check_url(args.repo, args.url, r, args.wait)

    status = "PASS" if not r.errors else "FAIL"
    if args.report:
        lines = [f"# Validación POC — {status}", "", f"Repo: `{args.repo}` · stage: {args.stage}", ""]
        for title, items in (("Errores", r.errors), ("Advertencias", r.warnings), ("Resumen", r.info)):
            lines += [f"## {title} ({len(items)})", ""] + [f"- {i}" for i in items] + [""]
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text("\n".join(lines), encoding="utf-8")
    print(f"{status} - errores: {len(r.errors)}, advertencias: {len(r.warnings)}")
    for i in r.info:
        print(f"  {i}")
    for e in r.errors:
        print(f"  ERROR: {e}")
    if not args.report:
        for w in r.warnings:
            print(f"  WARN: {w}")
    sys.exit(0 if not r.errors else 1)


if __name__ == "__main__":
    main()
