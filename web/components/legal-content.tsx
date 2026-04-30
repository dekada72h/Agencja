"use client";

import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function LegalContent({
  lastUpdated,
  children,
}: {
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-[860px] px-6 lg:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-10 pb-6 border-b border-gray-100">
            {lastUpdated}
          </p>
          <div
            className="
              prose prose-slate max-w-none
              [&>h2]:font-display [&>h2]:font-semibold [&>h2]:text-2xl [&>h2]:text-ink [&>h2]:mt-12 [&>h2]:mb-4
              [&>h3]:font-display [&>h3]:font-semibold [&>h3]:text-lg [&>h3]:text-ink [&>h3]:mt-8 [&>h3]:mb-3
              [&>p]:text-base [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6 [&>ul>li]:text-gray-700
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-6 [&>ol>li]:text-gray-700
              [&>p>strong]:text-ink
              [&>ul>li>strong]:text-ink
            "
          >
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
