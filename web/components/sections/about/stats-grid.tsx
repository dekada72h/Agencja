"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Counter } from "@/components/counter";
import { StaggerChildren, StaggerItem } from "@/components/reveal";

export function StatsGrid() {
  const t = useTranslations("about.stat");
  const stats = [
    { value: 100, suffix: "%", label: t("scratch") },
    { value: 98, suffix: "%", label: t("clients") },
    { value: 10, suffix: "", label: t("experience") },
    { value: 5, suffix: "", label: t("team") },
  ];

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="rounded-2xl bg-white p-8 lg:p-10 text-center shadow-soft hover:shadow-glow border border-transparent hover:border-primary/20 transition-shadow"
              >
                <div className="font-display font-bold text-5xl lg:text-6xl leading-none text-gradient-primary">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-sm text-gray-600 font-medium">{s.label}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
