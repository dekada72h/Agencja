"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SplitText } from "../split-text";
import { useCursor } from "../cursor-context";

export function GaleriaHero() {
  const { setVariant } = useCursor();
  return (
    <section className="pt-44 lg:pt-52 pb-12 relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-32 left-0 w-[40rem] h-[40rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sk-rose) 0%, transparent 70%)" }}
        animate={{ x: [0, 80, 0], y: [0, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-[820px] px-6 lg:px-10 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)]"
        >
          Galeria prac
        </motion.span>
        <h1 className="mt-6 font-cormorant italic text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-[var(--sk-ink)]">
          <SplitText text="Obraz," stagger={0.05} duration={0.7} />
          {" "}
          <span className="not-italic text-[var(--sk-rose-deep)]">
            <SplitText text="rysunek" stagger={0.05} duration={0.7} delay={0.2} />
          </span>
          ,
          <br />
          <SplitText text="papier." stagger={0.05} duration={0.7} delay={0.4} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 text-lg text-[var(--sk-muted)] leading-relaxed"
        >
          Galeria jest stale uzupełniana o nowe prace. Część obrazów dostępna w sprzedaży —
          w celu zapytania o cenę i dostępność{" "}
          <Link
            href="/portfolio/Katarzyna-Schwenk/kontakt"
            onMouseEnter={() => setVariant("magnet")}
            onMouseLeave={() => setVariant("default")}
            className="text-[var(--sk-rose-deep)] border-b border-current hover:text-[var(--sk-ink)] transition-colors"
          >
            napisz wiadomość
          </Link>
          .
        </motion.p>
      </div>
    </section>
  );
}
