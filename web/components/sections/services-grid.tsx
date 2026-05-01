"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Arrow, Monitor, Document, Search, Settings } from "@/components/icons";
import type { ReactNode } from "react";

const services: Array<{
  key: "www" | "landing" | "seo" | "auto";
  href: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => ReactNode;
}> = [
  { key: "www", href: "/services", Icon: Monitor },
  { key: "landing", href: "/services", Icon: Document },
  { key: "seo", href: "/services", Icon: Search },
  { key: "auto", href: "/services#automatyzacja", Icon: Settings },
];

export function ServicesGrid() {
  const t = useTranslations("index.services");

  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("label")}
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg text-gray-600">{t("desc")}</p>
        </Reveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ key, href, Icon }) => (
            <StaggerItem key={key}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="group relative h-full rounded-2xl bg-white border border-gray-100 p-7 overflow-hidden hover:shadow-glow hover:border-primary/30 transition-all"
              >
                {/* light beam sweep on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] ease-out bg-gradient-to-r from-transparent via-primary/[0.07] to-transparent"
                />
                {/* subtle gradient halo on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500"
                />
                <span className="relative inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                  {/* glow ring */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-primary/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <Icon className="relative w-6 h-6" />
                </span>
                <h3 className="relative mt-5 font-display font-semibold text-xl text-ink">
                  {t(`${key}.title`)}
                </h3>
                <p className="relative mt-3 text-sm text-gray-600 leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
                <Link
                  href={href}
                  className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all"
                >
                  {t(`${key}.link`)}
                  <Arrow className="w-4 h-4" />
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
