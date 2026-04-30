import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/page-header";
import { FeaturedProject } from "@/components/sections/portfolio/featured-project";
import { PortfolioShowcase } from "@/components/sections/portfolio/portfolio-showcase";
import { ProcessSection } from "@/components/sections/portfolio/process-section";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/portfolio" : `https://dekada72h.com/${locale}/portfolio`,
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: t("breadcrumb") }]}
        title={t("header.title")}
        subtitle={t("header.desc")}
      />
      <FeaturedProject />
      <PortfolioShowcase />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
