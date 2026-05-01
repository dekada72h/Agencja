"use client";

import { Reveal } from "@/components/reveal";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/ui/terminal";
import { DotPattern } from "@/components/ui/dot-pattern";

export function ProcessTerminal() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-ink via-ink-soft to-ink overflow-hidden">
      <DotPattern
        className="text-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
        width={32}
        height={32}
        cr={1.4}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary-light">
            Proces
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white">
            Twoja strona online{" "}
            <span className="text-gradient-primary">w 10 dni</span>
          </h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            Od pierwszej rozmowy do uruchomienia produkcyjnego. Bez ukrytych
            kosztów, bez WordPressa, bez kompromisów na wydajności.
          </p>
        </Reveal>

        <div className="max-w-2xl mx-auto">
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
              ✔ Wireframes + UX (dni 3-4)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Design system + UI (dni 5-6)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Development Next.js + Tailwind (dni 7-8)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ SEO + Schema + Core Web Vitals (dzień 9)
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ Launch + analityka + monitoring (dzień 10)
            </AnimatedSpan>
            <AnimatedSpan className="text-gray-400 mt-2">
              Build size: 87KB &nbsp;·&nbsp; LCP: 1.4s &nbsp;·&nbsp; CLS: 0.00
            </AnimatedSpan>
            <TypingAnimation className="text-primary-light mt-2 font-semibold">
              ✨ Gotowe. Strona dostępna na produkcji.
            </TypingAnimation>
          </Terminal>
        </div>
      </div>
    </section>
  );
}
