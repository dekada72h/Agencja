"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SchReveal } from "../reveal";
import { AnimatedLine } from "../animated-line";

const items = [
  {
    year: "2025",
    title: "Cykl portretowy „Twarze niepokorne”",
    desc: "Seria piętnastu prac olejnych, eksplorująca portret jako studium światła i cienia.",
  },
  {
    year: "2024",
    title: "Wystawa zbiorowa — Galeria Sztuki Współczesnej",
    desc: "Udział w wystawie tematycznej poświęconej współczesnemu rysunkowi figuratywnemu.",
  },
  {
    year: "2023",
    title: "Plener malarski · krajobraz dolnośląski",
    desc: "Cykl prac wykonanych w terenie, badających temat światła i atmosfery o różnych porach dnia.",
  },
  {
    year: "2022",
    title: "Pierwsza wystawa indywidualna",
    desc: "Prezentacja dwudziestu prac z lat 2019–2022, łączących portret i kompozycje abstrakcyjne.",
  },
  {
    year: "→",
    title: "Pracownia — proces ciągły",
    desc: "Codzienna praca nad nowymi obrazami i rysunkami. Kolejne prace pojawią się w galerii i na Instagramie.",
  },
];

export function CareerTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-28 lg:py-36">
      <div className="mx-auto max-w-[820px] px-6 lg:px-10">
        <SchReveal className="text-center mb-16">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] mb-5">
            Droga twórcza
          </span>
          <h2 className="font-cormorant italic text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--sk-ink)] leading-[1.1]">
            Wybrane <span className="not-italic text-[var(--sk-rose-deep)]">etapy</span>
          </h2>
          <div className="flex justify-center mt-6 text-[var(--sk-rose-deep)]">
            <AnimatedLine width={48} />
          </div>
        </SchReveal>

        <div ref={ref} className="relative pl-8 lg:pl-12">
          <div aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-[var(--sk-line)]" />
          <motion.div
            aria-hidden
            style={{ height: lineHeight }}
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-[var(--sk-rose-deep)] via-[var(--sk-rose)] to-transparent origin-top"
          />

          {items.map((it, i) => (
            <motion.div
              key={it.year + it.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative pb-12 last:pb-0"
            >
              <span
                aria-hidden
                className="absolute -left-[37px] lg:-left-[49px] top-2 w-2.5 h-2.5 rounded-full bg-[var(--sk-rose-deep)] ring-4 ring-[var(--sk-cream)]"
              />
              <div className="font-cormorant italic text-3xl text-[var(--sk-rose-deep)] leading-none">
                {it.year}
              </div>
              <h4 className="mt-3 font-cormorant text-2xl text-[var(--sk-ink)]">{it.title}</h4>
              <p className="mt-3 text-base text-[var(--sk-muted)] leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
