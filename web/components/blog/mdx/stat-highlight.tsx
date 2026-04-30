"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function StatHighlight({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <div className="my-10 grid sm:grid-cols-3 gap-6 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10 p-8">
        {children}
      </div>
    </Reveal>
  );
}

export function Stat({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="font-display font-bold text-3xl md:text-4xl text-gradient-primary leading-none">
        {number}
      </div>
      <div className="mt-3 text-sm text-gray-600 leading-snug">{children}</div>
    </motion.div>
  );
}
