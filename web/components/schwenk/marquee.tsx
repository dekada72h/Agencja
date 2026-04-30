"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Infinite horizontal marquee. Duplicates content twice and translates -50%
// to create a seamless loop. CSS gap controls spacing between items.

export function Marquee({
  children,
  speed = 40,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  speed?: number; // seconds for one full loop
  className?: string;
  pauseOnHover?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex flex-nowrap items-center w-max group"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={pauseOnHover ? undefined : undefined}
        whileHover={pauseOnHover ? { transition: { duration: 0 } } : undefined}
      >
        <MarqueeRow>{children}</MarqueeRow>
        <MarqueeRow ariaHidden>{children}</MarqueeRow>
      </motion.div>
    </div>
  );
}

function MarqueeRow({
  children,
  ariaHidden,
}: {
  children: ReactNode;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex flex-nowrap items-center"
      aria-hidden={ariaHidden ? true : undefined}
    >
      {children}
    </div>
  );
}
