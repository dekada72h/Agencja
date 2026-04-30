"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCursor } from "./cursor-context";
import { Magnetic } from "./magnetic";

export function PortfolioBanner() {
  const { setVariant } = useCursor();
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 max-md:left-0 max-md:right-0 max-md:bottom-0"
    >
      <Magnetic strength={0.15}>
        <div
          onMouseEnter={() => setVariant("magnet")}
          onMouseLeave={() => setVariant("default")}
          className="bg-[var(--sk-ink)] text-[var(--sk-cream)] px-5 py-3 text-[10px] tracking-[0.25em] uppercase border-l-2 border-[var(--sk-rose)] max-md:flex max-md:items-center max-md:justify-center max-md:gap-3 max-md:border-l-0 max-md:border-t-2 max-md:py-3"
        >
          Pokaz portfolio
          <Link
            href="/portfolio"
            className="ml-2 text-[var(--sk-rose)] hover:text-[var(--sk-cream)] transition-colors"
          >
            ← powrót
          </Link>
        </div>
      </Magnetic>
    </motion.aside>
  );
}
