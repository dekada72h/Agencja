"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  label: string;
  color?: string;
  size?: number;
  delay?: number;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 1.6;

/**
 * ScoreRing — animated circular progress ring with synchronized number counter.
 * Triggers on viewport entry (once). Respects prefers-reduced-motion.
 */
export function ScoreRing({
  value,
  label,
  color = "var(--color-primary)",
  size = 140,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  // Clamp value to [0,100]
  const clamped = Math.max(0, Math.min(100, value));

  // Geometry
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - clamped / 100);

  // Number counter — useMotionValue + animate, render rounded
  const counter = useMotionValue(reduced ? clamped : 0);
  const rounded = useTransform(counter, (v) => Math.round(v));
  const [display, setDisplay] = useState(reduced ? clamped : 0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(clamped);
      counter.set(clamped);
      return;
    }
    const controls = animate(counter, clamped, {
      duration: DURATION,
      ease: EASE,
      delay,
    });
    return () => controls.stop();
  }, [inView, reduced, clamped, counter, delay]);

  // Render value for the SVG circle (jump-to-final when reduced)
  const ringInitial = reduced ? targetOffset : circumference;
  const ringAnimate = inView ? targetOffset : circumference;

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center", className)}
      role="img"
      aria-label={`${label}: ${clamped} out of 100`}
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block -rotate-90"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {/* Foreground progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: ringInitial }}
            animate={{ strokeDashoffset: ringAnimate }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: DURATION, ease: EASE, delay }
            }
          />
        </svg>

        {/* Number + suffix centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="font-display font-bold text-ink leading-none tabular-nums"
            style={{ fontSize: "2rem" }}
          >
            {display}
          </span>
          <span className="mt-0.5 text-xs font-medium text-gray-500 tracking-wide">
            /100
          </span>
        </div>
      </div>

      <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
        {label}
      </span>
    </div>
  );
}
