"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Tldr — styled summary box at the top of a blog post.
 * Use as: <Tldr><li>point 1</li><li>point 2</li></Tldr>
 * Or pass plain children for free-form content.
 */
export function Tldr({ children, title = "TL;DR — w skrócie" }: { children: ReactNode; title?: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="not-prose my-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent p-6 lg:p-7"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span aria-hidden className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-primary text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h3 className="font-display font-bold text-base uppercase tracking-[0.15em] text-ink m-0">
          {title}
        </h3>
      </div>
      <div className="text-gray-700 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:my-0 [&>p]:my-1 [&>p:first-child]:mt-0">
        {children}
      </div>
    </motion.aside>
  );
}
