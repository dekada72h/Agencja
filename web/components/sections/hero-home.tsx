"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Counter } from "@/components/counter";
import { Arrow, TrendUp, Clock } from "@/components/icons";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { DotPattern } from "@/components/ui/dot-pattern";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroHome() {
  const t = useTranslations("index.hero");
  const reduced = useReducedMotion();

  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* subtle dot grid texture */}
      <DotPattern
        className="text-gray-300/35 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"
        width={28}
        height={28}
        cr={1}
      />
      {/* animated background shapes */}
      <motion.div
        aria-hidden
        className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full bg-primary/25 blur-3xl"
        animate={reduced ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 -right-32 w-[34rem] h-[34rem] rounded-full bg-secondary/20 blur-3xl"
        animate={reduced ? undefined : { x: [0, -40, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-3xl"
        animate={reduced ? undefined : { x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-ink leading-[1.05]"
          >
            {t.rich("title", {
              span: (chunks) => (
                <span className="text-gradient-primary">{chunks}</span>
              ),
            })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="mt-6 max-w-xl text-lg text-gray-600 leading-relaxed"
          >
            {t("desc")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton strength={0.25}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-primary text-white font-medium shadow-soft hover:shadow-glow transition-shadow"
              >
                {t("btn.start")}
                <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gray-200 bg-white text-ink font-medium hover:border-ink/30 transition-colors"
            >
              {t("btn.portfolio")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="mt-12 grid grid-cols-3 gap-6 max-w-md"
          >
            <Stat label={t("stat.clients")} value={98} suffix="%" />
            <Stat label={t("stat.experience")} value={10} suffix="" />
            <Stat label={t("stat.scratch")} value={100} suffix="%" />
          </motion.div>
        </div>

        {/* hero visual */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80"
              alt="Agencja marketingowa Wrocław - dashboard analityczny dla stron internetowych"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="absolute -left-4 lg:-left-10 top-12 bg-white rounded-2xl shadow-glow p-4 pr-6 flex items-center gap-3"
          >
            <span
              aria-hidden
              className="w-10 h-10 rounded-xl bg-gradient-primary text-white inline-flex items-center justify-center"
            >
              <TrendUp className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {t("float.conversion")}
              </div>
              <div className="font-display font-bold text-lg text-ink">+247%</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="absolute -right-3 lg:-right-8 bottom-12 bg-white rounded-2xl shadow-glow p-4 pr-6 flex items-center gap-3"
          >
            <span
              aria-hidden
              className="w-10 h-10 rounded-xl bg-ink text-white inline-flex items-center justify-center"
            >
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {t("float.time._self")}
              </div>
              <div className="font-display font-bold text-lg text-ink">{t("float.time.val")}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div>
      <div className="font-display font-bold text-3xl md:text-4xl text-ink leading-none">
        <Counter to={value} suffix={suffix} />
      </div>
      <div className="mt-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
        {label}
      </div>
    </div>
  );
}
