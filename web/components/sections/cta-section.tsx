"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Arrow, Phone } from "@/components/icons";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { DotPattern } from "@/components/ui/dot-pattern";

export function CtaSection() {
  const t = useTranslations("index.cta");
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal>
          <div className="relative rounded-3xl bg-gradient-primary text-white p-10 lg:p-16 overflow-hidden shadow-glow">
            <DotPattern
              className="text-white/15 [mask-image:radial-gradient(ellipse_at_top_right,white,transparent_70%)]"
              width={28}
              height={28}
              cr={1.3}
            />
            <motion.div
              aria-hidden
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 30, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative max-w-2xl">
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
              <p className="mt-5 text-lg text-white/85 leading-relaxed">
                {t("desc")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton strength={0.3}>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-ink font-medium hover:bg-ink hover:text-white transition-colors"
                  >
                    {t("btn")}
                    <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <a
                    href="tel:+48662529962"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    +48 662 529 962
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
