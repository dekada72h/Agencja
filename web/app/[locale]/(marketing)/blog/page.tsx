import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/page-header";
import { BlogGrid } from "@/components/sections/blog/blog-grid";
import { getAllPostsMeta } from "@/lib/blog";

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
      canonical:
        locale === "pl"
          ? "https://dekada72h.com/blog"
          : `https://dekada72h.com/${locale}/blog`,
    },
    openGraph: {
      title: t("title"),
      description: t("meta.desc"),
      type: "website",
      siteName: "Dekada72H",
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getAllPostsMeta();

  const blogIndexSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Dekada72H Blog",
    url: "https://dekada72h.com/blog",
    description:
      "Porady, artykuły i wiedza o tworzeniu stron internetowych i marketingu cyfrowym.",
    publisher: { "@type": "Organization", name: "Dekada72H" },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      url: `https://dekada72h.com/blog/${p.slug}`,
      headline: p.title,
      datePublished: p.date,
    })),
  };

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
      <BlogGrid posts={posts} readMoreLabel={t("readmore")} />
    </>
  );
}
