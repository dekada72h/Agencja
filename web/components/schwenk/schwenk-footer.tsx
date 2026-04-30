"use client";

import Link from "next/link";
import { Magnetic } from "./magnetic";
import { useCursor } from "./cursor-context";
import { AnimatedLine } from "./animated-line";
import { SchReveal } from "./reveal";

export function SchwenkFooter() {
  const { setVariant } = useCursor();
  return (
    <footer className="relative bg-[var(--sk-ink)] text-[var(--sk-paper-warm)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, var(--sk-rose-deep) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--sk-sand) 0%, transparent 35%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10 pt-24 pb-10">
        <SchReveal className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--sk-rose)] mb-5">
            ↓ Pracownia
          </p>
          <h3 className="font-cormorant italic text-4xl md:text-5xl lg:text-6xl text-[var(--sk-cream)] leading-[1.1]">
            Każdy obraz powstaje
            <br />w <span className="not-italic text-[var(--sk-rose)]">rozmowie</span>.
          </h3>
        </SchReveal>

        <div className="mt-16 flex justify-center text-[var(--sk-rose-deep)]">
          <AnimatedLine width={120} />
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--sk-rose)] mb-3">
              Pracownia
            </div>
            <p className="font-cormorant text-2xl text-[var(--sk-cream)]">
              Wrocław
            </p>
            <p className="text-[var(--sk-paper-warm)]/70 mt-1">
              Zwiedzanie po umówieniu
            </p>
          </div>

          <div className="text-center">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--sk-rose)] mb-3">
              Kontakt
            </div>
            <Magnetic strength={0.2}>
              <a
                href="mailto:katarzyna.schwenk@example.com"
                onMouseEnter={() => setVariant("magnet")}
                onMouseLeave={() => setVariant("default")}
                className="font-cormorant italic text-2xl text-[var(--sk-cream)] hover:text-[var(--sk-rose)] transition-colors"
              >
                napisz wiadomość
              </a>
            </Magnetic>
          </div>

          <div className="text-right md:text-right">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--sk-rose)] mb-3">
              Instagram
            </div>
            <p className="font-cormorant italic text-2xl text-[var(--sk-cream)]">
              @katarzyna_schwenk_art
            </p>
            <p className="text-[var(--sk-paper-warm)]/70 mt-1 text-xs italic">
              wkrótce
            </p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-[var(--sk-sand)]">
          <span>© 2026 Katarzyna Schwenk. Wszystkie prawa zastrzeżone.</span>
          <span>
            Strona zrealizowana przez{" "}
            <Link
              href="/portfolio"
              onMouseEnter={() => setVariant("magnet")}
              onMouseLeave={() => setVariant("default")}
              className="text-[var(--sk-rose)] hover:text-[var(--sk-cream)] transition-colors"
            >
              Dekada72H
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
