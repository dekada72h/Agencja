"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useCursor } from "./cursor-context";

// Premium custom cursor: subtle dot + halo that morphs over interactive elements.
// On touch devices, hides itself entirely. Honors prefers-reduced-motion.

export function SmoothCursor() {
  const { x, y, variant } = useCursor();
  const reduced = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const onChange = () => setIsTouch(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const haloX = useSpring(x, { damping: 22, stiffness: 180, mass: 0.6 });
  const haloY = useSpring(y, { damping: 22, stiffness: 180, mass: 0.6 });
  const dotX = useSpring(x, { damping: 28, stiffness: 700, mass: 0.3 });
  const dotY = useSpring(y, { damping: 28, stiffness: 700, mass: 0.3 });

  if (isTouch || reduced) return null;

  const haloSize = variant === "view" ? 120 : variant === "magnet" ? 80 : 36;
  const haloOpacity = variant === "view" ? 0.95 : variant === "magnet" ? 0.6 : 0.35;
  const haloLabel = variant === "view" ? "Zobacz" : null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
        style={{ translateX: dotX, translateY: dotY }}
      >
        <span
          className="block w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99]"
        style={{ translateX: haloX, translateY: haloY }}
      >
        <motion.div
          animate={{
            width: haloSize,
            height: haloSize,
            opacity: haloOpacity,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-current text-[var(--sk-rose)] flex items-center justify-center backdrop-blur-[2px]"
        >
          {haloLabel && (
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-90">
              {haloLabel}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
