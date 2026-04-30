"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function CtaBox({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <div className="my-12 rounded-3xl bg-gradient-primary text-white p-8 lg:p-10 shadow-glow">
        <div className="prose prose-invert max-w-none">{children}</div>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink font-semibold hover:bg-ink hover:text-white transition-colors"
        >
          Skontaktuj się
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </Reveal>
  );
}
