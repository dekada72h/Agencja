import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroHome } from "@/components/sections/hero-home";
import { TechStackMarquee } from "@/components/sections/tech-stack-marquee";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessTerminal } from "@/components/sections/process-terminal";
import { LighthouseScores } from "@/components/sections/lighthouse-scores";
import { AboutSection } from "@/components/sections/about-section";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { BeforeAfter } from "@/components/sections/before-after";
import { CustomWork } from "@/components/sections/custom-work";
import { CtaSection } from "@/components/sections/cta-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "index" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/" : `https://dekada72h.com/${locale}/`,
      languages: {
        pl: "https://dekada72h.com/",
        en: "https://dekada72h.com/en/",
        de: "https://dekada72h.com/de/",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "pl" ? "pl_PL" : locale === "de" ? "de_DE" : "en_US",
      title: t("title"),
      description: t("meta.desc"),
      url: locale === "pl" ? "https://dekada72h.com/" : `https://dekada72h.com/${locale}/`,
      siteName: "Dekada72H",
      images: [
        {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("meta.desc"),
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      ],
    },
    keywords: [
      "agencja marketingowa",
      "strony www",
      "landing page",
      "SEO",
      "UX/UI",
      "web design",
      "marketing cyfrowy",
    ],
  };
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dekada72H",
  alternateName: "Dekada72H Digital",
  url: "https://dekada72h.com",
  logo: "https://dekada72h.com/img/logo.svg",
  description:
    "Nowoczesna agencja marketingowa specjalizująca się w tworzeniu stron WWW, landing pages, SEO i UX/UI design.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Jedności Narodowej",
    addressLocality: "Wrocław",
    postalCode: "50-260",
    addressCountry: "PL",
  },
  telephone: "+48662529962",
  foundingDate: "2016",
  areaServed: { "@type": "City", name: "Wrocław" },
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Dekada72H",
  image: "https://dekada72h.com/img/logo.svg",
  url: "https://dekada72h.com",
  telephone: "+48662529962",
  email: "kontakt@dekada72h.com",
  foundingDate: "2016",
  description:
    "Nowoczesna agencja marketingowa specjalizująca się w tworzeniu stron WWW, landing pages, SEO i automatyzacji procesów biznesowych we Wrocławiu.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Jedności Narodowej",
    addressLocality: "Wrocław",
    postalCode: "50-260",
    addressRegion: "dolnośląskie",
    addressCountry: "PL",
  },
  geo: { "@type": "GeoCoordinates", latitude: 51.1079, longitude: 17.0385 },
  areaServed: [
    { "@type": "City", name: "Wrocław" },
    { "@type": "State", name: "dolnośląskie" },
    { "@type": "Country", name: "Polska" },
  ],
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: [
    "https://www.facebook.com/dekada72h",
    "https://www.linkedin.com/company/dekada72h",
    "https://www.instagram.com/dekada72h",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Usługi marketingowe",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tworzenie stron WWW", description: "Profesjonalne strony internetowe w czystym HTML/CSS" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing Pages", description: "Strony docelowe zoptymalizowane pod konwersję" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO i pozycjonowanie", description: "Pozycjonowanie stron w Google" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Automatyzacja procesów", description: "Automatyzacja procesów biznesowych i chatboty AI" } },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dekada72H",
  url: "https://dekada72h.com",
  description: "Nowoczesna agencja marketingowa - Strony WWW, Landing Pages, SEO, UX/UI",
  publisher: { "@type": "Organization", name: "Dekada72H" },
  inLanguage: ["pl", "en", "de"],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HeroHome />
      <TechStackMarquee />
      <ServicesGrid />
      <ProcessTerminal />
      <LighthouseScores />
      <AboutSection />
      <PortfolioGrid />
      <BeforeAfter />
      <CustomWork />
      <CtaSection />
    </>
  );
}
