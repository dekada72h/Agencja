"use client";

import { motion, type Variants } from "motion/react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE_OUT },
  }),
};

export function HeroStub() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* animated gradient blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/30 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-secondary/25 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 py-32 lg:py-40">
        <motion.span
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-primary"
        >
          Next.js skeleton — Batch 1
        </motion.span>
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight text-ink max-w-4xl"
        >
          Dekada<span className="text-gradient-primary">72H</span> —
          <br />
          szkielet Next.js gotowy.
        </motion.h1>
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg text-gray-600"
        >
          Layout, nawigacja, footer, cookie consent, i18n PL/EN/DE, framer-motion
          aktywne. Treść stron głównych dochodzi w Batch 2.
        </motion.p>
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex flex-wrap gap-3"
        >
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            Next.js 16 · App Router
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            Tailwind v4
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            motion (framer-motion)
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            next-intl PL/EN/DE
          </span>
        </motion.div>
      </div>
    </section>
  );
}
