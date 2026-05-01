"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type TocItem = { id: string; text: string };

/**
 * Auto Table of Contents — collapsible. Uses scroll-spy to highlight
 * active section. Static at top of article but sticks via CSS.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-25% 0% -65% 0%", threshold: 0 },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Spis treści"
      className="not-prose my-8 rounded-2xl border border-gray-200 bg-gray-50/60 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 lg:px-6 py-4 cursor-pointer hover:bg-gray-100/60 transition-colors rounded-2xl"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-primary"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span className="font-display font-semibold text-sm uppercase tracking-[0.15em] text-ink">
            Spis treści ({items.length})
          </span>
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-gray-500"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <ol className="px-5 lg:px-6 pb-5 pt-1 space-y-1.5 text-[0.95rem]">
          {items.map((item, i) => (
            <li key={item.id} className="flex items-start gap-2.5">
              <span className="inline-block w-6 text-right text-xs text-gray-400 tabular-nums pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${item.id}`}
                className={`flex-1 transition-colors ${
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </motion.div>
    </motion.nav>
  );
}

/** Extract H2 headings from raw MDX source. Returns [{id, text}]. */
export function extractToc(mdx: string): TocItem[] {
  const lines = mdx.split("\n");
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const text = m[1].trim();
      // slugify like rehype-slug — lowercase, replace non-alphanum with -, collapse
      const id = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-+|-+$)/g, "")
        .slice(0, 80);
      items.push({ id, text });
    }
  }
  return items;
}
