"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";

const members = [
  { name: "Damian", descKey: "damian1.desc" },
  { name: "Kuba", descKey: "kuba.desc" },
  { name: "Damian", descKey: "damian2.desc" },
] as const;

export function TeamSection() {
  const t = useTranslations("about.team");
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
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

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {members.map((m, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="text-center"
              >
                <div className="aspect-square rounded-2xl bg-gradient-primary flex items-center justify-center overflow-hidden shadow-glow">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 stroke-white" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="mt-5 font-display font-bold text-xl text-ink">{m.name}</div>
                <div className="text-sm text-primary font-medium">{t("role.coowner")}</div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed px-2">
                  {t(m.descKey)}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
