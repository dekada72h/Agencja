"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * TiltCard — wraps children in a 3D-tilt container that responds to
 * pointer position, with an optional glare highlight that follows the
 * cursor. Respects prefers-reduced-motion.
 *
 * Use `intensity` to scale the tilt angle (degrees). 6-10 feels good
 * for portfolio cards, 4-6 for service cards.
 */
type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  glareOpacity?: number;
};

export function TiltCard({
  children,
  className,
  intensity = 8,
  glare = true,
  glareOpacity = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const spring = { stiffness: 260, damping: 22, mass: 0.5 };
  const sRX = useSpring(rotateX, spring);
  const sRY = useSpring(rotateY, spring);

  // Glare gradient position — convert -0.5..0.5 to 0..100%
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,${glareOpacity}), transparent 55%)`,
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={handleLeave}
      style={{
        rotateX: reduce ? 0 : sRX,
        rotateY: reduce ? 0 : sRY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      className={cn("relative", className)}
    >
      {children}
      {glare && !reduce && (
        <motion.div
          aria-hidden
          style={{
            background: glareBg,
            opacity: hovering ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
          className="absolute inset-0 rounded-[inherit] pointer-events-none mix-blend-overlay"
        />
      )}
    </motion.div>
  );
}
