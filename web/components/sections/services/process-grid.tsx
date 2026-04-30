"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";

const steps = [1, 2, 3, 4] as const;

export function ProcessGrid() {
  const t = useTranslations("services.process");

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

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((n) => (
            <StaggerItem key={n}>
              <motion.div
                whileHover={{ y: -6, rotate: -0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative h-full rounded-2xl bg-white p-7 border border-gray-100 hover:shadow-glow hover:border-primary/30 transition-shadow"
              >
                <div className="font-display font-bold text-5xl text-gradient-primary leading-none mb-5">
                  0{n}
                </div>
                <h4 className="font-display font-semibold text-lg text-ink">
                  {t(`s${n}.title`)}
                </h4>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {t(`s${n}.desc`)}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
