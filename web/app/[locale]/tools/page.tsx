import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { PriceCalculator } from "@/components/sections/tools/price-calculator";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Arrow } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/tools" : `https://dekada72h.com/${locale}/tools`,
    },
  };
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://dekada72h.com" },
    { "@type": "ListItem", position: 2, name: "Narzędzia", item: "https://dekada72h.com/tools" },
  ],
};

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: t("breadcrumb") }]}
        title={t("header.title")}
        subtitle={t("header.desc")}
      />

      {/* Calculator intro */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("calculator.label")}
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
              {t("calculator.title")}
            </h2>
            <p className="mt-5 text-lg text-gray-600">{t("calculator.desc")}</p>
          </Reveal>

          <Reveal>
            <PriceCalculator />
          </Reveal>
        </div>
      </section>

      {/* Other tools */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("other.label")}
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl text-ink">
              {t("other.title")}
            </h2>
          </Reveal>

          <StaggerChildren className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <StaggerItem>
              <div className="relative h-full rounded-2xl bg-white border border-gray-100 p-7 opacity-70">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  {t("other.badge.soon")}
                </span>
                <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center shadow-soft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                <h4 className="mt-5 font-display font-semibold text-lg text-ink">
                  {t("other.quiz._self")}
                </h4>
                <p className="mt-3 text-sm text-gray-600">{t("other.quiz.desc")}</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="relative h-full rounded-2xl bg-white border border-gray-100 p-7 opacity-70">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  {t("other.badge.soon")}
                </span>
                <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center shadow-soft">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
                <h4 className="mt-5 font-display font-semibold text-lg text-ink">
                  {t("other.audit._self")}
                </h4>
                <p className="mt-3 text-sm text-gray-600">{t("other.audit.desc")}</p>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal>
            <div className="relative rounded-3xl bg-gradient-primary text-white p-10 lg:p-16 overflow-hidden shadow-glow text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-white/85 max-w-2xl mx-auto">{t("cta.desc")}</p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-ink font-medium hover:bg-ink hover:text-white transition-colors"
              >
                {t("cta.btn")}
                <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
