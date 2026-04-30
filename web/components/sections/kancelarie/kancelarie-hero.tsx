"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Arrow, Phone, Check } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export function KancelarieHero() {
  return (
    <header className="relative pt-32 lg:pt-40 pb-20 lg:pb-28 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white">
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-32 w-[42rem] h-[42rem] rounded-full bg-primary/25 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 -left-40 w-[28rem] h-[28rem] rounded-full bg-secondary/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-10">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60"
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white transition-colors">Usługi</Link>
          <span>/</span>
          <span className="text-white">Strony dla kancelarii</span>
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]"
        >
          Strony Internetowe dla Kancelarii Prawnych we Wrocławiu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-2xl text-lg text-white/85 leading-relaxed"
        >
          Twoi klienci szukają prawnika w Google. Pytanie brzmi: czy znajdą Twoją kancelarię — czy konkurencję
          z sąsiedniej ulicy? Budujemy strony, które budują zaufanie jeszcze zanim klient podniesie słuchawkę.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-ink font-semibold shadow-soft hover:bg-primary hover:text-white transition-colors"
          >
            Darmowa wycena
            <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="tel:+48662529962"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
          >
            <Phone className="w-5 h-5" />
            +48 662 529 962
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80"
        >
          {["Bez WordPressa — czysty kod", "Ładowanie poniżej 1 sekundy", "Lokalna firma z Wrocławia"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="inline-flex w-5 h-5 rounded-full bg-white/15 items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
