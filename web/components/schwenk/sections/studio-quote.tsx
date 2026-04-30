"use client";

import { SplitWords } from "../split-text";
import { AnimatedLine } from "../animated-line";
import { SchReveal } from "../reveal";

export function StudioQuote() {
  return (
    <section className="bg-[var(--sk-paper)] py-28 lg:py-36 relative">
      <div className="mx-auto max-w-[920px] px-6 lg:px-10 text-center">
        <div className="flex justify-center text-[var(--sk-rose-deep)]">
          <AnimatedLine width={64} />
        </div>
        <blockquote className="mt-10 font-cormorant italic text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.4] text-[var(--sk-ink)]">
          <SplitWords stagger={0.04} duration={0.7}>
            &bdquo;Nie maluję tego, co widzę — maluję to, co zostaje, kiedy długo patrzę.&rdquo;
          </SplitWords>
        </blockquote>
        <SchReveal delay={0.6}>
          <cite className="not-italic mt-8 inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)]">
            — Z notatnika pracownianego
          </cite>
        </SchReveal>
      </div>
    </section>
  );
}
