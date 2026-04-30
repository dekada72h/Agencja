"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-32 bg-gradient-dark text-white relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-32 left-1/4 w-[34rem] h-[34rem] rounded-full bg-primary/30 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 right-1/4 w-[30rem] h-[30rem] rounded-full bg-secondary/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold text-[clamp(6rem,15vw,11rem)] leading-none text-gradient-primary"
        >
          404
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-3 font-display font-bold text-2xl md:text-3xl text-white"
        >
          Strona nie znaleziona
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-4 text-gray-300 text-base leading-relaxed"
        >
          Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
          Sprawdź adres URL lub skorzystaj z poniższych linków.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-gradient-primary text-white font-medium shadow-soft hover:shadow-glow transition-shadow"
          >
            Strona główna
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Kontakt
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
