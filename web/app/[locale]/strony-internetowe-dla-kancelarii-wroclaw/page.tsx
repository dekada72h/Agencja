import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { KancelarieHero } from "@/components/sections/kancelarie/kancelarie-hero";
import { FeaturesGrid } from "@/components/sections/kancelarie/features-grid";
import { ComparisonSection } from "@/components/sections/kancelarie/comparison-section";
import { ProcessSteps } from "@/components/sections/kancelarie/process-steps";
import { PricingTable } from "@/components/sections/kancelarie/pricing-table";
import { LawyerFaq } from "@/components/sections/kancelarie/lawyer-faq";
import { Arrow, Phone } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Strony Internetowe dla Kancelarii Prawnych Wrocław | Dekada72H",
    description:
      "Tworzymy szybkie, bezpieczne strony WWW dla adwokatów, radców prawnych i kancelarii we Wrocławiu. Bez WordPressa, bez wtyczek - czysty kod HTML/CSS/JS.",
    alternates: {
      canonical:
        locale === "pl"
          ? "https://dekada72h.com/strony-internetowe-dla-kancelarii-wroclaw"
          : `https://dekada72h.com/${locale}/strony-internetowe-dla-kancelarii-wroclaw`,
    },
    openGraph: {
      title: "Strony Internetowe dla Kancelarii Prawnych Wrocław",
      description: "Profesjonalne strony WWW dla kancelarii — szybkie, bezpieczne, zoptymalizowane pod SEO.",
      type: "website",
    },
  };
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Strony internetowe dla kancelarii prawnych",
  description:
    "Profesjonalne strony internetowe dla kancelarii prawnych, adwokatów i radców prawnych we Wrocławiu. Strony pisane ręcznie w HTML/CSS/JS - szybkie, bezpieczne, zoptymalizowane pod SEO.",
  provider: {
    "@type": "LocalBusiness",
    name: "Dekada72H",
    url: "https://dekada72h.com",
    telephone: "+48662529962",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Jedności Narodowej",
      addressLocality: "Wrocław",
      postalCode: "50-260",
      addressCountry: "PL",
    },
  },
  areaServed: { "@type": "City", name: "Wrocław" },
  serviceType: "Tworzenie stron internetowych dla kancelarii prawnych",
  url: "https://dekada72h.com/strony-internetowe-dla-kancelarii-wroclaw",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://dekada72h.com/" },
    { "@type": "ListItem", position: 2, name: "Usługi", item: "https://dekada72h.com/services" },
    { "@type": "ListItem", position: 3, name: "Strony dla kancelarii" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Ile kosztuje strona internetowa dla kancelarii prawnej?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Strona wizytówka dla kancelarii prawnej kosztuje od 2000 zł netto. Rozbudowana strona z blogiem, profilami prawników i systemem kontaktowym to koszt od 3500 zł netto. Każdy projekt wyceniamy indywidualnie po konsultacji.",
      },
    },
    {
      "@type": "Question",
      name: "Jak długo trwa stworzenie strony dla kancelarii?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prosta strona wizytówka dla kancelarii może być gotowa w 5-7 dni roboczych. Rozbudowana strona z blogiem, podstronami specjalizacji i formularzami kontaktowymi zajmuje 2-3 tygodnie. Pierwszą wersję projektu graficznego przygotowujemy w 72 godziny od otrzymania materiałów.",
      },
    },
    {
      "@type": "Question",
      name: "Czy strona będzie widoczna w Google na frazy prawnicze?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak. Każda strona jest od początku zoptymalizowana pod SEO. Pomagamy z pozycjonowaniem lokalnym w Google, żeby kancelaria była widoczna na frazy typu adwokat Wrocław czy kancelaria prawna Wrocław.",
      },
    },
    {
      "@type": "Question",
      name: "Czy mogę sam edytować treść na stronie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oczywiście. Możemy przygotować prosty panel do edycji treści lub przeszkolić Cię z podstawowej edycji plików. Wiele kancelarii woli jednak zlecać nam aktualizacje.",
      },
    },
    {
      "@type": "Question",
      name: "Czy pomagacie z pozycjonowaniem po wdrożeniu strony?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak, oferujemy stałe wsparcie SEO po wdrożeniu strony. Obejmuje to optymalizację treści, budowanie linków, pozycjonowanie lokalne w Google Moja Firma oraz regularne raportowanie wyników.",
      },
    },
  ],
};

export default async function KancelariePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <KancelarieHero />

      {/* Section 1: Why */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Dlaczego warto
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
              Dlaczego Twoja kancelaria potrzebuje porządnej strony internetowej
            </h2>
          </Reveal>
          <Reveal>
            <div className="mt-8 space-y-5 text-lg text-gray-700 leading-relaxed">
              <p>
                Wyobraź sobie sytuację. Ktoś we Wrocławiu potrzebuje adwokata od spraw rozwodowych. Co robi?
                Pyta znajomych, jasne. Ale zaraz potem otwiera telefon i wpisuje w Google &bdquo;adwokat rozwód
                Wrocław&rdquo;. Przegląda wyniki. Klika w pierwsze trzy linki.
              </p>
              <p>
                Jeśli Twoja kancelaria nie pojawia się w tych wynikach — albo pojawia się, ale strona wygląda
                jak z 2012 roku — to właśnie straciłeś klienta. Nie dlatego, że jesteś gorszym prawnikiem.
                Dlatego, że ktoś inny zadbał o swoją obecność online, a Ty nie.
              </p>
              <div className="my-8 rounded-r-2xl bg-gradient-to-r from-primary/10 to-secondary/5 border-l-4 border-primary p-6">
                <p className="text-ink font-medium">
                  <span className="text-2xl font-display font-bold">73% potencjalnych klientów</span>
                  {" "}ocenia wiarygodność kancelarii prawnej na podstawie jej strony internetowej. Zanim
                  ktokolwiek zadzwoni, najpierw sprawdzi Cię w sieci.
                </p>
              </div>
              <p>
                Wrocław to miasto z ogromną konkurencją wśród prawników. W samym Śródmieściu, na Krzykach,
                na Psim Polu — wszędzie są kancelarie. Część z nich ma świetne strony z opisami
                specjalizacji, profilami prawników, a nawet blogami. To one zbierają połączenia telefoniczne
                i zapytania z formularzy. Reszta? Reszta czeka na klientów z polecenia.
              </p>
              <p>
                Polecenia są ważne — nikt tego nie kwestionuje. Ale poleganie wyłącznie na rekomendacjach to
                jak prowadzenie kancelarii z zamkniętymi drzwiami. Strona internetowa to Twoje drzwi otwarte
                24 godziny na dobę, 7 dni w tygodniu. Pracuje, kiedy Ty śpisz, kiedy jesteś na rozprawie,
                kiedy jedziesz na urlop.
              </p>
              <p>
                Różnica między kancelarią z profesjonalną stroną a kancelarią bez strony jest prosta: ta
                pierwsza budzi zaufanie. A zaufanie to fundament relacji prawnik–klient. Jeśli ktoś ma
                powierzyć Ci swoją sprawę rozwodową, spadkową czy firmową — musi najpierw zaufać, że jesteś
                profesjonalistą. Twoja strona jest pierwszym miejscem, gdzie to zaufanie się buduje.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FeaturesGrid />
      <ComparisonSection />
      <ProcessSteps />
      <PricingTable />

      {/* CTA */}
      <section className="relative py-24 bg-gradient-dark text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-primary/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <Reveal>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl">
              Porozmawiajmy o stronie dla Twojej kancelarii
            </h2>
            <p className="mt-5 text-lg text-white/80">
              Bezpłatna konsultacja, konkretna wycena w 24h i żadnego zobowiązania. Jesteśmy we Wrocławiu — możemy się spotkać na żywo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-ink font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Darmowa wycena
                <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:+48662529962"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +48 662 529 962
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <LawyerFaq />
    </>
  );
}
