import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/page-header";
import { LegalContent } from "@/components/legal-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Polityka Prywatności" },
        ]}
        title="Polityka Prywatności"
        subtitle="Informacje o przetwarzaniu Twoich danych osobowych"
      />

      <LegalContent lastUpdated="Ostatnia aktualizacja: 22 stycznia 2026">
        <h2>1. Administrator danych osobowych</h2>
        <p>
          Administratorem Twoich danych osobowych jest Dekada72H z siedzibą we Wrocławiu,
          ul. Jedności Narodowej, 50-260 Wrocław (dalej: „Administrator” lub „my”).
        </p>
        <p>W sprawach związanych z ochroną danych osobowych możesz kontaktować się z nami:</p>
        <ul>
          <li>Telefonicznie: +48 662 529 962</li>
          <li>Listownie: ul. Jedności Narodowej, 50-260 Wrocław</li>
        </ul>

        <h2>2. Jakie dane zbieramy</h2>
        <p>W ramach prowadzonej działalności możemy zbierać następujące kategorie danych osobowych:</p>
        <ul>
          <li>Dane identyfikacyjne: imię, nazwisko, nazwa firmy</li>
          <li>Dane kontaktowe: adres e-mail, numer telefonu, adres korespondencyjny</li>
          <li>Dane dotyczące korzystania z serwisu: adres IP, typ przeglądarki, czas wizyty</li>
          <li>Dane podane w formularzach kontaktowych i zapytaniach ofertowych</li>
        </ul>

        <h2>3. Cele przetwarzania danych</h2>
        <p>Twoje dane osobowe przetwarzamy w następujących celach:</p>
        <ul>
          <li>Odpowiedzi na zapytania i kontakt z klientami</li>
          <li>Przygotowanie i realizacja umów o świadczenie usług</li>
          <li>Wystawianie faktur i prowadzenie dokumentacji księgowej</li>
          <li>Marketing bezpośredni własnych usług (za zgodą)</li>
          <li>Analiza statystyczna i poprawa jakości usług</li>
          <li>Dochodzenie lub obrona przed roszczeniami</li>
        </ul>

        <h2>4. Podstawy prawne przetwarzania</h2>
        <p>Przetwarzamy Twoje dane osobowe na podstawie:</p>
        <ul>
          <li>Art. 6 ust. 1 lit. a RODO - zgoda na przetwarzanie danych</li>
          <li>Art. 6 ust. 1 lit. b RODO - niezbędność do wykonania umowy</li>
          <li>Art. 6 ust. 1 lit. c RODO - wypełnienie obowiązku prawnego</li>
          <li>Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes administratora</li>
        </ul>

        <h2>5. Okres przechowywania danych</h2>
        <p>
          Twoje dane osobowe przechowujemy przez okres niezbędny do realizacji celów,
          dla których zostały zebrane:
        </p>
        <ul>
          <li>Dane związane z umową - przez okres trwania umowy oraz do 6 lat po jej zakończeniu</li>
          <li>Dane przetwarzane na podstawie zgody - do momentu jej wycofania</li>
          <li>Dane do celów marketingowych - do momentu wniesienia sprzeciwu</li>
          <li>Dane z formularzy kontaktowych - przez 2 lata od ostatniego kontaktu</li>
        </ul>

        <h2>6. Twoje prawa</h2>
        <p>W związku z przetwarzaniem Twoich danych osobowych przysługują Ci następujące prawa:</p>
        <ul>
          <li>Prawo dostępu do swoich danych osobowych</li>
          <li>Prawo do sprostowania (poprawiania) danych</li>
          <li>Prawo do usunięcia danych („prawo do bycia zapomnianym”)</li>
          <li>Prawo do ograniczenia przetwarzania</li>
          <li>Prawo do przenoszenia danych</li>
          <li>Prawo do wniesienia sprzeciwu wobec przetwarzania</li>
          <li>Prawo do cofnięcia zgody w dowolnym momencie</li>
          <li>Prawo do wniesienia skargi do organu nadzorczego (UODO)</li>
        </ul>

        <h2>7. Odbiorcy danych</h2>
        <p>Twoje dane osobowe mogą być przekazywane następującym kategoriom odbiorców:</p>
        <ul>
          <li>Dostawcy usług IT i hostingowych</li>
          <li>Biuro rachunkowe</li>
          <li>Kancelarie prawne (w razie potrzeby)</li>
          <li>Organy państwowe (na żądanie zgodne z prawem)</li>
        </ul>

        <h2>8. Pliki cookies</h2>
        <p>
          Nasza strona internetowa wykorzystuje pliki cookies (ciasteczka) w celu zapewnienia
          prawidłowego działania serwisu, analizy ruchu oraz personalizacji treści.
        </p>
        <p>Wykorzystujemy następujące rodzaje plików cookies:</p>
        <ul>
          <li>Niezbędne - konieczne do prawidłowego funkcjonowania strony</li>
          <li>Analityczne - pomagają zrozumieć, jak użytkownicy korzystają ze strony</li>
          <li>Funkcjonalne - umożliwiają zapamiętanie preferencji użytkownika</li>
        </ul>
        <p>
          Możesz zarządzać plikami cookies poprzez ustawienia swojej przeglądarki internetowej.
          Wyłączenie cookies może wpłynąć na funkcjonalność strony.
        </p>

        <h2>9. Bezpieczeństwo danych</h2>
        <p>
          Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich
          danych osobowych przed nieautoryzowanym dostępem, utratą lub zniszczeniem.
          Nasza strona wykorzystuje szyfrowanie SSL.
        </p>

        <h2>10. Zmiany w Polityce Prywatności</h2>
        <p>
          Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności.
          O wszelkich istotnych zmianach będziemy informować poprzez publikację nowej wersji
          na naszej stronie internetowej.
        </p>

        <h2>11. Kontakt</h2>
        <p>
          W przypadku pytań dotyczących niniejszej Polityki Prywatności lub przetwarzania
          Twoich danych osobowych, prosimy o kontakt:
        </p>
        <ul>
          <li>Telefon: +48 662 529 962</li>
          <li>Adres: ul. Jedności Narodowej, 50-260 Wrocław</li>
        </ul>
      </LegalContent>
    </>
  );
}
