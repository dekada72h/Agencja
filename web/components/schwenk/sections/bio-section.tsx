"use client";

import { motion } from "motion/react";
import { BlurReveal } from "../blur-reveal";
import { SchReveal } from "../reveal";
import { Parallax } from "../parallax";

export function BioSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-20 items-start">
          <Parallax offset={-40} className="lg:sticky lg:top-32">
            <BlurReveal>
              <div className="relative aspect-[3/4] overflow-hidden border border-[var(--sk-line)]">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(160deg, #ede5d6 0%, #d4c5a9 50%, #b58a7a 100%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                  <div className="font-cormorant italic text-2xl text-[var(--sk-rose-deep)]/85">
                    Portret artystki
                    <br />
                    <span className="not-italic text-xs tracking-[0.3em] uppercase mt-3 inline-block text-[var(--sk-muted)]">
                      Zdjęcie wkrótce
                    </span>
                  </div>
                </div>
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[var(--sk-rose-deep)]"
                >
                  <span>Wrocław</span>
                  <span className="block w-12 h-px bg-current" />
                  <span>2025</span>
                </motion.span>
              </div>
            </BlurReveal>
          </Parallax>

          <div className="lg:pt-4">
            <SchReveal>
              <h2 className="font-cormorant text-[clamp(2.25rem,4vw,3.5rem)] text-[var(--sk-ink)] leading-[1.05]">
                Maluję, żeby
                <br />
                <em className="text-[var(--sk-rose-deep)]">uważnie patrzeć.</em>
              </h2>
            </SchReveal>

            <div className="mt-10 space-y-6 text-lg leading-[1.75] text-[var(--sk-muted)]">
              <SchReveal delay={0.05}>
                <p className="first-letter:font-cormorant first-letter:text-7xl first-letter:font-medium first-letter:float-left first-letter:leading-[0.9] first-letter:mr-3 first-letter:mt-1 first-letter:text-[var(--sk-rose-deep)]">
                  Jestem malarką i rysowniczką. W mojej pracy najważniejsze jest światło — sposób,
                  w jaki dotyka skóry, materii, krajobrazu. Pracuję głównie w oleju i węglu,
                  ale chętnie sięgam też po tusz, akryl i media mieszane.
                </p>
              </SchReveal>
              <SchReveal delay={0.1}>
                <p>
                  Inspiracji szukam w codzienności: w gestach, w przelotnym wyrazie twarzy,
                  w cieniu, który kładzie się na ścianie późnym popołudniem. Interesuje mnie
                  portret, studium postaci i pejzaż przefiltrowany przez emocję — nie jako
                  dokument, ale jako próba zrozumienia tego, na co patrzę.
                </p>
              </SchReveal>
              <SchReveal delay={0.15}>
                <p>
                  Tworzę powoli. Każdy obraz jest dla mnie rodzajem rozmowy — z modelem,
                  z miejscem, z samą sobą. Dlatego nie produkuję serii &bdquo;na zamówienie&rdquo;
                  — wolę, żeby każda praca powstawała we własnym rytmie.
                </p>
              </SchReveal>
              <SchReveal delay={0.2}>
                <p>
                  W ostatnich latach rozwijam także rysunek figuratywny i krótkie cykle szkicowe.
                  Galeria na tej stronie będzie stopniowo rosła — pokażę zarówno prace wystawiane,
                  jak i fragmenty z pracowni.
                </p>
              </SchReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
