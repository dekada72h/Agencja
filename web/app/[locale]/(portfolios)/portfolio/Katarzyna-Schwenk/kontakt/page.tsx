import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { KontaktHero } from "@/components/schwenk/sections/kontakt-hero";
import { ContactGrid } from "@/components/schwenk/sections/contact-grid";
import { ClosingQuote } from "@/components/schwenk/sections/closing-quote";

export const metadata: Metadata = {
  title: "Kontakt | Katarzyna Schwenk",
  description:
    "Skontaktuj się z Katarzyną Schwenk — pytania o prace, sprzedaż, zamówienia portretowe, współpraca, wystawy. Formularz kontaktowy i media społecznościowe.",
};

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <KontaktHero />
      <ContactGrid />
      <ClosingQuote />
    </>
  );
}
