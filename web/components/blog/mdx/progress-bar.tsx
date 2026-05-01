"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * ProgressBar — animated horizontal bar with synchronized number counter.
 * Use inline in blog posts to visualize stats.
 *
 * Accepts value as STRING (preferred for MDX) or NUMBER. We use string
 * attributes in MDX because next-mdx-remote loses JSX-expression-as-
 * number/string props through the RSC → client-component path (same
 * bug that affected <Stat number={"X"}>).
 *
 * <ProgressBar value="67" label="wzrost e-commerce" suffix="%" />
 */
export function ProgressBar({
  value,
  label,
  suffix = "%",
  color = "primary",
  max = "100",
}: {
  value: string | number;
  label: string;
  suffix?: string;
  color?: "primary" | "secondary" | "emerald" | "amber" | "rose";
  max?: string | number;
}) {
  const numValue = typeof value === "string" ? Number(value) : value;
  const numMax = typeof max === "string" ? Number(max) : max;
  const safeValue = Number.isFinite(numValue) ? numValue : 0;
  const safeMax = Number.isFinite(numMax) && numMax > 0 ? numMax : 100;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(reduce ? safeValue : 0);
  const pct = Math.min(100, Math.max(0, (safeValue / safeMax) * 100));

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
      setDisplayValue(safeValue);
      return;
    }
    const controls = animate(mv, safeValue, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, reduce, safeValue, mv, rounded]);

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
