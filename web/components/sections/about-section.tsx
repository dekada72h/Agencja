"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Arrow, Check } from "@/components/icons";

export function AboutSection() {
  const t = useTranslations("index.about");

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal direction="left" className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                alt="Zespół Dekada72H - tworzenie stron internetowych Wrocław"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mt-12">
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80"
                alt="Projektowanie stron WWW i landing pages we Wrocławiu"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-primary text-white rounded-2xl px-6 py-4 shadow-glow text-center min-w-[180px]">
            <div className="font-display font-bold text-3xl">10+</div>
            <div className="text-xs uppercase tracking-wider opacity-90">
              {t("exp")}
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("label")}
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg text-gray-700 font-medium leading-relaxed">
            {t("lead")}
          </p>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            {t("text")}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="inline-flex w-7 h-7 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-ink">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-white font-medium hover:bg-primary transition-colors"
          >
            {t("btn")}
            <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
