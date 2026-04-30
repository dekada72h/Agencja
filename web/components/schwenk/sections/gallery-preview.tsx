"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { TiltCard } from "../tilt-card";
import { BlurReveal } from "../blur-reveal";
import { Parallax } from "../parallax";
import { SchReveal } from "../reveal";
import { SplitText } from "../split-text";
import { AnimatedLine } from "../animated-line";
import { useCursor } from "../cursor-context";
import { Magnetic } from "../magnetic";

type Work = {
  title: string;
  meta: string;
  size: "tall" | "wide" | "square";
  bg: string; // gradient
};

const works: Work[] = [
  {
    title: "Portret w sepii",
    meta: "Olej na płótnie · 2025",
    size: "square",
    bg: "linear-gradient(135deg, #d4c5a9 0%, #b58a7a 60%, #8d5e4f 100%)",
  },
  {
    title: "Studium światła",
    meta: "Rysunek · węgiel · 2024",
    size: "tall",
    bg: "linear-gradient(160deg, #1f1d1a 0%, #6b6258 60%, #d4c5a9 100%)",
  },
  {
    title: "Bez tytułu",
    meta: "Akryl · 2024",
    size: "square",
    bg: "linear-gradient(135deg, #ede5d6 0%, #d4c5a9 50%, #8d5e4f 100%)",
  },
  {
    title: "Pejzaż wieczorny",
    meta: "Olej · 2025",
    size: "wide",
    bg: "linear-gradient(180deg, #5e1f1f 0%, #8d5e4f 50%, #d4c5a9 100%)",
  },
  {
    title: "Ręce",
    meta: "Tusz · papier · 2023",
    size: "square",
    bg: "linear-gradient(160deg, #faf6ee 0%, #d4c5a9 70%, #1f1d1a 100%)",
  },
];

export function GalleryPreview() {
  const { setVariant } = useCursor();

  return (
    <section className="py-28 lg:py-36 relative">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <SchReveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] mb-6">
            Wybrane prace
          </span>
          <h2 className="font-cormorant italic text-[clamp(2rem,4.5vw,3.75rem)] text-[var(--sk-ink)] leading-[1.1]">
            Fragmenty <span className="not-italic text-[var(--sk-rose-deep)]">portfolio</span>
          </h2>
          <div className="flex justify-center mt-8 text-[var(--sk-rose-deep)]">
            <AnimatedLine width={64} />
          </div>
          <p className="mt-8 text-lg text-[var(--sk-muted)] leading-relaxed">
            Płótna olejne, rysunek węglem i tuszem, kompozycje na papierze.
            Galeria jest stale uzupełniana o nowe prace.
          </p>
        </SchReveal>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-5 lg:gap-6">
          {works.map((w, i) => {
            const span =
              w.size === "wide"
                ? "sm:col-span-4 sm:row-span-1 aspect-[4/3]"
                : w.size === "tall"
                ? "sm:col-span-2 sm:row-span-2 aspect-[3/5]"
                : "sm:col-span-2 aspect-[3/4]";
            const parallaxOffset = i % 2 === 0 ? -40 : -80;
            return (
              <Parallax key={w.title} offset={parallaxOffset} className={`${span} group`}>
                <BlurReveal delay={i * 0.06}>
                  <TiltCard
                    cursorVariant="view"
                    className="relative w-full h-full overflow-hidden"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                      style={{ background: w.bg }}
                    />
                    {/* edge frame */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
                    {/* placeholder typography */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <div className="font-cormorant italic text-2xl md:text-3xl text-white/85 mix-blend-overlay">
                        {w.title}
                      </div>
                    </div>
                    {/* overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-7">
                      <div>
                        <h3 className="font-cormorant italic text-2xl md:text-3xl text-[var(--sk-cream)]">
                          {w.title}
                        </h3>
                        <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[var(--sk-paper-warm)]">
                          {w.meta}
                        </p>
                      </div>
                    </div>
                    {/* corner index */}
                    <span className="absolute top-4 left-4 font-cormorant italic text-xs text-white/70 mix-blend-difference">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </TiltCard>
                </BlurReveal>
              </Parallax>
            );
          })}
        </div>

        <SchReveal className="text-center mt-20">
          <Magnetic strength={0.22}>
            <Link
              href="/portfolio/Katarzyna-Schwenk/galeria"
              onMouseEnter={() => setVariant("magnet")}
              onMouseLeave={() => setVariant("default")}
              className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--sk-ink)] text-[11px] tracking-[0.3em] uppercase text-[var(--sk-ink)] hover:bg-[var(--sk-ink)] hover:text-[var(--sk-cream)] transition-colors duration-500"
            >
              Pełna galeria
              <motion.span
                aria-hidden
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </Magnetic>
        </SchReveal>
      </div>
    </section>
  );
}
