"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";

export function FeaturedProject() {
  const t = useTranslations("portfolio");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          <Reveal direction="left" className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Restauracja Bella Vista - elegancka strona internetowa z systemem rezerwacji online i galerią potraw"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 20 }}
              className="absolute -top-4 -right-4 inline-block bg-accent text-ink px-5 py-3 rounded-full font-bold text-sm shadow-lg"
            >
              {t("featured.badge")}
            </motion.span>
          </Reveal>

          <Reveal direction="right">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("featured.label")}
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
              Restauracja Bella Vista
            </h2>
            <p className="mt-5 text-lg text-gray-700 font-medium leading-relaxed">
              {t("featured.lead")}
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              {t("featured.desc")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <FeaturedStat value="+180%" label={t("featured.stat1")} />
              <FeaturedStat value="2.1s" label={t("featured.stat2")} />
              <FeaturedStat value="TOP 3" label={t("featured.stat3")} />
            </div>

            <Link
              href={"/portfolio/BellaVista/" as never}
              className="group mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-primary text-white font-medium shadow-soft hover:shadow-glow transition-shadow"
            >
              {t("featured.btn")}
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeaturedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-2xl text-ink">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{label}</div>
    </div>
  );
}
