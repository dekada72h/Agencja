"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function Callout({
  variant = "info",
  children,
}: {
  variant?: "info" | "warning" | "tip";
  children: ReactNode;
}) {
  const styles = {
    info: "bg-primary/5 border-l-primary text-ink",
    warning: "bg-amber-50 border-l-amber-500 text-amber-900",
    tip: "bg-emerald-50 border-l-emerald-500 text-emerald-900",
  } as const;
  return (
    <Reveal>
      <aside className={`my-8 rounded-r-xl border-l-4 px-6 py-5 ${styles[variant]}`}>
        {children}
      </aside>
    </Reveal>
  );
}
