"use client";

import { motion, useTransform, useMotionTemplate } from "motion/react";
import { useCursor } from "./cursor-context";
import { useEffect, useState } from "react";

// Spotlight that follows cursor: a radial gradient mask over a section's
// content. Use as a sibling div with absolute positioning. Fades to
// transparent at the edges.

export function Spotlight({
  className,
  size = 480,
  color = "rgba(181, 138, 122, 0.18)",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const { x, y } = useCursor();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setEnabled(!mq.matches);
  }, []);

  const cx = useTransform(x, (v) => `${v}px`);
  const cy = useTransform(y, (v) => `${v}px`);
  const bg = useMotionTemplate`radial-gradient(${size}px circle at ${cx} ${cy}, ${color}, transparent 70%)`;

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ background: bg }}
      className={`pointer-events-none fixed inset-0 z-[2] ${className ?? ""}`}
    />
  );
}
