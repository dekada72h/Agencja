"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { Arrow, Check } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ServiceDetail({
  id,
  number,
  ns, // namespace inside services. e.g. "www", "landing"
  badge,
  badgeNumber,
  img,
  alt,
  reverse = false,
  bg = "white",
}: {
  id: string;
  number: string;
  ns: "www" | "landing" | "seo" | "auto";
  badge?: string;
  badgeNumber: string;
  img: string;
  alt: string;
  reverse?: boolean;
  bg?: "white" | "gray";
}) {
  const t = useTranslations(`services.${ns}`);
  const features = [t("f1"), t("f2"), t("f3"), t("f4"), t("f5")];

  return (
    <section
      id={id}
      className={cn(
        "py-20 lg:py-28 scroll-mt-24",
        bg === "gray" ? "bg-gray-50" : "bg-white"
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
            reverse && "lg:[&>*:first-child]:order-2"
          )}
        >
          <Reveal direction={reverse ? "right" : "left"} className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={img}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15" />
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-glow p-4 text-center min-w-[120px]">
              <div className="font-display font-bold text-2xl text-gradient-primary leading-none">
                {badgeNumber}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                {badge ?? t("badge")}
              </div>
            </div>
          </Reveal>

          <Reveal direction={reverse ? "left" : "right"}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary">
              {number}
            </span>
            <h3 className="mt-3 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
              {t("title")}
            </h3>
            <p className="mt-5 text-lg text-gray-700 font-medium leading-relaxed">
              {t("lead")}
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">{t("desc")}</p>

            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="inline-flex w-7 h-7 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="text-base text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-primary text-white font-medium shadow-soft hover:shadow-glow transition-shadow"
            >
              {t("cta")}
              <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
