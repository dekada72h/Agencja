"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Check, Arrow } from "@/components/icons";
import { cn } from "@/lib/utils";

type Tier = {
  ns: "min" | "combo" | "premium";
  price: string;
  unit: string;
  featured?: boolean;
  ctaStyle: "outline" | "primary";
};

const tiers: Tier[] = [
  { ns: "min", price: "2 000", unit: "zł", ctaStyle: "outline" },
  { ns: "combo", price: "3 500", unit: "zł", featured: true, ctaStyle: "primary" },
  { ns: "premium", price: "od 15 000", unit: "zł", ctaStyle: "outline" },
];

export function PricingGrid() {
  const t = useTranslations("services.pricing");

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("label")}
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg text-gray-600">{t("desc")}</p>
          <p className="mt-3 text-sm text-gray-500">{t("vat")}</p>
        </Reveal>

        <StaggerChildren className="grid lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const features = [1, 2, 3, 4, 5].map((i) => t(`${tier.ns}.f${i}`));
            return (
              <StaggerItem key={tier.ns}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className={cn(
                    "relative h-full rounded-3xl p-8 lg:p-10 transition-shadow",
                    tier.featured
                      ? "bg-gradient-primary text-white shadow-glow ring-4 ring-primary/20"
                      : "bg-white border border-gray-100 hover:shadow-glow"
                  )}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-block px-4 py-1 rounded-full bg-accent text-ink text-xs font-bold uppercase tracking-wider">
                      Polecane
                    </span>
                  )}
                  <div className={cn("text-sm font-semibold uppercase tracking-wider", tier.featured ? "text-white/80" : "text-primary")}>
                    {t(`${tier.ns}.name`)}
                  </div>
                  <p className={cn("mt-2 text-sm", tier.featured ? "text-white/90" : "text-gray-600")}>
                    {t(`${tier.ns}.desc`)}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className={cn("font-display font-bold text-4xl lg:text-5xl", tier.featured ? "text-white" : "text-ink")}>
                      {tier.price}
                    </span>
                    <span className={cn("text-base", tier.featured ? "text-white/90" : "text-gray-600")}>
                      {tier.unit}
                    </span>
                  </div>
                  <div className={cn("mt-1 text-sm", tier.featured ? "text-white/80" : "text-gray-500")}>
                    {t(`${tier.ns}.period`)}
                  </div>

                  <ul className="mt-8 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "inline-flex w-5 h-5 rounded-full items-center justify-center flex-shrink-0 mt-0.5",
                            tier.featured ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          )}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                        <span className={cn("text-sm", tier.featured ? "text-white/95" : "text-gray-700")}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={cn(
                      "group mt-8 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-medium transition-all",
                      tier.featured
                        ? "bg-white text-ink hover:bg-ink hover:text-white"
                        : "bg-ink text-white hover:bg-primary"
                    )}
                  >
                    {t(`${tier.ns}.cta`)}
                    <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <Reveal className="mt-12 max-w-3xl mx-auto rounded-2xl bg-gray-50 p-8 text-center">
          <h4 className="font-display font-semibold text-lg text-ink">
            {t("included.title")}
          </h4>
          <div className="mt-5 flex flex-wrap justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 text-primary items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm text-gray-700">{t(`included.f${i}`)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">{t("included.note")}</p>
        </Reveal>
      </div>
    </section>
  );
}
