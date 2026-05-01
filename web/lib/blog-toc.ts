/**
 * Server-safe Table-of-Contents extraction from raw MDX source.
 * Lives in /lib (no "use client") so it can be called during RSC
 * rendering and the result passed as a prop into the client Toc
 * component.
 */
export type TocItem = { id: string; text: string };

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
      // slugify like rehype-slug — lowercase, NFD-strip diacritics,
      // collapse non-alphanum to hyphen, trim.
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
