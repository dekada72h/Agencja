"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PageHeader({
  breadcrumb,
  title,
  subtitle,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-0 -right-20 w-[28rem] h-[28rem] rounded-full bg-secondary/12 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500"
        >
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {b.href ? (
                <Link href={b.href as never} className="hover:text-primary transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-ink">{b.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span className="text-gray-300">/</span>}
            </span>
          ))}
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-6 font-display font-bold text-4xl md:text-5xl lg:text-6xl text-ink"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-5 max-w-2xl text-lg text-gray-600"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
}
