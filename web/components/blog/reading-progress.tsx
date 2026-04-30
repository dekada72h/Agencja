"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: x, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-gradient-primary"
    />
  );
}
