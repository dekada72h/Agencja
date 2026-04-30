"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { useCursor } from "./cursor-context";

// 3D tilt card: rotates X/Y based on cursor position relative to card center.
// Includes subtle scale + shadow lift on hover.

export function TiltCard({
  children,
  className,
  intensity = 8, // max degrees
  cursorVariant = "view",
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  cursorVariant?: "view" | "default" | "magnet";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { setVariant } = useCursor();

  const px = useMotionValue(0); // -1..1
  const py = useMotionValue(0);
  const rotX = useTransform(py, [-1, 1], [intensity, -intensity]);
  const rotY = useTransform(px, [-1, 1], [-intensity, intensity]);
  const sx = useSpring(rotX, { stiffness: 220, damping: 22 });
  const sy = useSpring(rotY, { stiffness: 220, damping: 22 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onEnter = () => setVariant(cursorVariant);
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setVariant("default");
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        rotateX: sx,
        rotateY: sy,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
