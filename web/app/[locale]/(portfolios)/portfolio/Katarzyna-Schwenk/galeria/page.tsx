import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GaleriaHero } from "@/components/schwenk/sections/galeria-hero";
import { OilGallery } from "@/components/schwenk/sections/oil-gallery";
import { DrawingGallery } from "@/components/schwenk/sections/drawing-gallery";
import { SeriesShowcase } from "@/components/schwenk/sections/series-showcase";
import { InstagramStrip } from "@/components/schwenk/sections/instagram-strip";

export const metadata: Metadata = {
  title: "Galeria | Katarzyna Schwenk",
  description:
    "Galeria prac Katarzyny Schwenk — obrazy olejne, rysunki węglem i tuszem, kompozycje na papierze. Portrety, pejzaże, studia figuratywne.",
};

export default async function GaleriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <GaleriaHero />
      <OilGallery />
      <DrawingGallery />
      <SeriesShowcase />
      <InstagramStrip />
    </>
  );
}
