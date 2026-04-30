"use client";

import { TiltCard } from "../tilt-card";
import { BlurReveal } from "../blur-reveal";
import { Parallax } from "../parallax";
import { SchReveal } from "../reveal";
import { AnimatedLine } from "../animated-line";

type Work = {
  title: string;
  meta: string;
  size: "tall" | "wide" | "square";
  bg: string;
};

const works: Work[] = [
  { title: "Portret w sepii", meta: "50 × 70 cm · 2025", size: "square",
    bg: "linear-gradient(135deg, #d4c5a9 0%, #b58a7a 60%, #8d5e4f 100%)" },
  { title: "Cisza poranna", meta: "40 × 80 cm · 2025", size: "tall",
    bg: "linear-gradient(170deg, #faf6ee 0%, #ede5d6 50%, #d4c5a9 100%)" },
  { title: "Studium III", meta: "50 × 60 cm · 2024", size: "square",
    bg: "linear-gradient(135deg, #1f1d1a 0%, #6b6258 70%, #d4c5a9 100%)" },
  { title: "Pejzaż wieczorny", meta: "120 × 60 cm · 2025", size: "wide",
    bg: "linear-gradient(180deg, #5e1f1f 0%, #8d5e4f 50%, #d4c5a9 100%)" },
  { title: "Kobieta przy oknie", meta: "60 × 80 cm · 2024", size: "square",
    bg: "linear-gradient(135deg, #ede5d6 0%, #b58a7a 60%, #1f1d1a 100%)" },
  { title: "Bez tytułu", meta: "50 × 50 cm · 2023", size: "square",
    bg: "linear-gradient(160deg, #d4c5a9 0%, #8d5e4f 50%, #1f1d1a 100%)" },
];

export function OilGallery() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <SchReveal className="text-center mb-16">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] mb-5">
            Olej · płótno
          </span>
          <h2 className="font-cormorant text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--sk-ink)] leading-[1.1]">
            <em className="text-[var(--sk-rose-deep)]">Malarstwo</em> olejne
          </h2>
          <div className="flex justify-center mt-6 text-[var(--sk-rose-deep)]">
            <AnimatedLine width={48} />
          </div>
        </SchReveal>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-5 lg:gap-6">
          {works.map((w, i) => {
            const span =
              w.size === "wide" ? "sm:col-span-4 aspect-[4/3]" :
              w.size === "tall" ? "sm:col-span-2 sm:row-span-2 aspect-[3/5]" :
              "sm:col-span-2 aspect-[3/4]";
            const offset = i % 2 === 0 ? -50 : -90;

            return (
              <Parallax key={w.title} offset={offset} className={`${span} group`}>
                <BlurReveal delay={i * 0.05}>
                  <TiltCard cursorVariant="view" className="relative w-full h-full overflow-hidden">
                    <div aria-hidden className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]" style={{ background: w.bg }} />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <div className="font-cormorant italic text-2xl md:text-3xl text-white/80 mix-blend-overlay">
                        {w.title}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-7">
                      <div>
                        <h3 className="font-cormorant italic text-2xl md:text-3xl text-[var(--sk-cream)]">
                          {w.title}
                        </h3>
                        <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[var(--sk-paper-warm)]">
                          {w.meta}
                        </p>
                      </div>
                    </div>
                    <span className="absolute top-4 left-4 font-cormorant italic text-xs text-white/70 mix-blend-difference">
                      {String(i + 1).padStart(2, "0")}
                    </span>
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
