"""Crea los usuarios de prueba en Firebase Auth y carga data/seed.json en Firestore.

Uso:
    python seed_firebase.py --repo <carpeta-del-repo-poc> [--dry-run]

Solo usa la configuración web pública (apiKey) de poc-config.json: no requiere cuentas de
servicio. Requiere en la consola de Firebase: Auth Email/Password habilitado, Firestore
creado y las reglas de firestore.rules publicadas. Es idempotente (upsert).
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

AUTH = "https://identitytoolkit.googleapis.com/v1/accounts:{op}?key={key}"
FS = "https://firestore.googleapis.com/v1/projects/{pid}/databases/(default)/documents"

HINTS = {
    "CONFIGURATION_NOT_FOUND": "Habilitá Authentication > Sign-in method > Email/Password en la consola de Firebase.",
    "OPERATION_NOT_ALLOWED": "Habilitá Authentication > Sign-in method > Email/Password en la consola de Firebase.",
    "API_KEY_INVALID": "La apiKey de poc-config.json no es válida: copiá de nuevo la configuración web de la app.",
    "API key not valid": "La apiKey de poc-config.json no es válida: copiá de nuevo la configuración web de la app.",
    "PERMISSION_DENIED": "Publicá las reglas de firestore.rules (Firestore > Reglas) y verificá que el usuario admin exista.",
    "NOT_FOUND": "Creá la base Firestore (Firestore Database > Crear base de datos) en el proyecto.",
}


def post(url: str, body: dict, token: str | None = None) -> dict:
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"Content-Type": "application/json"})
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            err = json.loads(e.read() or b"{}").get("error", {})
        except json.JSONDecodeError:
            err = {}
        raise RuntimeError(f"{err.get('message', e.reason)} [{err.get('status', e.code)}]") from None


def hint(code: str) -> str:
    for k, v in HINTS.items():
        if k in code:
            return v
    return ""


def to_value(v):
    if v is None:
        return {"nullValue": None}
    if isinstance(v, bool):
        return {"booleanValue": v}
    if isinstance(v, int):
        return {"integerValue": str(v)}
    if isinstance(v, float):
        return {"doubleValue": v}
    if isinstance(v, str):
        return {"stringValue": v}
    if isinstance(v, list):
        return {"arrayValue": {"values": [to_value(x) for x in v]}}
    if isinstance(v, dict):
        return {"mapValue": {"fields": {k: to_value(x) for k, x in v.items()}}}
    return {"stringValue": str(v)}


def load_config(repo: Path) -> dict:
    cfg_file = repo / "poc-config.json"
    if not cfg_file.exists():
        sys.exit(f"ERROR: no existe {cfg_file}. Corré primero scaffold_poc.py.")
    return json.loads(cfg_file.read_text(encoding="utf-8-sig"))


def ensure_user(key: str, user: dict) -> tuple[str, str]:
    body = {"email": user["email"], "password": user["password"], "returnSecureToken": True}
    try:
        r = post(AUTH.format(op="signUp", key=key), body)
        return r["idToken"], "creado"
    except RuntimeError as e:
        if "EMAIL_EXISTS" not in str(e):
            raise
    try:
        r = post(AUTH.format(op="signInWithPassword", key=key), body)
        return r["idToken"], "existente"
    except RuntimeError as e:
        raise RuntimeError(f"{e} (el usuario ya existe con otra contraseña: borralo en Authentication > Users y reintentá)") from None


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", required=True, type=Path)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    cfg = load_config(args.repo)
    fb = cfg.get("firebase") or {}
    if not fb.get("apiKey") or not fb.get("projectId"):
        sys.exit("ERROR: poc-config.json no tiene firebase.apiKey/projectId. La POC funcionará en modo local.")
    seed = json.loads((args.repo / "data" / "seed.json").read_text(encoding="utf-8-sig")).get("collections", {})

    admin_roles = {r["id"] for r in cfg["roles"] if "*" in r.get("permissions", [])}
    docs = [(col, row) for col, rows in seed.items() for row in rows]
    bad = [f"{c}/{r.get('id')}" for c, r in docs if not r.get("id") or "/" in str(r["id"])]
    if bad:
        sys.exit(f"ERROR: documentos sin id o con '/': {', '.join(bad[:10])}")

    print(f"Proyecto: {fb['projectId']} | usuarios: {len(cfg['users'])} | colecciones: {len(seed)} | documentos: {len(docs)}")
    if args.dry_run:
        print("DRY-RUN: no se escribió nada.")
        return

    admin_token = None
    for u in cfg["users"]:
        try:
            token, state = ensure_user(fb["apiKey"], u)
        except RuntimeError as e:
            sys.exit(f"ERROR usuario {u['email']}: {e}\n{hint(str(e))}")
        print(f"  usuario {u['email']}: {state}")
        if u["role"] in admin_roles and not admin_token:
            admin_token = token
    if not admin_token:
        sys.exit("ERROR: ningún usuario tiene rol administrador ('*').")

    base = FS.format(pid=fb["projectId"])
    writes = [{"update": {"name": f"projects/{fb['projectId']}/databases/(default)/documents/{col}/{row['id']}",
                          "fields": {k: to_value(v) for k, v in row.items() if k != "id"}}} for col, row in docs]
    for i in range(0, len(writes), 400):
        try:
            post(f"{base}:commit", {"writes": writes[i:i + 400]}, admin_token)
        except RuntimeError as e:
            sys.exit(f"ERROR escribiendo en Firestore: {e}\n{hint(str(e))}")
    print(f"OK: {len(cfg['users'])} usuarios y {len(docs)} documentos en {len(seed)} colecciones.")


if __name__ == "__main__":
    main()
