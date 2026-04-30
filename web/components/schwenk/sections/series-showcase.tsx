"use client";

import { motion } from "motion/react";
import { SchReveal } from "../reveal";
import { AnimatedLine } from "../animated-line";

const series = [
  {
    num: "I.",
    title: "„Twarze niepokorne” · 2025",
    desc: "Cykl piętnastu portretów olejnych. Studium światła padającego pod różnymi kątami, próba uchwycenia ekspresji bez idealizacji.",
  },
  {
    num: "II.",
    title: "„Cisza między godzinami” · 2024",
    desc: "Seria pejzaży i wnętrz, w których głównym bohaterem jest powietrze, światło i pustka.",
  },
  {
    num: "III.",
    title: "„Ręce” · 2023",
    desc: "Cykl rysunków węglem i tuszem — studium dłoni jako portretu człowieka.",
  },
];

export function SeriesShowcase() {
  return (
    <section className="py-28 lg:py-36">
      <div className="mx-auto max-w-[820px] px-6 lg:px-10">
        <SchReveal className="text-center mb-16">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] mb-5">
            Cykle
          </span>
          <h2 className="font-cormorant text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--sk-ink)] leading-[1.1]">
            Wybrane <em className="text-[var(--sk-rose-deep)]">serie</em> tematyczne
          </h2>
          <div className="flex justify-center mt-6 text-[var(--sk-rose-deep)]">
            <AnimatedLine width={48} />
          </div>
          <p className="mt-8 text-lg text-[var(--sk-muted)] leading-relaxed">
            Prace powstają najczęściej w cyklach — kilkutygodniowych dialogach z jednym tematem.
            Poniżej najważniejsze.
          </p>
        </SchReveal>

        <div className="space-y-12">
          {series.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[80px_1fr] gap-6 pb-12 last:pb-0 last:border-b-0 border-b border-[var(--sk-line)]"
            >
              <div className="font-cormorant italic text-3xl text-[var(--sk-rose-deep)]">
                {s.num}
              </div>
              <div>
                <h3 className="font-cormorant text-2xl text-[var(--sk-ink)]">{s.title}</h3>
                <p className="mt-3 text-base text-[var(--sk-muted)] leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
