"use client";

import { motion } from "motion/react";
import { SchReveal } from "../reveal";
import { AnimatedLine } from "../animated-line";

export function InstagramStrip() {
  return (
    <section className="relative bg-[var(--sk-paper)] py-24 lg:py-32 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--sk-sand) 0%, transparent 70%)" }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[820px] px-6 lg:px-10 text-center">
        <SchReveal>
          <div className="flex justify-center text-[var(--sk-rose-deep)] mb-10">
            <AnimatedLine width={64} />
          </div>
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-[var(--sk-rose-deep)] mb-5">
            ↓ z pracowni
          </span>
          <h2 className="font-cormorant italic text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--sk-ink)] leading-[1.1]">
            Codzienność{" "}
            <span className="not-italic text-[var(--sk-rose-deep)]">w pracowni</span>
          </h2>
        </SchReveal>

        <SchReveal delay={0.2}>
          <p className="mt-6 text-lg text-[var(--sk-muted)] leading-relaxed">
            Szkice, fragmenty obrazów, proces twórczy — najnowsze prace na Instagramie.
          </p>
        </SchReveal>

        <SchReveal delay={0.35}>
          <p className="mt-10 font-cormorant italic text-3xl md:text-4xl text-[var(--sk-rose-deep)]">
            @katarzyna_schwenk_art
          </p>
        </SchReveal>

        <SchReveal delay={0.5}>
          <p className="mt-4 text-xs italic text-[var(--sk-muted)]">
            Profil zostanie podlinkowany wkrótce.
          </p>
        </SchReveal>
      </div>
    </section>
  );
}
