"use client";

import { motion } from "motion/react";
import { SplitText } from "../split-text";

export function OmnieHero() {
  return (
    <section className="pt-44 lg:pt-52 pb-12 relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sk-paper-warm) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-[760px] px-6 lg:px-10 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)]"
        >
          O artystce
        </motion.span>
        <h1 className="mt-6 font-cormorant italic text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-[var(--sk-ink)]">
          <SplitText text="Między" stagger={0.05} duration={0.7} />{" "}
          <span className="not-italic text-[var(--sk-rose-deep)]">
            <SplitText text="linią" stagger={0.05} duration={0.7} delay={0.2} />
          </span>
          <br />
          <SplitText text="a światłem." stagger={0.05} duration={0.7} delay={0.4} />
        </h1>
      </div>
    </section>
  );
}
