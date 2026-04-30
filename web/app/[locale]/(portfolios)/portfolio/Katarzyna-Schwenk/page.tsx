import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { SchwenkHero } from "@/components/schwenk/sections/schwenk-hero";
import { TechniquesMarquee } from "@/components/schwenk/sections/techniques-marquee";
import { GalleryPreview } from "@/components/schwenk/sections/gallery-preview";
import { IntroQuote } from "@/components/schwenk/sections/intro-quote";
import { InstagramStrip } from "@/components/schwenk/sections/instagram-strip";

export const metadata: Metadata = {
  title: "Katarzyna Schwenk | Malarstwo i Rysunek",
  description:
    "Katarzyna Schwenk — malarstwo, rysunek i sztuki wizualne. Autorska galeria prac, portrety, kompozycje figuratywne i abstrakcyjne.",
  openGraph: {
    title: "Katarzyna Schwenk | Malarstwo i Rysunek",
    description: "Autorska galeria prac — portrety, pejzaże, kompozycje figuratywne.",
    type: "website",
  },
};

export default async function SchwenkHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SchwenkHero />
      <TechniquesMarquee />
      <IntroQuote />
      <GalleryPreview />
      <InstagramStrip />
    </>
  );
}
