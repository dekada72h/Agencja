"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  springStiffness?: number;
  springDamping?: number;
};

/**
 * Magnetic Button — pointer-tracking pull effect.
 * Wrap any clickable element. Respects prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  springStiffness = 220,
  springDamping = 18,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const reduce = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: springStiffness, damping: springDamping });
  const y = useSpring(mvY, { stiffness: springStiffness, damping: springDamping });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mvX.set((e.clientX - cx) * strength);
    mvY.set((e.clientY - cy) * strength);
  }

  function handleLeave() {
    mvX.set(0);
    mvY.set(0);
    setIsHovering(false);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={handleLeave}
      style={{ x: reduce ? 0 : x, y: reduce ? 0 : y }}
      className={className}
      data-magnetic-hovering={isHovering ? "true" : undefined}
    >
      {children}
    </motion.div>
  );
}
