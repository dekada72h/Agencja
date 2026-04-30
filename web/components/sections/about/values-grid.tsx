"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import type { SVGProps } from "react";

const StarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const TeamIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const BoltIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ClockIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const EyeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const values = [
  { key: "quality", Icon: StarIcon, gradient: "from-primary to-primary-light" },
  { key: "partnership", Icon: TeamIcon, gradient: "from-secondary to-secondary-dark" },
  { key: "innovation", Icon: BoltIcon, gradient: "from-accent to-accent-dark" },
  { key: "punctuality", Icon: ClockIcon, gradient: "from-primary to-secondary" },
  { key: "transparency", Icon: EyeIcon, gradient: "from-primary-dark to-primary" },
  { key: "support", Icon: MailIcon, gradient: "from-accent-dark to-primary" },
] as const;

export function ValuesGrid() {
  const t = useTranslations("about.values");
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

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map(({ key, Icon, gradient }) => (
            <StaggerItem key={key}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="relative h-full rounded-2xl bg-white border border-gray-100 p-7 hover:shadow-glow hover:border-primary/30 transition-shadow overflow-hidden"
              >
                <div
                  aria-hidden
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
                />
                <span
                  className={`relative inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white items-center justify-center shadow-soft`}
                >
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 font-display font-semibold text-xl text-ink">
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
