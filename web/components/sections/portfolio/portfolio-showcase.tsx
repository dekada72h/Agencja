"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";
import { cn } from "@/lib/utils";

type Category = "all" | "www" | "landing" | "redesign" | "art";

type ShowcaseItem = {
  href: string;
  category: Category;
  img?: string;
  alt?: string;
  badge: string;
  cat: string;
  title: string;
  desc: string;
  tags: string[];
  custom?: "schwenk";
};

export function PortfolioShowcase() {
  const t = useTranslations("portfolio");
  const [active, setActive] = useState<Category>("all");

  const items: ShowcaseItem[] = [
    {
      href: "/portfolio/Katarzyna-Schwenk",
      category: "art",
      custom: "schwenk",
      badge: "Sztuka",
      cat: "Strona artystyczna",
      title: "Katarzyna Schwenk — Malarstwo i Rysunek",
      desc:
        "Pełnoprawna, multi-page strona portfolio dla artystki — malarki i rysowniczki. Galeria prac olejnych, rysunkowych, biografia, kontakt. Strona przygotowana pod późniejsze podpięcie Instagrama i kolejnych prac.",
      tags: ["Multi-page", "Galeria", "Sztuka", "Bez własnej domeny"],
    },
    {
      href: "/portfolio/BellaVista/index.html",
      category: "www",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
      alt: "Restauracja Bella Vista - strona WWW dla restauracji włoskiej we Wrocławiu",
      badge: t("bella.badge"),
      cat: t("bella.cat"),
      title: "Restauracja Bella Vista",
      desc: t("bella.desc"),
      tags: ["WordPress", t("bella.tag2"), "SEO"],
    },
    {
      href: "/portfolio/BudMaster/index.html",
      category: "www",
      img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
      alt: "BudMaster - profesjonalna strona firmy budowlanej z portfolio realizacji i kalkulatorem wycen",
      badge: t("bud.badge"),
      cat: t("bud.cat"),
      title: "BudMaster",
      desc: t("bud.desc"),
      tags: ["Custom Code", t("bud.tag2"), "Portfolio"],
    },
    {
      href: "/portfolio/FitPro/index.html",
      category: "landing",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
      alt: "FitPro Studio - dynamiczna strona studia fitness z grafikiem zajęć i zapisami online",
      badge: t("fit.badge"),
      cat: t("fit.cat"),
      title: "FitPro Studio",
      desc: t("fit.desc"),
      tags: ["React", t("fit.tag2"), t("fit.tag3")],
    },
    {
      href: "/portfolio/Glamour-Beauty/index.html",
      category: "landing",
      img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80",
      alt: "Glamour Beauty Studio - strona salonu kosmetycznego z systemem rezerwacji i galerią metamorfoz",
      badge: t("glamour.badge"),
      cat: t("glamour.cat"),
      title: "Glamour Beauty Studio",
      desc: t("glamour.desc"),
      tags: ["Booksy", t("glamour.tag2"), "E-commerce"],
    },
    {
      href: "/portfolio/MediCare-Plus/index.html",
      category: "www",
      img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80",
      alt: "MediCare Plus - nowoczesna strona kliniki medycznej z systemem rezerwacji wizyt online",
      badge: t("medicare.badge"),
      cat: t("medicare.cat"),
      title: "MediCare Plus",
      desc: t("medicare.desc"),
      tags: ["Custom Code", t("medicare.tag2"), t("medicare.tag3")],
    },
    {
      href: "/portfolio/ToyLand/index.html",
      category: "www",
      img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&q=80",
      alt: "ToyLand - kolorowy sklep internetowy z zabawkami dla dzieci z katalogiem produktów",
      badge: t("toyland.badge"),
      cat: t("toyland.cat"),
      title: t("toyland.title"),
      desc: t("toyland.desc"),
      tags: ["E-commerce", t("toyland.tag2"), t("toyland.tag3")],
    },
    {
      href: "/portfolio/PrintMaster/index.html",
      category: "www",
      img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80",
      alt: "PrintMaster - strona drukarni z katalogiem usług poligraficznych i formularzem wyceny",
      badge: t("print.badge"),
      cat: t("print.cat"),
      title: t("print.title"),
      desc: t("print.desc"),
      tags: [t("print.tag1"), t("print.tag2"), t("print.tag3")],
    },
    {
      href: "/portfolio/PetZone/index.html",
      category: "www",
      img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
      alt: "PetZone - sklep zoologiczny online z karmą, akcesoriami i zabawkami dla zwierząt",
      badge: t("pet.badge"),
      cat: t("pet.cat"),
      title: t("pet.title"),
      desc: t("pet.desc"),
      tags: [t("pet.tag1"), "E-commerce", t("pet.tag3")],
    },
  ];

  const filters: { key: Category; label: string }[] = [
    { key: "all", label: t("filter.all") },
    { key: "www", label: t("filter.www") },
    { key: "landing", label: t("filter.landing") },
    { key: "redesign", label: t("filter.redesign") },
    { key: "art", label: "Sztuka" },
  ];

  const visible = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("grid.label")}
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            {t("grid.title")}
          </h2>
          <p className="mt-5 text-lg text-gray-600">{t("grid.desc")}</p>
        </Reveal>

        <LayoutGroup>
          <Reveal className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className={cn(
                  "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
                  active === f.key
                    ? "text-white"
                    : "text-gray-700 hover:text-ink bg-white"
                )}
              >
                {active === f.key && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-gradient-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <motion.div
                  key={item.href}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-2xl bg-white overflow-hidden shadow-soft hover:shadow-glow border border-transparent hover:border-primary/20 transition-shadow"
                >
                  <a href={item.href} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {item.custom === "schwenk" ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#8d5e4f]">
                          <div className="text-center px-8">
                            <div
                              className="font-display italic text-3xl text-[#faf6ee] leading-tight"
                              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                            >
                              Katarzyna
                              <br />
                              <span className="text-[#d4c5a9]">Schwenk</span>
                            </div>
                            <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#b58a7a]">
                              Malarstwo · Rysunek
                            </div>
                          </div>
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ink text-cream text-[10px] uppercase tracking-wider">
                            Sztuka
                          </span>
                          <span className="absolute top-4 right-4 px-3 py-1 bg-black/90 text-[#faf6ee] text-[9px] uppercase tracking-wider border-l-2 border-[#b58a7a]">
                            Pokaz portfolio
                          </span>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={item.img!}
                            alt={item.alt!}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-ink text-[10px] uppercase tracking-wider font-semibold">
                            {item.badge}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {item.cat}
                      </div>
                      <h3 className="mt-2 font-display font-semibold text-lg text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                        {t("item.view")}
                        <Arrow className="w-4 h-4" />
                      </span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
