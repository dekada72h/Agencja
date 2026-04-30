"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Code, Layers, Bolt, Shield } from "@/components/icons";
import type { ReactNode } from "react";

const items: Array<{
  key: "code" | "design" | "perf" | "control";
  Icon: (p: React.SVGProps<SVGSVGElement>) => ReactNode;
  accent: string;
}> = [
  { key: "code", Icon: Code, accent: "from-primary to-primary-light" },
  { key: "design", Icon: Layers, accent: "from-secondary to-secondary-dark" },
  { key: "perf", Icon: Bolt, accent: "from-accent to-accent-dark" },
  { key: "control", Icon: Shield, accent: "from-ink to-ink-soft" },
];

export function CustomWork() {
  const t = useTranslations("index.custom");
  return (
    <section className="py-24 lg:py-32 bg-white">
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

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ key, Icon, accent }) => (
            <StaggerItem key={key}>
              <motion.div
                whileHover={{ y: -6, rotate: -0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative h-full rounded-2xl bg-gray-50 p-7 overflow-hidden border border-transparent hover:border-gray-200 transition-colors"
              >
                <div
                  aria-hidden
                  className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl`}
                />
                <span className={`relative inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white items-center justify-center shadow-soft`}>
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 font-display font-semibold text-lg text-ink">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
