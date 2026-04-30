import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFaq = { q: string; a: string };
export type BlogRelated = { href: string; title: string; category?: string; excerpt?: string };

export type BlogFrontmatter = {
  slug: string;
  title: string;
  description: string;
  date: string;
  modified: string;
  category: string;
  date_display: string;
  readtime: string;
  hero_image: string;
  hero_alt: string;
  keywords: string;
  canonical: string;
  og_title: string;
  og_description: string;
  faq?: BlogFaq[];
  related?: BlogRelated[];
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  content: string;
};

export async function getAllSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(BLOG_DIR);
    return entries
      .filter((e) => e.endsWith(".mdx"))
      .map((e) => e.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const file = path.join(BLOG_DIR, `${slug}.mdx`);
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    return { frontmatter: data as BlogFrontmatter, content };
  } catch {
    return null;
  }
}

export async function getAllPostsMeta(): Promise<BlogFrontmatter[]> {
  const slugs = await getAllSlugs();
  const posts = await Promise.all(slugs.map((s) => getPost(s)));
  return posts
    .filter((p): p is BlogPost => p !== null)
    .map((p) => p.frontmatter)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
