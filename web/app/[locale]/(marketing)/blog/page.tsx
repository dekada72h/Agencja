import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/page-header";
import { BlogGrid } from "@/components/sections/blog/blog-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/blog" : `https://dekada72h.com/${locale}/blog`,
    },
    openGraph: {
      title: t("title"),
      description: t("meta.desc"),
      type: "website",
      siteName: "Dekada72H",
    },
  };
}

const blogIndexSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Dekada72H Blog",
  url: "https://dekada72h.com/blog",
  description: "Porady, artykuły i wiedza o tworzeniu stron internetowych i marketingu cyfrowym.",
  publisher: { "@type": "Organization", name: "Dekada72H" },
  blogPost: [
    "jak-zwiekszyc-konwersje-na-stronie",
    "google-moja-firma-wizytowka-google",
    "tworzenie-stron-internetowych-wroclaw",
    "marketing-internetowy-wroclaw",
    "strona-internetowa-dla-firmy",
    "pozycjonowanie-lokalne-wroclaw",
    "ile-kosztuje-strona-internetowa",
    "automatyzacja-procesow-biznesowych",
    "seo-pozycjonowanie-stron",
    "landing-page-co-to-jest",
    "html-vs-wordpress",
  ].map((slug) => ({
    "@type": "BlogPosting",
    url: `https://dekada72h.com/blog/${slug}`,
  })),
};

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexSchema) }}
      />
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: t("breadcrumb") }]}
        title={t("header.title")}
        subtitle={t("header.desc")}
      />
      <BlogGrid />
    </>
  );
}
