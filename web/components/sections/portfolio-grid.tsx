"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Arrow } from "@/components/icons";
import { TiltCard } from "@/components/ui/tilt-card";
import { MagneticButton } from "@/components/ui/magnetic-button";

type Item = {
  href: string;
  img: string;
  alt: string;
  title: string;
  categoryKey: string;
};

const items: Item[] = [
  {
    href: "/portfolio/BellaVista/index.html",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
    alt: "Strona internetowa dla restauracji Bella Vista - realizacja Dekada72H",
    title: "Restauracja Bella Vista",
    categoryKey: "gastro",
  },
  {
    href: "/portfolio/BudMaster/index.html",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
    alt: "BudMaster",
    title: "BudMaster",
    categoryKey: "construction",
  },
  {
    href: "/portfolio/FitPro/index.html",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
    alt: "FitPro Studio",
    title: "FitPro Studio",
    categoryKey: "fitness",
  },
  {
    href: "/portfolio/Glamour-Beauty/index.html",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80",
    alt: "Glamour Beauty",
    title: "Glamour Beauty Studio",
    categoryKey: "beauty",
  },
  {
    href: "/portfolio/MediCare-Plus/index.html",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80",
    alt: "MediCare Plus",
    title: "MediCare Plus",
    categoryKey: "medicine",
  },
  {
    href: "/portfolio/ToyLand/index.html",
    img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&q=80",
    alt: "ToyLand",
    title: "ToyLand",
    categoryKey: "ecommerce",
    titleKey: "toyland",
  } as Item & { titleKey: string },
  {
    href: "/portfolio/PrintMaster/index.html",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80",
    alt: "PrintMaster",
    title: "PrintMaster",
    categoryKey: "print",
    titleKey: "printmaster",
  } as Item & { titleKey: string },
  {
    href: "/portfolio/PetZone/index.html",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
    alt: "PetZone",
    title: "PetZone",
    categoryKey: "pets",
    titleKey: "petzone",
  } as Item & { titleKey: string },
  {
    // Schwenk is a Next.js route (premium portfolio); others are static.
    href: "/portfolio/Katarzyna-Schwenk",
    img: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=900&q=80",
    alt: "Katarzyna Schwenk Art",
    title: "Katarzyna Schwenk",
    categoryKey: "beauty",
  },
];

export function PortfolioGrid() {
  const t = useTranslations("index.portfolio");

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.12),transparent_50%)]" />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            {t("label")}
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg text-white/70">{t("desc")}</p>
        </Reveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => {
            const titleKey = (item as Item & { titleKey?: string }).titleKey;
            return (
              <StaggerItem key={item.href}>
                <a href={item.href} className="block group">
                  <TiltCard
                    intensity={6}
                    glareOpacity={0.18}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink-soft shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/20 transition-shadow duration-500"
                  >
                    <Image
                      src={item.img}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={idx < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    {/* light beam sweep on hover */}
                    <div
                      aria-hidden
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="inline-block w-fit text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-light bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                        {t(`cat.${item.categoryKey}`)}
                      </span>
                      <h3 className="mt-3 font-display font-semibold text-xl text-white">
                        {titleKey ? t(titleKey) : item.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/70 group-hover:text-white group-hover:gap-3 transition-all">
                        {t("view")}
                        <Arrow className="w-4 h-4" />
                      </span>
                    </div>
                  </TiltCard>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <div className="mt-12 text-center">
          <MagneticButton strength={0.3}>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-ink font-medium hover:bg-primary hover:text-white transition-colors"
            >
              {t("viewall")}
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
