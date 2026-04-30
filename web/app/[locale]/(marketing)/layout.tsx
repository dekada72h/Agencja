import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

// Dekada72H marketing chrome — Nav, Footer, CookieConsent.
// Schwenk and other portfolio mini-sites live in the (portfolios) route group
// and bypass this layout to use their own design language.

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        {t("skip_to_content")}
      </a>
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
