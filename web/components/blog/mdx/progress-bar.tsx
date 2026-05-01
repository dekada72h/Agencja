"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * ProgressBar — animated horizontal bar with synchronized number counter.
 * Use inline in blog posts to visualize stats.
 *
 * <ProgressBar value={67} label="wzrost e-commerce w PL 2022-2026" suffix="%" />
 */
export function ProgressBar({
  value,
  label,
  suffix = "%",
  color = "primary",
  max = 100,
}: {
  value: number;
  label: string;
  suffix?: string;
  color?: "primary" | "secondary" | "emerald" | "amber" | "rose";
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(reduce ? value : 0);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colorMap = {
    primary: { bar: "from-primary to-secondary", text: "text-primary" },
    secondary: { bar: "from-secondary to-primary-light", text: "text-secondary" },
    emerald: { bar: "from-emerald-500 to-emerald-400", text: "text-emerald-600" },
    amber: { bar: "from-amber-500 to-amber-400", text: "text-amber-600" },
    rose: { bar: "from-rose-500 to-rose-400", text: "text-rose-600" },
  };
  const c = colorMap[color];

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplayValue(value);
      return;
    }
    const controls = animate(mv, value, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, reduce, value, mv, rounded]);

  return (
    <div ref={ref} className="not-prose my-4">
      <div className="flex items-baseline justify-between mb-2 gap-3">
        <span className="text-sm text-gray-700 leading-snug">{label}</span>
        <span className={`font-display font-bold text-lg ${c.text} tabular-nums`}>
          {displayValue}
          {suffix}
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${c.bar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
