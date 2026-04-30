#!/usr/bin/env python3
"""
Extract js/translations.js into messages/{pl,en,de}.json for next-intl.

The source file is plain ES (not JSON) — we leverage Node to evaluate
the TRANSLATIONS object, then dump three locale files. Falls back to
a regex parser if Node is unavailable.

Output: web/messages/{pl,en,de}.json
"""
from __future__ import annotations
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "js" / "translations.js"
OUT_DIR = ROOT / "web" / "messages"
LOCALES = ("pl", "en", "de")


def via_node() -> dict[str, dict[str, str]] | None:
    """Use Node to eval the translations file — exact, handles all edge cases."""
    if not shutil.which("node"):
        return None
    src_path_js = json.dumps(str(SRC))
    script = (
        "const path = require('path');\n"
        "const fs = require('fs');\n"
        f"const src = fs.readFileSync({src_path_js}, 'utf8');\n"
        "const wrapped = src\n"
        "  .replace(/^const\\s+TRANSLATIONS\\s*=/m, 'module.exports =');\n"
        "const tmp = path.join(require('os').tmpdir(), 'translations-eval.cjs');\n"
        "fs.writeFileSync(tmp, wrapped);\n"
        "const T = require(tmp);\n"
        "process.stdout.write(JSON.stringify(T));\n"
    )
    try:
        proc = subprocess.run(
            ["node", "-e", script],
            capture_output=True, text=True, timeout=30,
        )
        if proc.returncode != 0:
            print(f"node eval failed: {proc.stderr}", file=sys.stderr)
            return None
        return json.loads(proc.stdout)
    except Exception as e:
        print(f"node fallback err: {e}", file=sys.stderr)
        return None


def via_regex() -> dict[str, dict[str, str]]:
    """Fallback regex parser. Less robust but no Node dependency."""
    raw = SRC.read_text(encoding="utf-8")
    # find every block: "key.path": { pl: "...", en: "...", de: "..." }
    # values can be multi-line strings; allow .*? non-greedy across newlines
    block_re = re.compile(
        r'"([a-zA-Z0-9_.\-]+)"\s*:\s*\{\s*'
        r'(.*?)'
        r'\}\s*[,}]',
        re.DOTALL,
    )
    val_re = re.compile(r'(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"', re.DOTALL)

    result: dict[str, dict[str, str]] = {}
    for m in block_re.finditer(raw):
        key, body = m.group(1), m.group(2)
        entry: dict[str, str] = {}
        for v in val_re.finditer(body):
            lang, val = v.group(1), v.group(2)
            if lang in LOCALES:
                entry[lang] = val.encode("utf-8").decode("unicode_escape")
        if entry:
            result[key] = entry
    return result


SELF_KEY = "_self"  # conflict-resolution: when "a.b" and "a.b.c" both exist


def nest_keys(flat: dict[str, str]) -> dict:
    """Convert flat dot-keys into nested object. When a key X is both a leaf
    string AND a parent of further keys (e.g. "form.service" + "form.service.www"),
    the leaf value moves into "form.service._self" so both can coexist."""
    root: dict = {}
    # First pass: place every key, collision-aware
    # Sort by depth ascending so shorter keys are placed first; longer paths
    # then promote conflicts to nested {_self: ...}
    for k, v in sorted(flat.items(), key=lambda kv: kv[0].count(".")):
        parts = k.split(".")
        node = root
        for p in parts[:-1]:
            existing = node.get(p)
            if isinstance(existing, str):
                # promote existing leaf into {_self: existing}
                node[p] = {SELF_KEY: existing}
            elif existing is None:
                node[p] = {}
            node = node[p]
        leaf = parts[-1]
        existing = node.get(leaf)
        if isinstance(existing, dict):
            existing[SELF_KEY] = v
        else:
            node[leaf] = v
    return root


def merge_existing(path: Path, fresh: dict) -> dict:
    """Existing skeleton messages files have a couple stub keys we may want
    to preserve if they don't conflict. Strategy: fresh wins, but if the
    existing file has a key not in fresh, keep it."""
    if not path.exists():
        return fresh
    try:
        old = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fresh

    def deep_merge(a, b):
        # b wins on conflict; missing keys from a are kept
        out = dict(a)
        for k, v in b.items():
            if k in out and isinstance(out[k], dict) and isinstance(v, dict):
                out[k] = deep_merge(out[k], v)
            else:
                out[k] = v
        return out

    return deep_merge(old, fresh)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    data = via_node()
    if data is None:
        print("Falling back to regex parser…")
        data = via_regex()

    if not data:
        print("ERROR: no translations extracted", file=sys.stderr)
        return 1

    # data: { "key.path": { pl: "...", en: "...", de: "..." }, ... }
    print(f"Extracted {len(data)} keys.")

    by_locale: dict[str, dict[str, str]] = {l: {} for l in LOCALES}
    missing: dict[str, list[str]] = {l: [] for l in LOCALES}
    for key, entry in data.items():
        for l in LOCALES:
            if l in entry and entry[l]:
                by_locale[l][key] = entry[l]
            else:
                missing[l].append(key)

    for l in LOCALES:
        nested = nest_keys(by_locale[l])
        merged = merge_existing(OUT_DIR / f"{l}.json", nested)
        out = OUT_DIR / f"{l}.json"
        out.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n",
                       encoding="utf-8")
        print(f"  {l}: {len(by_locale[l])} keys -> {out.relative_to(ROOT)}")
        if missing[l]:
            print(f"  {l} missing {len(missing[l])} keys "
                  f"(first few: {missing[l][:3]})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
