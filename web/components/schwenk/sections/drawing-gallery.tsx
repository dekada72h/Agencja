"use client";

import { TiltCard } from "../tilt-card";
import { BlurReveal } from "../blur-reveal";
import { Parallax } from "../parallax";
import { SchReveal } from "../reveal";
import { AnimatedLine } from "../animated-line";

type Drawing = {
  title: string;
  meta: string;
  bg: string;
  size?: "tall" | "square";
};

const drawings: Drawing[] = [
  { title: "Studium dłoni", meta: "Węgiel · A3 · 2024",
    bg: "linear-gradient(160deg, #faf6ee 0%, #d4c5a9 60%, #6b6258 100%)" },
  { title: "Twarz I", meta: "Tusz · 30×40 cm · 2024",
    bg: "linear-gradient(180deg, #ede5d6 0%, #1f1d1a 100%)" },
  { title: "Postać siedząca", meta: "Węgiel · A2 · 2023", size: "tall",
    bg: "linear-gradient(170deg, #1f1d1a 0%, #6b6258 50%, #d4c5a9 100%)" },
  { title: "Szkic poranny", meta: "Ołówek · A4 · 2025",
    bg: "linear-gradient(160deg, #faf6ee 0%, #ede5d6 70%, #d4c5a9 100%)" },
  { title: "Studium ruchu", meta: "Tusz · A3 · 2024",
    bg: "linear-gradient(135deg, #d4c5a9 0%, #8d5e4f 70%, #1f1d1a 100%)" },
  { title: "Bez tytułu", meta: "Mieszane · 2023",
    bg: "linear-gradient(160deg, #b58a7a 0%, #6b6258 50%, #1f1d1a 100%)" },
];

export function DrawingGallery() {
  return (
    <section className="bg-[var(--sk-paper)] py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <SchReveal className="text-center mb-16">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] mb-5">
            Węgiel · tusz · papier
          </span>
          <h2 className="font-cormorant text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--sk-ink)] leading-[1.1]">
            <em className="text-[var(--sk-rose-deep)]">Rysunek</em>
          </h2>
          <div className="flex justify-center mt-6 text-[var(--sk-rose-deep)]">
            <AnimatedLine width={48} />
          </div>
        </SchReveal>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-5 lg:gap-6">
          {drawings.map((d, i) => {
            const span =
              d.size === "tall" ? "sm:col-span-2 sm:row-span-2 aspect-[3/5]" : "sm:col-span-2 aspect-[3/4]";
            const offset = i % 2 === 0 ? -40 : -70;
            return (
              <Parallax key={d.title} offset={offset} className={`${span} group`}>
                <BlurReveal delay={i * 0.05}>
                  <TiltCard cursorVariant="view" className="relative w-full h-full overflow-hidden">
                    <div aria-hidden className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]" style={{ background: d.bg }} />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <div className="font-cormorant italic text-2xl text-white/75 mix-blend-overlay">
                        {d.title}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-7">
                      <div>
                        <h3 className="font-cormorant italic text-2xl text-[var(--sk-cream)]">{d.title}</h3>
                        <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[var(--sk-paper-warm)]">
                          {d.meta}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </BlurReveal>
              </Parallax>
            );
          })}
        </div>
      </div>
    </section>
  );
}
