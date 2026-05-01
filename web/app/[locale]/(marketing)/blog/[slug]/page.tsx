import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllSlugs, getPost } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { PostHero } from "@/components/blog/post-hero";
import { PostFaq } from "@/components/blog/post-faq";
import { PostRelated } from "@/components/blog/post-related";
import { PostCta } from "@/components/blog/post-cta";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const fm = post.frontmatter;
  return {
    title: fm.title,
    description: fm.description,
    keywords: fm.keywords,
    alternates: { canonical: `https://dekada72h.com/blog/${slug}` },
    openGraph: {
      type: "article",
      title: fm.og_title || fm.title,
      description: fm.og_description || fm.description,
      images: fm.hero_image ? [fm.hero_image] : undefined,
      publishedTime: fm.date,
      modifiedTime: fm.modified,
      siteName: "Dekada72H",
    },
    twitter: {
      card: "summary_large_image",
      title: fm.og_title || fm.title,
      description: fm.og_description || fm.description,
      images: fm.hero_image ? [fm.hero_image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();

  const fm = post.frontmatter;

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    image: fm.hero_image,
    keywords: fm.keywords,
    author: {
      "@type": "Organization",
      name: "Dekada72H",
      url: "https://dekada72h.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Dekada72H",
      url: "https://dekada72h.com",
      logo: { "@type": "ImageObject", url: "https://dekada72h.com/img/logo.svg" },
    },
    datePublished: fm.date,
    dateModified: fm.modified || fm.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dekada72h.com/blog/${slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://dekada72h.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://dekada72h.com/blog" },
      { "@type": "ListItem", position: 3, name: fm.title.split(" - ")[0] },
    ],
  };

  const faqSchema = fm.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: fm.faq.map((q) => ({
          "@type": "Question",
          name: q.q,
          acceptedAnswer: { "@type": "Answer", text: q.a },
        })),
      }
    : null;

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <PostHero
        title={fm.title}
        category={fm.category}
        dateDisplay={fm.date_display}
        modifiedDisplay={
          fm.modified && fm.modified !== fm.date
            ? fm.modified.split("-").reverse().join(".")
            : undefined
        }
        readtime={fm.readtime}
        heroImage={fm.hero_image}
        heroAlt={fm.hero_alt}
      />

      <article className="mx-auto max-w-[800px] px-6 lg:px-10 py-12 lg:py-16">
        <div
          className="
            prose prose-slate max-w-none prose-lg
            prose-headings:font-display prose-headings:text-ink
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-6 prose-h2:scroll-mt-24
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4 prose-h3:scroll-mt-24
            prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:my-5
            prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-ink prose-strong:font-semibold
            prose-ul:my-5 prose-ul:pl-6 prose-li:my-2 prose-li:text-gray-700 prose-li:leading-relaxed
            prose-ol:my-5 prose-ol:pl-6
            prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-gray-700
            prose-table:my-8 prose-th:text-left prose-th:bg-gray-50 prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-gray-100
            prose-img:rounded-2xl prose-img:my-8
            prose-hr:my-12 prose-hr:border-gray-200
            first-letter:font-display first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:leading-[0.9] first-letter:mr-3 first-letter:mt-1 first-letter:text-gradient-primary
          "
        >
          {content}
        </div>

        <PostCta />
        <PostFaq items={fm.faq ?? []} />
        <PostRelated items={fm.related ?? []} />
      </article>
    </>
  );
}
