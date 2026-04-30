"use client";

import { motion, useReducedMotion } from "motion/react";

// Decorative drawn-on-scroll horizontal line — used as section divider.
// Animates pathLength from 0 to 1 when in view.

export function AnimatedLine({
  width = 80,
  className,
  vertical = false,
}: {
  width?: number;
  className?: string;
  vertical?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <svg
      aria-hidden
      width={vertical ? "1" : width}
      height={vertical ? width : "1"}
      viewBox={vertical ? `0 0 1 ${width}` : `0 0 ${width} 1`}
      className={className}
    >
      <motion.line
        x1={0}
        y1={0}
        x2={vertical ? 0 : width}
        y2={vertical ? width : 0}
        stroke="currentColor"
        strokeWidth={1}
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
