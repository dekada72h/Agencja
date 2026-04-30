"use client";

import { motion } from "motion/react";
import { SplitText } from "../split-text";

export function KontaktHero() {
  return (
    <section className="pt-44 lg:pt-52 pb-12 relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-32 right-0 w-[40rem] h-[40rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sk-paper-warm) 0%, transparent 70%)" }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-[820px] px-6 lg:px-10 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)]"
        >
          Napisz wiadomość
        </motion.span>
        <h1 className="mt-6 font-cormorant italic text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-[var(--sk-ink)]">
          <SplitText text="Porozmawiajmy" stagger={0.05} duration={0.7} />
          <br />
          <SplitText text="o " stagger={0.05} duration={0.7} delay={0.25} />
          <span className="not-italic text-[var(--sk-rose-deep)]">
            <SplitText text="obrazach" stagger={0.05} duration={0.7} delay={0.4} />
          </span>
          <SplitText text="." stagger={0.05} duration={0.7} delay={0.55} />
        </h1>
      </div>
    </section>
  );
}
