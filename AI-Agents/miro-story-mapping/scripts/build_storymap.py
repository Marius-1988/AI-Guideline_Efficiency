#!/usr/bin/env python3
"""Story mapping para Miro (template references/storymap-template.md).

Uso:
  build_storymap.py parse  --md <historias.md> [--prd <prd.md>] [--doc-url URL] [--prd-url URL] --out <dir>
  build_storymap.py render --json <dir>/storymap.json [--epics COD1,COD2]
  build_storymap.py report --json <dir>/storymap.json --board-url URL [--frame-id ID]

parse  : MD de po-expert-user-stories (+ PRD opcional) -> storymap.json (editable).
render : valida que todos los grupos esten completos y genera storymap.svg (Canvas Composer).
         Exit 2 si falta informacion: completar storymap.json y re-ejecutar.
report : escribe informe.md con URL del tablero y conteos.
"""
import argparse, json, math, os, re, subprocess, sys
from urllib.parse import quote
from xml.sax.saxutils import escape

LANES = [("Must", "MUST<br>MVP 1"), ("Should", "SHOULD<br>MVP 2"), ("Could", "COULD<br>MVP 3"), ("Spike", "SPIKES")]
COLORS = {"HU": "light_green", "HT": "light_blue", "T": "gray", "S": "pink"}
LEGEND = [("HU", "Historia de usuario"), ("HT", "Historia técnica"), ("T", "Tarea técnica"), ("S", "Spike")]
PRIO = {"must": "Must", "alta": "Must", "should": "Should", "media": "Should", "could": "Could", "baja": "Could"}
SW, SH, G, PAD, EGAP = 199, 228, 20, 32, 64


def slug(h):
    return re.sub(r"[^\w\- ]", "", h.strip().lower()).replace(" ", "-")


def clean(s):
    return re.sub(r"[*`]", "", s).strip()


def section(md, num):
    m = re.search(rf"^## {num}\. .*$", md, re.M)
    if not m:
        return "", None
    n = re.search(r"^## \d+\. ", md[m.end():], re.M)
    return md[m.start(): m.end() + (n.start() if n else len(md))], m.group(0)[3:]


def git_blob_url(path):
    try:
        root = subprocess.check_output(["git", "-C", os.path.dirname(path), "rev-parse", "--show-toplevel"], text=True).strip()
        remote = subprocess.check_output(["git", "-C", root, "remote", "get-url", "origin"], text=True).strip()
        branch = subprocess.check_output(["git", "-C", root, "rev-parse", "--abbrev-ref", "HEAD"], text=True).strip()
    except Exception:
        return None
    remote = re.sub(r"^git@([^:]+):", r"https://\1/", remote).removesuffix(".git")
    rel = os.path.relpath(os.path.abspath(path), root).replace(os.sep, "/")
    return f"{remote}/blob/{branch}/{quote(rel)}"


def short(q, n=60):
    q = clean(q).strip("¿?").strip()
    return q if len(q) <= n else q[: q.rfind(" ", 0, n)] + "…"


def parse(a):
    md = open(a.md, encoding="utf-8").read()
    doc_url = a.doc_url or git_blob_url(a.md)
    warn = []
    if not doc_url:
        warn.append("Sin URL del documento: pasar --doc-url para linkear los post-its")
    link = lambda h: f"{doc_url}#{quote(slug(h), safe='-')}" if doc_url and h else ""
    h1 = re.search(r"^# (.+)$", md, re.M).group(1)
    title = clean(h1.split(" — ", 1)[-1])
    prod = re.search(r"\*\*Producto:\*\*\s*([^\n·]+)", md)
    epics, items, epic_of = {}, [], {}
    for code, name in re.findall(r"^### \d+\.\d+ Épica (\S+) — (.+)$", md, re.M):
        epics[code] = clean(name)
    for num, kind in (("6", "HU"), ("7", "HT")):
        sec, _ = section(md, num)
        for m in re.finditer(r"^### ([A-Z][A-Z0-9-]*-\d+[a-z]?) — (.+)$", sec, re.M):
            body = sec[m.end(): m.end() + 1500]
            ep = re.search(r"\*\*Épica\*\* \| ([^|\n]+)", body)
            code = clean(ep.group(1)).split(" — ")[0].split()[0] if ep else ""
            if code and code not in epics:
                epics[code] = clean(ep.group(1)).split(" — ", 1)[-1]
            pr = re.search(r"\*\*Prioridad sugerida\*\* \| ([^|\n]+)", body)
            lane = PRIO.get(clean(pr.group(1)).split()[0].lower(), "Must") if pr else "Must"
            if not pr:
                warn.append(f"{m.group(1)} sin prioridad: va a MUST")
            deps = re.search(r"\*\*Depende de\*\* \| ([^|\n]+)", body)
            items.append(dict(key=m.group(1), title=clean(m.group(2)), type=kind, epic=code, lane=lane,
                              url=link(m.group(0)[4:]), deps=deps.group(1) if deps else ""))
            epic_of[m.group(1)] = code
    codes = list(epics)
    first = codes[0] if codes else ""
    keyre = re.compile(r"\b(?:HT-)?(" + "|".join(map(re.escape, codes)) + r")(?:-\d+|\b)") if codes else None

    def epic_after(text, pos=0):
        m = keyre.search(text, pos) if keyre else None
        return m.group(1) if m else ""

    s8, h8 = section(md, 8)
    for tk, name in re.findall(r"^\|\s*\*\*(T-\d+)\*\*\s*\|[^|]*\|\s*([^|]+?)\s*\|", s8, re.M):
        ep = next((i["epic"] for i in items if re.search(rf"\b{tk}\b", i.get("deps", ""))), "")
        if not ep:
            for line in md.replace(s8, "").splitlines():
                p = line.find(tk)
                if p >= 0 and (ep := epic_after(line, p)):
                    break
        epic_of[tk] = ep or first
        items.append(dict(key=tk, title=clean(name), type="T", epic=ep or first, lane="Must", url=link(h8)))
    s9, h9 = section(md, 9)
    for row in re.findall(r"^\|\s*\*\*(S-\d+)\*\*\s*\|(.*)\|\s*$", s9, re.M):
        cols = [c.strip() for c in row[1].split("|")]
        origin, question, answer = cols[0], cols[1] if len(cols) > 1 else "", cols[-1]
        ref = re.search(r"\b(?:HT-[A-Z]+|[A-Z]+|T)-\d+\b", origin)
        ep = epic_of.get(ref.group(0)) if ref else ""
        ep = ep or epic_after(origin) or first
        t = short(question) + (" (pendiente)" if "pendiente" in answer.lower() else "")
        items.append(dict(key=row[0], title=t, type="S", epic=ep, lane="Spike", url=link(h9)))
    prd = a.prd
    if not prd:
        m = re.search(r"\]\((\.\./prd/PRD-[^)]+\.md)\)", md)
        prd = os.path.normpath(os.path.join(os.path.dirname(a.md), m.group(1))) if m else None
    mvp, objs, fuentes = "", [], [{"label": "Historias de usuario (md)", "url": doc_url or ""}]
    if prd and os.path.exists(prd):
        p = open(prd, encoding="utf-8").read()
        s1, _ = section(p, 1)
        mm = re.search(r"^\*\*(.+?)\*\*\s*$", s1, re.M)
        mvp = clean(mm.group(1)) if mm else ""
        objs = [f"{k} {clean(v)}" for k, v in re.findall(r"^\| (OBJ-\d+) \| ([^|]+) \|", p, re.M)]
        fuentes.append({"label": "PRD", "url": a.prd_url or git_blob_url(prd) or ""})
    else:
        warn.append("Sin PRD: completar 'mvp' y 'objetivos' en storymap.json desde el documento de análisis")
    for i in items:
        i.pop("deps", None)
    product = clean(prod.group(1)).split(" — ")[0].strip() if prod else title
    data = dict(title=title, subtitle="Story Mapping", product=product,
                board_name=f"{product} — Story Mapping"[:60],
                mvp=mvp, epics=[{"code": c, "name": n} for c, n in epics.items()], objetivos=objs,
                fuentes=fuentes, items=items, warnings=warn)
    os.makedirs(a.out, exist_ok=True)
    out = os.path.join(a.out, "storymap.json")
    json.dump(data, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    cnt = {k: sum(i["type"] == k for i in items) for k in COLORS}
    print(f"OK {out} | epicas={len(epics)} HU={cnt['HU']} HT={cnt['HT']} T={cnt['T']} S={cnt['S']} | avisos={len(warn)}")
    for w in warn:
        print("AVISO |", w)


def check(d):
    miss = [f"falta '{k}'" for k in ("title", "mvp") if not d.get(k)]
    miss += [f"falta '{k}' (lista vacía)" for k in ("epics", "objetivos", "fuentes", "items") if not d.get(k)]
    codes = {e["code"] for e in d.get("epics", [])}
    for e in d.get("epics", []):
        if not any(i["epic"] == e["code"] for i in d["items"]):
            miss.append(f"épica {e['code']} sin post-its")
    for i in d.get("items", []):
        if i["epic"] not in codes:
            miss.append(f"{i['key']}: épica '{i['epic']}' inexistente")
        if not i.get("url"):
            miss.append(f"{i['key']}: sin url")
        if i["lane"] not in dict(LANES) or i["type"] not in COLORS:
            miss.append(f"{i['key']}: lane/type inválido")
    miss += [f"fuente '{f['label']}' sin url" for f in d.get("fuentes", []) if not f.get("url")]
    return miss


def render(a):
    d = json.load(open(a.json, encoding="utf-8"))
    if a.epics:
        keep = a.epics.split(",")
        d["epics"] = [e for e in d["epics"] if e["code"] in keep]
        d["items"] = [i for i in d["items"] if i["epic"] in keep]
    miss = check(d)
    if miss:
        print(f"INCOMPLETO ({len(miss)})")
        for m in miss:
            print("FALTA |", m)
        sys.exit(2)
    ea = lambda s: escape(s, {'"': "&quot;"})
    order = {"HU": 0, "HT": 1, "T": 2, "S": 3}
    by = {(e["code"], ln): sorted([i for i in d["items"] if i["epic"] == e["code"] and i["lane"] == ln],
                                  key=lambda i: order[i["type"]]) for e in d["epics"] for ln, _ in LANES}
    x, cols = 64 + 220 + PAD, []
    for e in d["epics"]:
        n = min(6, max(3, math.ceil(max(len(by[(e["code"], ln)]) for ln, _ in LANES) / 3)))
        w = n * (SW + G) - G + 2 * PAD
        cols.append((e, n, x, w))
        x += w + EGAP
    fw = max(x - EGAP + 64, 2700)
    lines = 4 + len(d["epics"]) + len(d["objetivos"]) + 3 + math.ceil(len(d["mvp"]) / 130)
    ep_y = max(900, 260 + 33 * lines + 64)
    lane_y, y = {}, ep_y + 152 + PAD
    for ln, _ in LANES:
        rows = max([math.ceil(len(by[(e["code"], ln)]) / n) for e, n, _, _ in cols] + [1])
        h = rows * (SH + G) - G + 2 * PAD
        lane_y[ln], y = (y, h), y + h + PAD
    fh = y - PAD + 64
    ft = ea(f"{d['product']} · {d['subtitle']}")
    intro = (f"<b>MVP</b><br/>{ea(d['mvp'])}<br/><br/><b>Épicas</b><br/>"
             + "<br/>".join(f"{ea(e['code'])} · {ea(e['name'])}" for e in d["epics"])
             + "<br/><br/><b>Objetivos</b><br/>" + "<br/>".join(ea(o) for o in d["objetivos"])
             + "<br/><br/><b>Fuentes</b><br/>"
             + " · ".join(f'<a href="{ea(f["url"])}">{ea(f["label"])}</a>' for f in d["fuentes"]))
    L = ['<svg xmlns="http://www.w3.org/2000/svg">',
         f'<g id="sm" transform="translate(0,0)" data-frame="{ft}">',
         f'<rect data-type="frame" x="0" y="0" width="{fw}" height="{fh}" fill="#ffffff" data-title="{ft}" />',
         f'<text x="64" y="131" font-family="noto_sans" font-size="67" font-weight="bold" fill="#1a1a1a">{ea(d["title"])}</text>',
         f'<text x="64" y="215" font-family="noto_sans" font-size="33" fill="#595959">{ea(d["subtitle"])}</text>',
         f'<textArea x="64" y="260" width="1600" font-family="noto_sans" font-size="22" fill="#595959">{intro}</textArea>']
    lx = fw - 64 - (len(LEGEND) * (SW + G) - G)
    L.append(f'<text x="{lx}" y="250" font-family="noto_sans" font-size="33" font-weight="bold" fill="#1a1a1a">Referencias</text>')
    for k, (t, lab) in enumerate(LEGEND):
        L.append(f'<rect data-type="sticky" x="{lx + k * (SW + G)}" y="280" width="{SW}" height="{SH}" data-color="{COLORS[t]}" data-content="{ea(lab)}" />')
    for ln, lab in LANES:
        ly, lh = lane_y[ln]
        L.append(f'<rect x="64" y="{ly}" width="220" height="{lh}" fill="#dedaff" stroke="none" data-content="{ea("<b>" + lab + "</b>")}" data-text-color="#6631d7" data-font-family="noto_sans" data-font-size="33" />')
    for e, n, ex, ew in cols:
        L.append(f'<rect x="{ex}" y="{ep_y}" width="{ew}" height="152" fill="#8f7fee" stroke="none" data-content="{ea("<b>" + e["code"] + "</b><br>" + e["name"])}" data-text-color="#ffffff" data-font-family="noto_sans" data-font-size="33" />')
        for ln, _ in LANES:
            L.append(f'<rect x="{ex}" y="{lane_y[ln][0]}" width="{ew}" height="{lane_y[ln][1]}" fill="#f4f2fd" stroke="none" />')
    for e, n, ex, ew in cols:
        for ln, _ in LANES:
            for k, i in enumerate(by[(e["code"], ln)]):
                sx, sy = ex + PAD + (k % n) * (SW + G), lane_y[ln][0] + PAD + (k // n) * (SH + G)
                c = f'<a href="{ea(i["url"])}">{ea(i["key"])} — {ea(i["title"])}</a>'
                L.append(f'<rect id="{i["key"].lower()}" data-type="sticky" x="{sx}" y="{sy}" width="{SW}" height="{SH}" data-color="{COLORS[i["type"]]}" data-content="{ea(c)}" />')
    L += ["</g>", "</svg>"]
    svg = "\n".join(L)
    out = os.path.join(os.path.dirname(a.json), "storymap.svg")
    open(out, "w", encoding="utf-8").write(svg)
    print(f"OK {out} | post-its={len(d['items'])} | frame={fw}x{fh} | chars={len(svg)}"
          + (" | AVISO: >190000 chars, renderizar por épicas con --epics" if len(svg) > 190000 else ""))


def report(a):
    d = json.load(open(a.json, encoding="utf-8"))
    url = a.board_url + (f"?moveToWidget={a.frame_id}" if a.frame_id else "")
    rows = [f"| {e['code']} — {e['name']} | " + " | ".join(
        str(sum(i["epic"] == e["code"] and i["type"] == t for i in d["items"])) for t in COLORS) + " |" for e in d["epics"]]
    lanes = " · ".join(f"{ln}: {sum(i['lane'] == ln for i in d['items'])}" for ln, _ in LANES)
    md = [f"# Story Mapping — {d['title']}", "", f"- **Tablero:** [{d['product']}]({url})",
          f"- **Post-its:** {len(d['items'])} ({lanes})", "", "| Épica | HU | HT | Tareas | Spikes |",
          "|---|---:|---:|---:|---:|", *rows, "", "**Fuentes:** " + " · ".join(f"[{f['label']}]({f['url']})" for f in d["fuentes"])]
    if d.get("warnings"):
        md += ["", "**Avisos:**", *[f"- {w}" for w in d["warnings"]]]
    out = os.path.join(os.path.dirname(a.json), "informe.md")
    open(out, "w", encoding="utf-8").write("\n".join(md) + "\n")
    print("OK", out)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd", required=True)
    p = sp.add_parser("parse"); p.add_argument("--md", required=True); p.add_argument("--prd")
    p.add_argument("--doc-url"); p.add_argument("--prd-url"); p.add_argument("--out", required=True)
    r = sp.add_parser("render"); r.add_argument("--json", required=True); r.add_argument("--epics")
    t = sp.add_parser("report"); t.add_argument("--json", required=True); t.add_argument("--board-url", required=True)
    t.add_argument("--frame-id")
    a = ap.parse_args()
    {"parse": parse, "render": render, "report": report}[a.cmd](a)
