"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Children fade from blurred + slightly scaled up to sharp + 1× as they enter
// the viewport. The blur trick reads as "developing photograph" — premium feel.

export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 1.1,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(18px)", scale: 1.04 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
