"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";

export function PostCta() {
  return (
    <Reveal>
      <div className="relative my-16 rounded-3xl bg-gradient-primary text-white p-10 lg:p-14 overflow-hidden shadow-glow">
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative max-w-2xl">
          <h3 className="font-display font-bold text-2xl md:text-3xl">
            Potrzebujesz strony, która naprawdę sprzedaje?
          </h3>
          <p className="mt-4 text-white/85 leading-relaxed">
            Zrobimy ją od zera, ręcznie, pod Twój biznes — szybką, mobilną i zoptymalizowaną pod konwersję.
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-ink font-semibold hover:bg-ink hover:text-white transition-colors"
          >
            Zamów darmową wycenę
            <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
