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
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="group h-full rounded-2xl bg-white border border-gray-100 p-7 hover:shadow-glow hover:border-primary/30 transition-shadow"
              >
                <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center shadow-soft">
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 font-display font-semibold text-xl text-ink">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all"
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
