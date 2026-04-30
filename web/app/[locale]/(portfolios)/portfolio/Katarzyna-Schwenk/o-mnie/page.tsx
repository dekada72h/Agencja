import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { OmnieHero } from "@/components/schwenk/sections/omnie-hero";
import { BioSection } from "@/components/schwenk/sections/bio-section";
import { StudioQuote } from "@/components/schwenk/sections/studio-quote";
import { CareerTimeline } from "@/components/schwenk/sections/career-timeline";
import { InstagramStrip } from "@/components/schwenk/sections/instagram-strip";

export const metadata: Metadata = {
  title: "O mnie | Katarzyna Schwenk",
  description:
    "O artystce Katarzynie Schwenk — biografia, wykształcenie, inspiracje. Malarka i rysowniczka łącząca figuratywność z poszukiwaniem światła.",
};

export default async function OmniePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OmnieHero />
      <BioSection />
      <StudioQuote />
      <CareerTimeline />
      <InstagramStrip />
    </>
  );
}
