"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import type { SVGProps } from "react";

const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const GridIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);
const CodeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const RocketIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const steps = [
  { key: "s1", Icon: ChatIcon },
  { key: "s2", Icon: GridIcon },
  { key: "s3", Icon: CodeIcon },
  { key: "s4", Icon: RocketIcon },
] as const;

export function ProcessSection() {
  const t = useTranslations("portfolio.process");
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("label")}
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg text-gray-600">{t("desc")}</p>
        </Reveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ key, Icon }, i) => (
            <StaggerItem key={key}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="relative h-full rounded-2xl bg-white border border-gray-100 p-7 hover:shadow-glow hover:border-primary/30 transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center shadow-soft">
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className="font-display font-bold text-3xl text-gradient-primary leading-none">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-ink">
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
