"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PostHero({
  title,
  category,
  dateDisplay,
  readtime,
  heroImage,
  heroAlt,
}: {
  title: string;
  category: string;
  dateDisplay: string;
  readtime: string;
  heroImage: string;
  heroAlt: string;
}) {
  return (
    <header className="relative pt-28 lg:pt-36 pb-12 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-32 w-[42rem] h-[42rem] rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[860px] px-6 lg:px-10">
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center gap-3 text-xs"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-bold uppercase tracking-wider text-[10px]">
            {category}
          </span>
          <time className="text-gray-500">{dateDisplay}</time>
          {readtime && (
            <>
              <span aria-hidden className="text-gray-300">·</span>
              <span className="text-gray-500">{readtime}</span>
            </>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-5 font-display font-bold text-3xl md:text-5xl lg:text-6xl text-ink leading-[1.1]"
        >
          {title}
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: EASE }}
        className="relative mx-auto max-w-[1100px] px-6 lg:px-10 mt-12"
      >
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={heroImage}
            alt={heroAlt || title}
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </motion.div>
    </header>
  );
}
