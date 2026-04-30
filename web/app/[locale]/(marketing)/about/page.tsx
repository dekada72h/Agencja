import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { AboutIntro } from "@/components/sections/about/about-intro";
import { StatsGrid } from "@/components/sections/about/stats-grid";
import { ValuesGrid } from "@/components/sections/about/values-grid";
import { TeamSection } from "@/components/sections/about/team-section";
import { Timeline } from "@/components/sections/about/timeline";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/about" : `https://dekada72h.com/${locale}/about`,
      languages: {
        pl: "https://dekada72h.com/about",
        en: "https://dekada72h.com/en/about",
        de: "https://dekada72h.com/de/about",
      },
    },
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("meta.desc"),
      siteName: "Dekada72H",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: t("breadcrumb") }]}
        title={t("header.title")}
        subtitle={t("header.desc")}
      />
      <AboutIntro />
      <StatsGrid />
      <ValuesGrid />
      <TeamSection />
      <Timeline />

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal>
            <div className="relative rounded-3xl bg-gradient-primary text-white p-10 lg:p-16 overflow-hidden shadow-glow">
              <div className="relative max-w-2xl">
                <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl">
                  {t("cta.title")}
                </h2>
                <p className="mt-5 text-lg text-white/85 leading-relaxed">{t("cta.desc")}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-ink font-medium hover:bg-ink hover:text-white transition-colors"
                  >
                    {t("cta.btn")}
                    <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    {t("cta.btn2")}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
