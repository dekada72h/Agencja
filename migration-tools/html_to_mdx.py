#!/usr/bin/env python3
"""
Convert blog/*.html to web/content/blog/*.mdx.

Pipeline:
  1. Parse <head>: extract title, description, OG/Twitter, canonical, keywords
  2. Parse <script type="application/ld+json"> blocks: capture Article + FAQ
     schemas verbatim into frontmatter (rendered server-side from there)
  3. Locate <article class="blog-article"> and walk its DOM, converting
     each tag to MDX. Custom HTML structures map to JSX components:
       div.stat-highlight        -> <StatHighlight items=[…]/>
       div.info-box | warning    -> <Callout variant="…">…</Callout>
       table.comparison-table    -> <ComparisonTable …/>  (preserved as table)
       div.related-posts         -> dropped, captured into frontmatter.related[]
       div.cta-box               -> <CtaBox>…</CtaBox>
  4. Rewrite intra-blog links:  blog/foo.html      -> /blog/foo
                                ../*.html          -> /
  5. Strip data-i18n* attributes (unused after migration), drop inline event
     handlers and <script>/<style> tags.
  6. Emit YAML frontmatter + MDX body.
"""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "blog"
OUT = ROOT / "web" / "content" / "blog"

INLINE_TAGS = {"a", "em", "strong", "i", "b", "span", "code", "small", "sup", "sub", "u", "mark", "br"}
DROP_ATTRS = re.compile(r"^(data-i18n.*|loading|on[a-z]+)$")


# ── frontmatter extraction ────────────────────────────────────────────────

def yaml_escape(v: str) -> str:
    if v is None:
        return '""'
    s = str(v).replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'


def yaml_dump(d: dict, indent: int = 0) -> str:
    out = []
    pad = "  " * indent
    for k, v in d.items():
        if isinstance(v, dict):
            out.append(f"{pad}{k}:")
            out.append(yaml_dump(v, indent + 1))
        elif isinstance(v, list):
            if not v:
                out.append(f"{pad}{k}: []")
            else:
                out.append(f"{pad}{k}:")
                for item in v:
                    if isinstance(item, dict):
                        out.append(f"{pad}  -")
                        out.append(yaml_dump(item, indent + 2))
                    else:
                        out.append(f"{pad}  - {yaml_escape(item)}")
        elif isinstance(v, bool):
            out.append(f"{pad}{k}: {'true' if v else 'false'}")
        elif isinstance(v, (int, float)):
            out.append(f"{pad}{k}: {v}")
        else:
            out.append(f"{pad}{k}: {yaml_escape(v)}")
    return "\n".join(out)


# ── HTML → MDX node tree ──────────────────────────────────────────────────

class Node:
    """Mutable tree node we build during parsing."""
    __slots__ = ("tag", "attrs", "children", "text")
    def __init__(self, tag: str, attrs: dict[str, str] | None = None):
        self.tag = tag
        self.attrs = attrs or {}
        self.children: list[Node | str] = []
        self.text = ""

    def __repr__(self):
        return f"<{self.tag} {self.attrs}>"


class TreeBuilder(HTMLParser):
    SKIP = {"script", "style", "noscript", "svg", "template"}
    VOID = {"br", "img", "hr", "input", "source", "wbr", "meta", "link"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("__root__")
        self.stack: list[Node] = [self.root]
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        a = {k: (v or "") for k, v in attrs}
        a = {k: v for k, v in a.items() if not DROP_ATTRS.match(k)}
        n = Node(tag, a)
        self.stack[-1].children.append(n)
        if tag not in self.VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        if tag in self.SKIP or self.skip_depth:
            return
        a = {k: (v or "") for k, v in attrs}
        a = {k: v for k, v in a.items() if not DROP_ATTRS.match(k)}
        n = Node(tag, a)
        self.stack[-1].children.append(n)

    def handle_endtag(self, tag):
        if tag in self.SKIP:
            if self.skip_depth:
                self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if tag in self.VOID:
            return
        # pop matching node
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if self.skip_depth:
            return
        if data.strip():
            self.stack[-1].children.append(data)
        elif self.stack[-1].children and isinstance(self.stack[-1].children[-1], str):
            # preserve single space between inline siblings
            self.stack[-1].children.append(" ")


def find_first(node: Node, predicate) -> Node | None:
    if isinstance(node, str):
        return None
    if predicate(node):
        return node
    for c in node.children:
        if isinstance(c, Node):
            r = find_first(c, predicate)
            if r:
                return r
    return None


def find_all(node: Node, predicate, out=None) -> list[Node]:
    if out is None:
        out = []
    if isinstance(node, Node):
        if predicate(node):
            out.append(node)
        for c in node.children:
            if isinstance(c, Node):
                find_all(c, predicate, out)
    return out


def has_class(node: Node, cls: str) -> bool:
    if not isinstance(node, Node):
        return False
    return cls in (node.attrs.get("class", "") or "").split()


# ── MDX renderer ──────────────────────────────────────────────────────────

def rewrite_href(href: str) -> str:
    if not href:
        return href
    if href.startswith(("http", "mailto:", "tel:", "#")):
        return href
    # blog/foo.html → /blog/foo
    m = re.match(r"^(?:\.\./)?blog/([a-z0-9\-]+)\.html$", href)
    if m:
        return f"/blog/{m.group(1)}"
    # ../foo.html → /foo  (relative climbs to root pages)
    m = re.match(r"^\.\./([a-z0-9\-]+)\.html$", href)
    if m:
        slug = m.group(1)
        return "/" if slug == "index" else f"/{slug}"
    # foo.html (sibling, e.g. linking to another blog post directly)
    m = re.match(r"^([a-z0-9\-]+)\.html$", href)
    if m:
        return f"/blog/{m.group(1)}"
    return href


def render_inline(node, in_em=False, in_strong=False) -> str:
    if isinstance(node, str):
        return escape_mdx(node)
    parts: list[str] = []
    for c in node.children:
        if isinstance(c, str):
            parts.append(escape_mdx(c))
        elif c.tag == "br":
            parts.append("  \n")
        elif c.tag in {"strong", "b"}:
            inner = render_inline(c, in_em, True).strip()
            parts.append(f"**{inner}**" if not in_strong and inner else inner)
        elif c.tag in {"em", "i"}:
            inner = render_inline(c, True, in_strong).strip()
            parts.append(f"*{inner}*" if not in_em and inner else inner)
        elif c.tag == "a":
            href = rewrite_href(c.attrs.get("href", ""))
            txt = render_inline(c).strip()
            target = c.attrs.get("target", "")
            if target == "_blank":
                # external link — preserve target via JSX
                parts.append(f'<a href="{href}" target="_blank" rel="noopener noreferrer">{txt}</a>')
            else:
                parts.append(f"[{txt}]({href})")
        elif c.tag == "code":
            parts.append(f"`{render_inline(c).strip()}`")
        elif c.tag == "span":
            parts.append(render_inline(c, in_em, in_strong))
        elif c.tag in {"sup", "sub", "u", "mark", "small"}:
            parts.append(render_inline(c, in_em, in_strong))
        else:
            # unhandled inline: drop tag, keep content
            parts.append(render_inline(c, in_em, in_strong))
    return "".join(parts)


def escape_mdx(s: str) -> str:
    # MDX is jsx-aware. Escape `{` and `<` that aren't already JSX.
    s = s.replace("\\", "\\\\")
    s = s.replace("{", "\\{").replace("}", "\\}")
    return s


def render_block(node: Node, depth: int = 0) -> list[str]:
    if isinstance(node, str):
        text = node.strip()
        return [text] if text else []

    cls = (node.attrs.get("class", "") or "").split()
    tag = node.tag

    # ── custom containers ────────────────────────────────
    if "stat-highlight" in cls:
        out = ["", "<StatHighlight>"]
        for item in find_all(node, lambda n: has_class(n, "stat-highlight-item")):
            num_node = find_first(item, lambda n: has_class(n, "number"))
            lab_node = find_first(item, lambda n: has_class(n, "label"))
            num = render_inline(num_node).strip() if num_node else ""
            lab = render_inline(lab_node).strip() if lab_node else ""
            num_attr = json.dumps(num)
            out.append(f"  <Stat number={{{num_attr}}}>{lab}</Stat>")
        out.append("</StatHighlight>")
        out.append("")
        return out

    if "info-box" in cls or "callout" in cls or "warning-box" in cls:
        variant = "info"
        if "warning" in " ".join(cls):
            variant = "warning"
        elif "tip" in " ".join(cls):
            variant = "tip"
        inner = "\n\n".join(render_children(node, depth + 1))
        return ["", f'<Callout variant="{variant}">', inner, "</Callout>", ""]

    if "cta-box" in cls or "blog-cta" in cls:
        inner = "\n\n".join(render_children(node, depth + 1))
        return ["", "<CtaBox>", inner, "</CtaBox>", ""]

    if "related-posts" in cls or "related-articles" in cls or "article-related" in cls:
        # Skip — rendered separately at template level via frontmatter.related[].
        return []
    if "article-cta" in cls:
        # Skip — rendered separately at template level.
        return []

    # ── tables ───────────────────────────────────────────
    if tag == "table":
        return render_table(node)

    # ── headings ─────────────────────────────────────────
    if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
        level = int(tag[1])
        text = render_inline(node).strip()
        if not text:
            return []
        return ["", "#" * level + " " + text, ""]

    # ── paragraphs ───────────────────────────────────────
    if tag == "p":
        text = render_inline(node).strip()
        return ["", text, ""] if text else []

    # ── lists ────────────────────────────────────────────
    if tag == "ul":
        items = []
        for c in node.children:
            if isinstance(c, Node) and c.tag == "li":
                items.append("- " + render_inline(c).strip())
        return ["", *items, ""]
    if tag == "ol":
        items = []
        i = 1
        for c in node.children:
            if isinstance(c, Node) and c.tag == "li":
                items.append(f"{i}. " + render_inline(c).strip())
                i += 1
        return ["", *items, ""]

    # ── blockquote ───────────────────────────────────────
    if tag == "blockquote":
        inner = "\n".join(render_children(node, depth + 1))
        quoted = "\n".join("> " + line if line else ">" for line in inner.split("\n"))
        return ["", quoted, ""]

    # ── horizontal rule ──────────────────────────────────
    if tag == "hr":
        return ["", "---", ""]

    # ── images ───────────────────────────────────────────
    if tag == "img":
        src = node.attrs.get("src", "")
        alt = node.attrs.get("alt", "").replace("]", "\\]").replace("[", "\\[")
        return ["", f"![{alt}]({src})", ""]

    if tag == "figure":
        return render_children(node, depth + 1)

    # ── div/section/aside fallbacks: unwrap ──────────────
    if tag in {"div", "section", "aside", "article", "main", "header", "footer", "nav"}:
        return render_children(node, depth + 1)

    # ── inline-only content rendered as a paragraph ──────
    text = render_inline(node).strip()
    return ["", text, ""] if text else []


def render_children(node: Node, depth: int) -> list[str]:
    out: list[str] = []
    for c in node.children:
        if isinstance(c, str):
            t = c.strip()
            if t:
                out.append(t)
        else:
            out.extend(render_block(c, depth))
    return out


def render_table(table: Node) -> list[str]:
    # Collect rows
    rows = []
    for tr in find_all(table, lambda n: n.tag == "tr"):
        cells = []
        for cell in tr.children:
            if isinstance(cell, Node) and cell.tag in {"td", "th"}:
                cells.append(render_inline(cell).strip().replace("\n", " ").replace("|", "\\|"))
        if cells:
            rows.append(cells)
    if not rows:
        return []
    # Use first row as header (markdown tables require it)
    header = rows[0]
    body = rows[1:]
    out = ["", "| " + " | ".join(header) + " |", "|" + "|".join("---" for _ in header) + "|"]
    for r in body:
        # pad if mismatch
        while len(r) < len(header):
            r.append("")
        out.append("| " + " | ".join(r[: len(header)]) + " |")
    out.append("")
    return out


# ── per-file conversion ───────────────────────────────────────────────────

def get_meta(soup_root: Node, name: str | None = None, prop: str | None = None) -> str | None:
    """Find <meta name="..."> or <meta property="..."> via walking head children."""
    # We dropped <head> in TreeBuilder.SKIP — so we re-parse <head> from the raw
    # HTML for these. (This function is unused; meta extraction happens in
    # convert_one via regex on raw text.)
    return None


def parse_metas(raw: str) -> dict[str, str]:
    metas: dict[str, str] = {}
    for m in re.finditer(r"<meta\s+([^>]+?)/?>", raw, re.I):
        attrs = dict(re.findall(r'(\w[\w:\-]*)\s*=\s*"([^"]*)"', m.group(1)))
        key = attrs.get("name") or attrs.get("property")
        val = attrs.get("content")
        if key and val:
            metas[key] = val
    return metas


def parse_jsonld(raw: str) -> list[dict]:
    out = []
    for m in re.finditer(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', raw, re.S):
        try:
            out.append(json.loads(m.group(1).strip()))
        except json.JSONDecodeError:
            pass
    return out


def parse_title(raw: str) -> str:
    m = re.search(r"<title[^>]*>(.*?)</title>", raw, re.S)
    return m.group(1).strip() if m else ""


def parse_canonical(raw: str) -> str:
    m = re.search(r'<link[^>]+rel="canonical"[^>]*href="([^"]+)"', raw)
    return m.group(1) if m else ""


def parse_related(soup_root: Node) -> list[dict]:
    rels: list[dict] = []
    for box in find_all(soup_root, lambda n:
        has_class(n, "related-post-card")
        or has_class(n, "related-card")
        or has_class(n, "related-article-card")
    ):
        # box is itself the <a>
        if box.tag == "a":
            link = box
        else:
            link = find_first(box, lambda n: n.tag == "a")
        title_node = find_first(box, lambda n: n.tag in {"h3", "h4"})
        cat_node = find_first(box, lambda n: has_class(n, "related-category"))
        excerpt = find_first(box, lambda n: n.tag == "p")
        if not link:
            continue
        rels.append({
            "href": rewrite_href(link.attrs.get("href", "")),
            "title": render_inline(title_node).strip() if title_node else render_inline(link).strip(),
            "category": render_inline(cat_node).strip() if cat_node else "",
            "excerpt": render_inline(excerpt).strip() if excerpt else "",
        })
    return rels


def parse_meta_strip(soup_root: Node) -> dict:
    """From article-meta div: pull category, date, readtime."""
    meta_div = find_first(soup_root, lambda n: has_class(n, "article-meta"))
    if not meta_div:
        return {}
    out = {}
    cat = find_first(meta_div, lambda n: has_class(n, "article-category"))
    if cat:
        out["category"] = render_inline(cat).strip()
    spans = find_all(meta_div, lambda n: n.tag == "span")
    for sp in spans:
        text = render_inline(sp).strip()
        if re.match(r"\d{2}\.\d{2}\.\d{4}", text):
            out["date_display"] = text
        elif "min" in text.lower() and "czyt" in text.lower():
            out["readtime"] = text
    return out


def find_article_root(root: Node) -> Node | None:
    return find_first(root, lambda n: has_class(n, "blog-article"))


def find_hero_image(article: Node) -> str | None:
    fig = find_first(article, lambda n: has_class(n, "article-hero-image"))
    if fig:
        img = find_first(fig, lambda n: n.tag == "img")
        if img:
            return img.attrs.get("src", "")
    return None


def slugify_path(p: Path) -> str:
    return p.stem


def convert_one(html_path: Path, out_dir: Path) -> dict:
    raw = html_path.read_text(encoding="utf-8")
    metas = parse_metas(raw)
    jsonld = parse_jsonld(raw)
    title = parse_title(raw).split(" | ")[0].strip()  # strip "| Dekada72H Blog"
    canonical = parse_canonical(raw)

    # find article + extract content
    builder = TreeBuilder()
    builder.feed(raw)
    builder.close()

    article = find_article_root(builder.root)
    if not article:
        print(f"  WARN: no <article class='blog-article'> in {html_path.name}", file=sys.stderr)
        return {"slug": slugify_path(html_path), "ok": False}

    hero = find_hero_image(article)
    meta_strip = parse_meta_strip(article)
    related = parse_related(builder.root)

    # locate Article schema for date + image
    article_schema = next(
        (j for j in jsonld if j.get("@type") == "Article" or j.get("@type") == "BlogPosting"),
        None,
    )
    faq_schema = next((j for j in jsonld if j.get("@type") == "FAQPage"), None)

    date_published = (article_schema or {}).get("datePublished", "")
    date_modified = (article_schema or {}).get("dateModified", date_published)

    # frontmatter
    fm = {
        "slug": slugify_path(html_path),
        "title": title,
        "description": metas.get("description", ""),
        "date": date_published,
        "modified": date_modified,
        "category": meta_strip.get("category", ""),
        "date_display": meta_strip.get("date_display", ""),
        "readtime": meta_strip.get("readtime", ""),
        "hero_image": hero or metas.get("og:image", ""),
        "hero_alt": "",
        "keywords": metas.get("keywords", ""),
        "canonical": canonical,
        "og_title": metas.get("og:title", title),
        "og_description": metas.get("og:description", metas.get("description", "")),
    }
    if faq_schema:
        fm["faq"] = []
        for q in (faq_schema.get("mainEntity") or []):
            fm["faq"].append({
                "q": q.get("name", ""),
                "a": (q.get("acceptedAnswer") or {}).get("text", ""),
            })
    if related:
        fm["related"] = related

    # Try to grab hero alt from the actual <img>
    fig = find_first(article, lambda n: has_class(n, "article-hero-image"))
    if fig:
        img = find_first(fig, lambda n: n.tag == "img")
        if img:
            fm["hero_alt"] = img.attrs.get("alt", "")

    # render body — skip hero figure + meta strip (rendered by template)
    body_lines: list[str] = []
    for c in article.children:
        if isinstance(c, Node):
            if has_class(c, "article-meta") or has_class(c, "article-hero-image"):
                continue
            body_lines.extend(render_block(c))
        elif isinstance(c, str) and c.strip():
            body_lines.append(c.strip())

    # collapse multiple blank lines
    body = "\n".join(body_lines)
    body = re.sub(r"\n{3,}", "\n\n", body)
    body = body.strip() + "\n"

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{fm['slug']}.mdx"
    out_path.write_text(
        "---\n" + yaml_dump(fm) + "\n---\n\n" + body,
        encoding="utf-8",
    )

    return {
        "slug": fm["slug"],
        "ok": True,
        "lines": len(body.splitlines()),
        "faq_q": len(fm.get("faq", [])),
        "related": len(fm.get("related", [])),
    }


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(SRC.glob("*.html"))
    print(f"Converting {len(files)} blog posts:")
    for f in files:
        info = convert_one(f, OUT)
        if info["ok"]:
            print(f"  ✓ {info['slug']}: {info['lines']} lines, "
                  f"FAQ={info['faq_q']}, related={info['related']}")
        else:
            print(f"  ✗ {info['slug']}: FAILED")


if __name__ == "__main__":
    main()
