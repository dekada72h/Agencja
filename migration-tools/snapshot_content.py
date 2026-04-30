#!/usr/bin/env python3
"""
Batch 0 — Content snapshot for Dekada72H Next.js migration.

Walks every .html file in the project, extracts a normalized content fingerprint
(text blocks, headings, link texts, image alts, meta tags, JSON-LD schema),
plus the translations.js i18n keys. Writes content-snapshot.json.

Run after every batch and diff against this baseline to prove zero content loss.

Usage:
    python3 migration-tools/snapshot_content.py
    python3 migration-tools/snapshot_content.py --diff content-snapshot.json
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"node_modules", ".git", ".next", "out", "migration-tools", ".claude"}
INLINE_TAGS = {"a", "em", "strong", "i", "b", "span", "code", "small", "sup", "sub", "u", "mark"}
SKIP_TAGS = {"script", "style", "noscript", "template"}


def collapse_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


class ContentExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.headings: list[dict] = []
        self.paragraphs: list[str] = []
        self.list_items: list[str] = []
        self.link_texts: list[dict] = []
        self.image_alts: list[dict] = []
        self.meta: dict[str, str] = {}
        self.title: str = ""
        self.json_ld: list[dict] = []
        self.button_texts: list[str] = []
        self.blockquotes: list[str] = []

        self._stack: list[tuple[str, dict]] = []
        self._buf: list[str] = []
        self._capture_depth = 0
        self._capture_tag: str | None = None
        self._skip_depth = 0
        self._in_title = False
        self._in_json_ld = False
        self._json_ld_buf: list[str] = []

    # ── helpers ──────────────────────────────────────
    def _attr(self, attrs, key):
        for k, v in attrs:
            if k == key:
                return v or ""
        return None

    def _start_capture(self, tag: str):
        self._capture_tag = tag
        self._capture_depth = 1
        self._buf = []

    def _flush_capture(self):
        text = collapse_ws("".join(self._buf))
        tag = self._capture_tag
        self._capture_tag = None
        self._capture_depth = 0
        self._buf = []
        return tag, text

    # ── parser hooks ─────────────────────────────────
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self._stack.append((tag, a))

        if tag in SKIP_TAGS and not (tag == "script" and a.get("type") == "application/ld+json"):
            self._skip_depth += 1
            return
        if tag == "script" and a.get("type") == "application/ld+json":
            self._in_json_ld = True
            self._json_ld_buf = []
            return

        if self._skip_depth:
            return

        if tag == "title":
            self._in_title = True
            self._buf = []
            return

        if tag == "meta":
            name = a.get("name") or a.get("property") or ""
            content = a.get("content") or ""
            if name and content:
                self.meta[name.lower()] = content
            return

        if tag == "img":
            self.image_alts.append({
                "src": a.get("src", ""),
                "alt": a.get("alt", ""),
            })
            return

        if self._capture_tag is not None:
            if tag == self._capture_tag:
                self._capture_depth += 1
            elif tag in INLINE_TAGS:
                pass  # absorb inline text
            return

        if tag in {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "button", "a"}:
            self._start_capture(tag)
            self._current_attrs = a

    def handle_endtag(self, tag):
        if self._stack:
            for i in range(len(self._stack) - 1, -1, -1):
                if self._stack[i][0] == tag:
                    del self._stack[i:]
                    break

        if tag in SKIP_TAGS and self._skip_depth:
            self._skip_depth -= 1
            return
        if self._in_json_ld and tag == "script":
            raw = "".join(self._json_ld_buf).strip()
            self._in_json_ld = False
            self._json_ld_buf = []
            if raw:
                try:
                    parsed = json.loads(raw)
                    self.json_ld.append(parsed)
                except json.JSONDecodeError:
                    self.json_ld.append({"_unparsed": raw[:500]})
            return

        if self._skip_depth:
            return

        if tag == "title" and self._in_title:
            self.title = collapse_ws("".join(self._buf))
            self._in_title = False
            self._buf = []
            return

        if self._capture_tag and tag == self._capture_tag:
            self._capture_depth -= 1
            if self._capture_depth == 0:
                ct, text = self._flush_capture()
                if not text:
                    return
                if ct in {"h1", "h2", "h3", "h4", "h5", "h6"}:
                    self.headings.append({"level": int(ct[1]), "text": text})
                elif ct == "p":
                    self.paragraphs.append(text)
                elif ct == "li":
                    self.list_items.append(text)
                elif ct == "blockquote":
                    self.blockquotes.append(text)
                elif ct == "button":
                    self.button_texts.append(text)
                elif ct == "a":
                    href = (self._current_attrs or {}).get("href", "")
                    self.link_texts.append({"href": href, "text": text})

    def handle_data(self, data):
        if self._in_json_ld:
            self._json_ld_buf.append(data)
            return
        if self._skip_depth:
            return
        if self._in_title or self._capture_tag is not None:
            self._buf.append(data)


def fingerprint_html(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8", errors="replace")
    p = ContentExtractor()
    p.feed(raw)
    p.close()

    return {
        "path": str(path.relative_to(ROOT)),
        "bytes": len(raw.encode("utf-8")),
        "title": p.title,
        "meta": p.meta,
        "headings": p.headings,
        "paragraphs": p.paragraphs,
        "list_items": p.list_items,
        "blockquotes": p.blockquotes,
        "button_texts": p.button_texts,
        "links": p.link_texts,
        "images": p.image_alts,
        "json_ld_count": len(p.json_ld),
        "json_ld": p.json_ld,
        "counts": {
            "headings": len(p.headings),
            "paragraphs": len(p.paragraphs),
            "list_items": len(p.list_items),
            "links": len(p.link_texts),
            "images": len(p.image_alts),
        },
    }


def extract_translations() -> dict:
    """Pull i18n keys from js/translations.js — both PL and DE objects."""
    f = ROOT / "js" / "translations.js"
    if not f.exists():
        return {}
    raw = f.read_text(encoding="utf-8")
    # top-level translation keys live as: "key.path": { pl: ..., en: ..., de: ... }
    keys = re.findall(r'^\s*"([a-zA-Z0-9_.\-]+)"\s*:\s*\{', raw, flags=re.MULTILINE)
    has_pl = bool(re.search(r"\bpl\s*:\s*[\"'`]", raw))
    has_en = bool(re.search(r"\ben\s*:\s*[\"'`]", raw))
    has_de = bool(re.search(r"\bde\s*:\s*[\"'`]", raw))
    return {
        "file": "js/translations.js",
        "bytes": len(raw.encode("utf-8")),
        "has_pl": has_pl,
        "has_en": has_en,
        "has_de": has_de,
        "key_count": len(keys),
        "unique_keys": sorted(set(keys)),
        "sha256": hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16],
    }


def find_html_files() -> list[Path]:
    files = []
    for p in ROOT.rglob("*.html"):
        rel = p.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        files.append(p)
    return sorted(files)


def build_snapshot() -> dict:
    files = find_html_files()
    pages = [fingerprint_html(f) for f in files]
    by_dir: dict[str, int] = {}
    for p in pages:
        d = str(Path(p["path"]).parent) or "."
        by_dir[d] = by_dir.get(d, 0) + 1
    return {
        "version": 1,
        "root": str(ROOT),
        "file_count": len(pages),
        "by_dir": dict(sorted(by_dir.items())),
        "totals": {
            "headings": sum(p["counts"]["headings"] for p in pages),
            "paragraphs": sum(p["counts"]["paragraphs"] for p in pages),
            "list_items": sum(p["counts"]["list_items"] for p in pages),
            "links": sum(p["counts"]["links"] for p in pages),
            "images": sum(p["counts"]["images"] for p in pages),
            "json_ld_blocks": sum(p["json_ld_count"] for p in pages),
        },
        "translations": extract_translations(),
        "pages": pages,
    }


def diff_snapshots(baseline: dict, current: dict) -> int:
    """Return non-zero exit code on regression. Stdout is human-readable."""
    losses = 0
    base_pages = {p["path"]: p for p in baseline["pages"]}
    cur_pages = {p["path"]: p for p in current["pages"]}

    print(f"Files baseline={baseline['file_count']} current={current['file_count']}")
    missing = set(base_pages) - set(cur_pages)
    if missing:
        print(f"  MISSING {len(missing)} pages from baseline:")
        for m in sorted(missing):
            print(f"    - {m}")
        losses += len(missing)

    fields = ["headings", "paragraphs", "list_items", "links", "images"]
    for path, base in base_pages.items():
        cur = cur_pages.get(path)
        if not cur:
            continue
        for f in fields:
            b, c = base["counts"][f], cur["counts"][f]
            if c < b:
                print(f"  REGRESSION {path}: {f} {b} -> {c}")
                losses += 1

    bt = baseline["translations"].get("key_count", 0)
    ct = current["translations"].get("key_count", 0)
    if ct < bt:
        print(f"  TRANSLATIONS dropped {bt - ct} keys ({bt} -> {ct})")
        losses += 1

    if losses == 0:
        print("OK — no content regressions detected.")
    return 0 if losses == 0 else 1


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--diff", metavar="BASELINE.json",
                    help="diff current snapshot against baseline file")
    ap.add_argument("--out", default="content-snapshot.json")
    args = ap.parse_args()

    snapshot = build_snapshot()

    if args.diff:
        baseline = json.loads(Path(args.diff).read_text(encoding="utf-8"))
        return diff_snapshots(baseline, snapshot)

    out_path = ROOT / args.out
    out_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    t = snapshot["totals"]
    print(f"Wrote {out_path.relative_to(ROOT)}")
    print(f"  files: {snapshot['file_count']}")
    print(f"  headings: {t['headings']}  paragraphs: {t['paragraphs']}  "
          f"list_items: {t['list_items']}  links: {t['links']}  "
          f"images: {t['images']}  json-ld: {t['json_ld_blocks']}")
    tr = snapshot["translations"]
    if tr:
        print(f"  translations: {tr.get('key_count', 0)} keys, "
              f"PL={tr.get('has_pl')} EN={tr.get('has_en')} DE={tr.get('has_de')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
