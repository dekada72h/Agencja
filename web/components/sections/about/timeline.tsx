"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/reveal";

const years = ["2016", "2018", "2019", "2022", "2026"] as const;

export function Timeline() {
  const t = useTranslations("about.timeline");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

        <div ref={ref} className="relative max-w-2xl mx-auto pl-12">
          {/* base line */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" aria-hidden />
          {/* progress line */}
          <motion.div
            aria-hidden
            style={{ height: lineHeight }}
            className="absolute left-2 top-0 w-px bg-gradient-to-b from-primary via-secondary to-primary origin-top"
          />

          {years.map((year, i) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative pb-12 last:pb-0"
            >
              <span
                aria-hidden
                className="absolute -left-[42px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-white shadow-glow"
              />
              <div className="text-sm font-bold text-primary tracking-wider">{year}</div>
              <h4 className="mt-2 font-display font-semibold text-xl text-ink">
                {t(`${year}.title`)}
              </h4>
              <p className="mt-2 text-base text-gray-600 leading-relaxed">
                {t(`${year}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
