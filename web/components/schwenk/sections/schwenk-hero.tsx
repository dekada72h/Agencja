"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Magnetic } from "../magnetic";
import { useCursor } from "../cursor-context";
import { SplitText } from "../split-text";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SchwenkHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const figureY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const { setVariant } = useCursor();

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center pt-32 pb-20 overflow-hidden"
    >
      {/* Animated parchment-tone background blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sk-paper-warm) 0%, transparent 70%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 right-1/4 w-[34rem] h-[34rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sk-rose) 0%, transparent 70%)" }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-[1280px] px-6 lg:px-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center w-full"
      >
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] font-medium"
          >
            Malarstwo · Rysunek · Sztuki Wizualne
          </motion.span>

          <h1 className="mt-6 font-cormorant italic text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] text-[var(--sk-ink)]">
            <SplitText text="Sztuka jako" stagger={0.04} duration={0.7} />
            <br />
            <span className="not-italic relative inline-block">
              <SplitText text="cisza" className="text-[var(--sk-rose-deep)]" stagger={0.04} duration={0.7} delay={0.3} />
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
                style={{ transformOrigin: "left" }}
                className="absolute -bottom-2 left-0 right-0 h-px bg-[var(--sk-rose-deep)]/40"
              />
            </span>{" "}
            <SplitText text="która patrzy" stagger={0.04} duration={0.7} delay={0.5} />
            <br />
            <SplitText text="w światło." stagger={0.04} duration={0.7} delay={0.75} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--sk-muted)]"
          >
            Tworzę obrazy i rysunki, w których światło, kolor i linia opowiadają to,
            czego nie da się ująć słowami. Każda praca jest zapisem chwili —
            konkretnej i nieuchwytnej zarazem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Magnetic strength={0.25}>
              <Link
                href="/portfolio/Katarzyna-Schwenk/galeria"
                onMouseEnter={() => setVariant("magnet")}
                onMouseLeave={() => setVariant("default")}
                className="inline-block px-7 py-3.5 bg-[var(--sk-ink)] text-[var(--sk-cream)] text-[11px] tracking-[0.25em] uppercase font-medium border border-[var(--sk-ink)] hover:bg-transparent hover:text-[var(--sk-ink)] transition-colors duration-500"
              >
                Zobacz galerię
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="/portfolio/Katarzyna-Schwenk/o-mnie"
                onMouseEnter={() => setVariant("magnet")}
                onMouseLeave={() => setVariant("default")}
                className="inline-block px-7 py-3.5 text-[var(--sk-ink)] text-[11px] tracking-[0.25em] uppercase font-medium border border-[var(--sk-ink)] hover:bg-[var(--sk-ink)] hover:text-[var(--sk-cream)] transition-colors duration-500"
              >
                O mnie
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Hero figure: artwork placeholder with offset accent */}
        <motion.div style={{ y: figureY }} className="relative aspect-[4/5] mx-auto w-full max-w-[460px]">
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
            className="absolute -inset-4 -top-2 -bottom-2 left-4 right-4 -z-10"
            style={{ background: "var(--sk-rose)", opacity: 0.18 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
            className="relative h-full w-full overflow-hidden border border-[var(--sk-line)] bg-gradient-to-br from-[var(--sk-paper-warm)] via-[var(--sk-paper-deep)] to-[var(--sk-sand)]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="font-cormorant italic text-4xl text-[var(--sk-rose-deep)] leading-tight"
                >
                  Praca zostanie
                  <br />
                  wkrótce zaprezentowana
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[var(--sk-muted)]">
                  <span className="block w-8 h-px bg-[var(--sk-rose-deep)]/60" />
                  Olej · 2025
                </div>
              </div>
            </div>
            {/* edge glow */}
            <div className="absolute inset-0 ring-1 ring-inset ring-[var(--sk-rose-deep)]/10 pointer-events-none" />
          </motion.div>

          {/* corner mark */}
          <motion.span
            initial={{ opacity: 0, rotate: -10, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 220, damping: 18 }}
            className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-[var(--sk-ink)] text-[var(--sk-cream)] flex items-center justify-center text-[9px] tracking-[0.2em] uppercase font-cormorant italic"
            style={{ transform: "rotate(8deg)" }}
          >
            <span className="text-center leading-tight not-italic">
              No.
              <br />
              001
            </span>
          </motion.span>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[var(--sk-rose-deep)]"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase">Przewiń</span>
        <motion.span
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="block w-px h-12 bg-current"
        />
      </motion.div>
    </section>
  );
}
