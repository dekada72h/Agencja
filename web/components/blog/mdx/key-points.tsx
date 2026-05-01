"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * KeyPoints — inline highlighted "key takeaways" box, used to break
 * long sections. Different visual from Tldr (which sits at top of post).
 * Use as: <KeyPoints title="Najważniejsze fakty"><li>...</li></KeyPoints>
 */
export function KeyPoints({
  children,
  title = "Najważniejsze",
  variant = "default",
}: {
  children: ReactNode;
  title?: string;
  variant?: "default" | "warning" | "success";
}) {
  const colors = {
    default: { bg: "bg-primary/[0.04]", border: "border-primary/20", text: "text-primary", icon: "📌" },
    success: { bg: "bg-emerald-500/[0.05]", border: "border-emerald-500/25", text: "text-emerald-700", icon: "✅" },
    warning: { bg: "bg-amber-500/[0.06]", border: "border-amber-500/30", text: "text-amber-700", icon: "⚠️" },
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className={`not-prose my-8 rounded-xl border-l-4 ${colors.border} ${colors.bg} px-5 py-4 lg:px-6 lg:py-5`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-xl mt-0.5 select-none">{colors.icon}</span>
        <div className="flex-1">
          <h4 className={`font-display font-semibold text-sm uppercase tracking-wider ${colors.text} mb-2`}>
            {title}
          </h4>
          <div className="text-gray-700 leading-relaxed text-[0.95rem] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:my-0 [&>p]:my-1 [&>p:first-child]:mt-0">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
