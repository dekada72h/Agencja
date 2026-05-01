"use client";

import { Reveal } from "@/components/reveal";
import { ScoreRing } from "@/components/ui/score-ring";

const SCORES: Array<{
  label: string;
  value: number;
  color: string;
  delay: number;
}> = [
  { label: "Performance", value: 98, color: "#10b981", delay: 0 }, // emerald-500
  { label: "SEO", value: 100, color: "#6366f1", delay: 0.15 }, // primary / indigo-500
  { label: "Accessibility", value: 100, color: "#0ea5e9", delay: 0.3 }, // secondary / sky-500
  { label: "Best Practices", value: 100, color: "#f59e0b", delay: 0.45 }, // accent / amber-500
];

export function LighthouseScores() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Wydajność
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            Wszystkie nasze strony przechodzą{" "}
            <span className="text-gradient-shimmer">Lighthouse w 100%</span>
          </h2>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Performance, SEO, dostępność, best practices — żaden kompromis.
            Każda strona, którą publikujemy, ma w Google PageSpeed Insights
            wyniki, którymi większość konkurencji może tylko marzyć.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 justify-items-center">
            {SCORES.map((s) => (
              <ScoreRing
                key={s.label}
                label={s.label}
                value={s.value}
                color={s.color}
                delay={s.delay}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-16 max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Test wykonany na ostatnim wdrożeniu (
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-ink text-xs font-mono">
              sklepy-internetowe-wroclaw.html
            </code>
            ). Twoje wyniki będą takie same albo lepsze.
          </p>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Real Lighthouse score — nie nasze marketing claims.
            <br />
            Każdy klient dostaje raport po wdrożeniu.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
