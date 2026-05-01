"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { DotPattern } from "@/components/ui/dot-pattern";
import { CodeEditorPreview } from "@/components/ui/code-editor-preview";

export function ProcessTerminal() {
  const reduce = useReducedMotion();
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-ink via-ink-soft to-ink overflow-hidden">
      {/* Aurora — slow drifting blobs in primary/secondary/accent */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-primary/30 blur-[140px]"
        animate={reduce ? undefined : { x: [0, 90, -30, 0], y: [0, 50, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-secondary/25 blur-[140px]"
        animate={reduce ? undefined : { x: [0, -60, 30, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-accent/15 blur-[140px]"
        animate={reduce ? undefined : { x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <DotPattern
        className="text-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
        width={32}
        height={32}
        cr={1.4}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary-light">
            Proces
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white">
            Twoja strona online{" "}
            <span className="text-gradient-shimmer">w 14 dni</span>
          </h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            Od pierwszej rozmowy do uruchomienia produkcyjnego. Bez ukrytych
            kosztów, bez WordPressa, bez kompromisów na wydajności.
          </p>
        </Reveal>

        <div className="max-w-2xl mx-auto mb-20">
          <Terminal title="dekada72h ~ build">
            <TypingAnimation className="text-emerald-400">
              $ ./build-site --client=&quot;Twoja Firma&quot; --type=premium
            </TypingAnimation>
            <AnimatedSpan className="text-gray-400 mt-1">
              Inicjalizacja projektu...
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Discovery + briefing (dni 1-2)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Wireframes + UX (dni 3-5)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Design system + UI (dni 6-8)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Development Next.js + Tailwind (dni 9-11)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ SEO + Schema + Core Web Vitals (dni 12-13)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Launch + analityka + monitoring (dzień 14)
            </AnimatedSpan>
            <AnimatedSpan className="text-gray-400 mt-2">
              Build size: 87KB &nbsp;·&nbsp; LCP: 1.4s &nbsp;·&nbsp; CLS: 0.00
            </AnimatedSpan>
            <TypingAnimation className="text-primary-light mt-2 font-semibold">
              ✨ Gotowe. Strona dostępna na produkcji.
            </TypingAnimation>
          </Terminal>
        </div>

        {/* Sub-heading: live coding visualization */}
        <Reveal className="max-w-2xl mx-auto text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary-light">
            Live coding
          </span>
          <h3 className="mt-3 font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white">
            Linijka po linijce, live{" "}
            <span className="text-gradient-primary">na Twoich oczach</span>
          </h3>
          <p className="mt-4 text-base text-white/65 leading-relaxed">
            Piszemy własny, czysty kod &mdash; bez WordPressa, bez build-erów AI.
            Zobacz fragment standardowego HTML + CSS w akcji.
          </p>
        </Reveal>

        <CodeEditorPreview />
      </div>
    </section>
  );
}
