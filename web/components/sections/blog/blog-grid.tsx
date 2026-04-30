"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { StaggerChildren, StaggerItem } from "@/components/reveal";
import { Arrow } from "@/components/icons";
import type { BlogFrontmatter } from "@/lib/blog";

export function BlogGrid({
  posts,
  readMoreLabel,
}: {
  posts: BlogFrontmatter[];
  readMoreLabel: string;
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, idx) => (
            <StaggerItem key={p.slug}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="h-full rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-glow hover:border-primary/20 transition-shadow"
              >
                <Link href={`/blog/${p.slug}` as never} className="block group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {p.hero_image && (
                      <Image
                        src={p.hero_image}
                        alt={p.hero_alt || p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={idx < 3}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent" />
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      {p.category && (
                        <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {p.category}
                        </span>
                      )}
                      {p.date_display && (
                        <time className="text-xs text-gray-500">{p.date_display}</time>
                      )}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-ink leading-snug group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">
                      {p.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                      {readMoreLabel}
                      <Arrow className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
