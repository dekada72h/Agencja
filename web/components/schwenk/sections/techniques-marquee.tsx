"use client";

import { Marquee } from "../marquee";

const techniques = [
  "Olej na płótnie",
  "Węgiel",
  "Tusz",
  "Akryl",
  "Rysunek figuratywny",
  "Studium światła",
  "Portret",
  "Kompozycja",
  "Pejzaż",
  "Akwarela",
  "Pastela sucha",
  "Media mieszane",
];

export function TechniquesMarquee() {
  return (
    <section className="border-y border-[var(--sk-line)]/60 py-8 bg-[var(--sk-paper)] overflow-hidden">
      <Marquee speed={48}>
        {techniques.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-8 px-6 font-cormorant italic text-3xl md:text-4xl text-[var(--sk-ink)]"
          >
            {t}
            <span aria-hidden className="text-[var(--sk-rose-deep)] text-2xl not-italic">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
