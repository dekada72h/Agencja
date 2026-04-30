import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/sections/page-header";
import { ServicesOverview } from "@/components/sections/services/services-overview";
import { ServiceDetail } from "@/components/sections/services/service-detail";
import { ProcessGrid } from "@/components/sections/services/process-grid";
import { PricingGrid } from "@/components/sections/services/pricing-grid";
import { FaqSection } from "@/components/sections/services/faq-section";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/services" : `https://dekada72h.com/${locale}/services`,
    },
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Ile kosztuje strona internetowa w Dekada72H?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ceny stron internetowych zaczynają się od 1500 zł za prostą stronę wizytówkę, 2000-4000 zł za rozbudowaną stronę firmową, a landing page kosztuje od 800 zł. Każda wycena jest indywidualna i zależy od zakresu projektu.",
      },
    },
    {
      "@type": "Question",
      name: "Jak długo trwa stworzenie strony internetowej?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prosta strona wizytówka może być gotowa w 72 godziny. Rozbudowane strony firmowe zajmują 1-2 tygodnie, a projekty z zaawansowaną funkcjonalnością 2-4 tygodnie.",
      },
    },
    {
      "@type": "Question",
      name: "Czy oferujecie pozycjonowanie SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak, oferujemy kompleksowe usługi SEO obejmujące audyt strony, optymalizację on-page i off-page, pozycjonowanie lokalne oraz regularne raportowanie wyników. Każda strona, którą tworzymy, jest od początku zoptymalizowana pod SEO.",
      },
    },
    {
      "@type": "Question",
      name: "Czy tworzycie strony na WordPress?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Specjalizujemy się w tworzeniu stron ręcznie pisanych w HTML, CSS i JavaScript. Takie strony są szybsze, bezpieczniejsze i lepiej zoptymalizowane pod SEO niż strony oparte na WordPress czy innych CMS-ach.",
      },
    },
    {
      "@type": "Question",
      name: "Czy pomagacie z automatyzacją procesów biznesowych?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak, oferujemy automatyzację procesów biznesowych - od chatbotów i formularzy kontaktowych po integracje z systemami CRM, automatyzację e-mail marketingu i tworzenie dashboardów analitycznych.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://dekada72h.com" },
    { "@type": "ListItem", position: 2, name: "Usługi", item: "https://dekada72h.com/services" },
  ],
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: t("breadcrumb") }]}
        title={t("header.title")}
        subtitle={t("header.desc")}
      />
      <ServicesOverview />

      <ServiceDetail
        id="www"
        number="01"
        ns="www"
        badgeNumber="100%"
        bg="gray"
        img="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1000&q=80"
        alt="Tworzenie stron WWW Wrocław - profesjonalne strony internetowe"
      />
      <ServiceDetail
        id="landing"
        number="02"
        ns="landing"
        badgeNumber="+35%"
        reverse
        img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80"
        alt="Projektowanie landing page Wrocław - strony docelowe z wysoką konwersją"
      />
      <ServiceDetail
        id="seo"
        number="03"
        ns="seo"
        badgeNumber="TOP10"
        badge="Google"
        bg="gray"
        img="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1000&q=80"
        alt="Pozycjonowanie SEO Wrocław - optymalizacja stron pod Google"
      />
      <ServiceDetail
        id="automatyzacja"
        number="04"
        ns="auto"
        badgeNumber="24/7"
        reverse
        img="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1000&q=80"
        alt="Automatyzacja procesów biznesowych - chatboty i integracje CRM"
      />

      <ProcessGrid />
      <PricingGrid />
      <FaqSection />

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal>
            <div className="relative rounded-3xl bg-gradient-primary text-white p-10 lg:p-16 overflow-hidden shadow-glow text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl">
                {t("cta.title")}
              </h2>
              <p className="mt-5 text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
                {t("cta.desc")}
              </p>
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
