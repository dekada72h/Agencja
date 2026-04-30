import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

const BASE = "https://dekada72h.com";

const MAIN_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/tools", priority: 0.6, changeFrequency: "monthly" as const },
  {
    path: "/strony-internetowe-dla-kancelarii-wroclaw",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
];

const PORTFOLIO_SITES = [
  "Katarzyna-Schwenk",
  "BellaVista",
  "BudMaster",
  "FitPro",
  "Glamour-Beauty",
  "MediCare-Plus",
  "PetZone",
  "PrintMaster",
  "ToyLand",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split("T")[0];
  const blogSlugs = await getAllSlugs();

  const main = MAIN_PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: today,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const portfolio = PORTFOLIO_SITES.map((name) => ({
    url:
      name === "Katarzyna-Schwenk"
        ? `${BASE}/portfolio/${name}`
        : `${BASE}/portfolio/${name}/index.html`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blog = blogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...main, ...portfolio, ...blog];
}
