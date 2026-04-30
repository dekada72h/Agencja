"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { StaggerChildren, StaggerItem } from "@/components/reveal";
import { Arrow } from "@/components/icons";

type Article = {
  slug: string;
  article: number; // for blog.articleN.* translation keys
  date: string;
  img: string;
  alt: string;
};

const articles: Article[] = [
  { slug: "jak-zwiekszyc-konwersje-na-stronie", article: 11, date: "13.02.2026",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
    alt: "Jak zwiększyć konwersje na stronie internetowej - optymalizacja CRO i analityka" },
  { slug: "google-moja-firma-wizytowka-google", article: 10, date: "13.02.2026",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80",
    alt: "Google Moja Firma - optymalizacja wizytówki Google dla firm z Wrocławia" },
  { slug: "tworzenie-stron-internetowych-wroclaw", article: 7, date: "08.02.2026",
    img: "https://images.unsplash.com/photo-1626368373312-07ac5d210915?w=900&q=80",
    alt: "Tworzenie stron internetowych Wrocław" },
  { slug: "marketing-internetowy-wroclaw", article: 8, date: "03.02.2026",
    img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=900&q=80",
    alt: "Marketing internetowy we Wrocławiu - strategie dla lokalnych firm" },
  { slug: "strona-internetowa-dla-firmy", article: 6, date: "29.01.2026",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80",
    alt: "Strona internetowa dla firmy" },
  { slug: "pozycjonowanie-lokalne-wroclaw", article: 9, date: "24.01.2026",
    img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=80",
    alt: "Pozycjonowanie lokalne Wrocław - Google Maps i lokalne SEO" },
  { slug: "ile-kosztuje-strona-internetowa", article: 5, date: "19.01.2026",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80",
    alt: "Ile kosztuje strona internetowa" },
  { slug: "automatyzacja-procesow-biznesowych", article: 4, date: "14.01.2026",
    img: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=900&q=80",
    alt: "Automatyzacja procesów biznesowych" },
  { slug: "seo-pozycjonowanie-stron", article: 3, date: "09.01.2026",
    img: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=900&q=80",
    alt: "SEO i pozycjonowanie stron" },
  { slug: "landing-page-co-to-jest", article: 2, date: "04.01.2026",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
    alt: "Landing Page - strona docelowa" },
  { slug: "html-vs-wordpress", article: 1, date: "30.12.2025",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
    alt: "HTML vs WordPress - porównanie" },
];

export function BlogGrid() {
  const t = useTranslations("blog");

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, idx) => {
            const ns = `article${a.article}`;
            return (
              <StaggerItem key={a.slug}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="h-full rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-glow hover:border-primary/20 transition-shadow"
                >
                  <Link href={`/blog/${a.slug}` as never} className="block group">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={a.img}
                        alt={a.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={idx < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent" />
                    </div>
                    <div className="p-6 flex flex-col">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {t(`${ns}.category`)}
                        </span>
                        <time className="text-xs text-gray-500">{a.date}</time>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-ink leading-snug group-hover:text-primary transition-colors">
                        {t(`${ns}.card.title`)}
                      </h3>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">
                        {t(`${ns}.card.excerpt`)}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                        {t("readmore")}
                        <Arrow className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
