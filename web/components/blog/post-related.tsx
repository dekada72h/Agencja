"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Arrow } from "@/components/icons";
import type { BlogRelated } from "@/lib/blog";

export function PostRelated({ items }: { items: BlogRelated[] }) {
  if (!items.length) return null;
  return (
    <section className="my-16 lg:my-20 border-t border-gray-100 pt-16">
      <Reveal>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mb-2">
          Przeczytaj również
        </h2>
        <p className="text-gray-600 mb-8">Inne artykuły, które mogą Cię zainteresować.</p>
      </Reveal>
      <StaggerChildren className="grid sm:grid-cols-3 gap-5">
        {items.map((it) => (
          <StaggerItem key={it.href}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="h-full"
            >
              <Link
                href={it.href as never}
                className="block h-full rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-glow hover:border-primary/20 transition-shadow"
              >
                {it.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {it.category}
                  </span>
                )}
                <h3 className="mt-3 font-display font-semibold text-base text-ink leading-snug">
                  {it.title}
                </h3>
                {it.excerpt && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {it.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Czytaj
                  <Arrow className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
