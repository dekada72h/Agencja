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
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Regulamin" }]}
        title="Regulamin"
        subtitle="Warunki świadczenia usług i zasady współpracy"
      />

      <LegalContent lastUpdated="Ostatnia aktualizacja: 22 stycznia 2026">
        <h2>1. Postanowienia ogólne</h2>
        <p>
          Niniejszy Regulamin określa zasady świadczenia usług przez Dekada72H z siedzibą
          we Wrocławiu, ul. Jedności Narodowej, 50-260 Wrocław (dalej: „Wykonawca” lub „Dekada72H”).
        </p>
        <p>
          Regulamin stanowi integralną część umów zawieranych z Klientami na świadczenie
          usług projektowania i tworzenia stron internetowych oraz powiązanych usług marketingowych.
        </p>

        <h2>2. Definicje</h2>
        <ul>
          <li><strong>Klient</strong> - osoba fizyczna, prawna lub jednostka organizacyjna zlecająca wykonanie usług</li>
          <li><strong>Wykonawca</strong> - Dekada72H świadczący usługi na rzecz Klienta</li>
          <li><strong>Projekt</strong> - strona internetowa, landing page lub inna usługa będąca przedmiotem umowy</li>
          <li><strong>Brief</strong> - dokument zawierający wymagania i wytyczne Klienta dotyczące Projektu</li>
          <li><strong>Mockup</strong> - wstępny projekt graficzny strony do akceptacji</li>
        </ul>

        <h2>3. Zakres usług</h2>
        <p>Dekada72H świadczy następujące usługi:</p>
        <ul>
          <li>Projektowanie i tworzenie stron internetowych</li>
          <li>Projektowanie i tworzenie landing pages</li>
          <li>Optymalizacja SEO</li>
          <li>Projektowanie UX/UI</li>
          <li>Utrzymanie i wsparcie techniczne stron internetowych</li>
          <li>Rejestracja domen i usługi hostingowe</li>
        </ul>

        <h2>4. Proces realizacji</h2>
        <h3>4.1. Etap wstępny</h3>
        <ol>
          <li>Klient przesyła zapytanie ofertowe lub kontaktuje się telefonicznie</li>
          <li>Wykonawca przygotowuje indywidualną wycenę projektu</li>
          <li>Po akceptacji wyceny następuje podpisanie umowy</li>
          <li>Klient wpłaca zaliczkę zgodnie z ustalonymi warunkami płatności</li>
        </ol>

        <h3>4.2. Realizacja projektu</h3>
        <ol>
          <li>Klient dostarcza materiały (logo, teksty, zdjęcia) oraz brief projektu</li>
          <li>Wykonawca przygotowuje mockup (projekt graficzny) do akceptacji</li>
          <li>Po akceptacji mockupu następuje kodowanie strony</li>
          <li>Klient otrzymuje dostęp do wersji testowej do weryfikacji</li>
          <li>Po wprowadzeniu poprawek i akceptacji następuje publikacja</li>
        </ol>

        <h3>4.3. Terminy realizacji</h3>
        <p>
          W przypadku prostych stron wizytówkowych, mockup przygotowywany jest w ciągu 72 godzin
          od otrzymania wszystkich materiałów. Po akceptacji projektu graficznego, gotowa strona
          dostarczana jest również w ciągu 72 godzin.
        </p>
        <p>
          Projekty bardziej skomplikowane (sklepy internetowe, rozbudowane portale, dedykowane
          funkcjonalności) realizowane są w terminie 3-6 tygodni, w zależności od zakresu prac.
        </p>

        <h2>5. Warunki płatności</h2>
        <p>Standardowy model płatności:</p>
        <ul>
          <li>50% wartości projektu - zaliczka przed rozpoczęciem prac</li>
          <li>50% wartości projektu - po akceptacji i przed publikacją strony</li>
        </ul>
        <p>
          Dla projektów o wartości powyżej 10 000 zł netto możliwe jest ustalenie płatności
          etapowych według harmonogramu ustalonego indywidualnie.
        </p>
        <p>
          Wszystkie ceny podane w ofercie są cenami netto. Do podanych kwot należy doliczyć
          podatek VAT w obowiązującej stawce (obecnie 23%).
        </p>

        <h2>6. Poprawki i modyfikacje</h2>
        <p>
          W ramach realizacji projektu Klient ma prawo do dwóch rund poprawek bez dodatkowych
          kosztów. Poprawki dotyczą elementów objętych zaakceptowanym briefem.
        </p>
        <p>
          Dodatkowe poprawki wykraczające poza zakres umowy oraz modyfikacje po oddaniu projektu
          wyceniane są indywidualnie według stawki godzinowej Wykonawcy.
        </p>

        <h2>7. Prawa autorskie</h2>
        <p>
          Po uregulowaniu pełnej płatności za projekt, Klient nabywa pełne prawa majątkowe
          do wykorzystania projektu w zakresie określonym w umowie.
        </p>
        <p>
          Wykonawca zachowuje prawo do wykorzystania projektu w swoim portfolio oraz
          materiałach marketingowych, chyba że strony ustalą inaczej.
        </p>
        <p>
          Klient odpowiada za posiadanie praw do materiałów (zdjęcia, teksty, logo)
          dostarczonych do realizacji projektu.
        </p>

        <h2>8. Hosting i domena</h2>
        <p>
          W pakietach usług strona hostowana jest na serwerach Wykonawcy. Pierwszy rok
          hostingu i domeny wliczony jest w cenę projektu.
        </p>
        <p>
          Po upływie pierwszego roku, opłata za hosting i domenę wynosi zgodnie z aktualnym
          cennikiem i jest płatna z góry za okres roczny.
        </p>

        <h2>9. Gwarancja i wsparcie</h2>
        <p>
          Wykonawca zapewnia 12-miesięczną gwarancję na wykonane prace, obejmującą usuwanie
          błędów technicznych wynikających z wadliwego wykonania.
        </p>
        <p>
          Gwarancja nie obejmuje błędów wynikających z modyfikacji wprowadzonych przez
          Klienta lub osoby trzecie, ani problemów spowodowanych przez zewnętrzne czynniki.
        </p>

        <h2>10. Odpowiedzialność</h2>
        <p>
          Wykonawca dołoży wszelkich starań, aby świadczone usługi były najwyższej jakości.
          Odpowiedzialność Wykonawcy ograniczona jest do wartości wynagrodzenia określonego w umowie.
        </p>
        <p>Wykonawca nie ponosi odpowiedzialności za:</p>
        <ul>
          <li>Treści dostarczone przez Klienta</li>
          <li>Opóźnienia wynikające z braku materiałów od Klienta</li>
          <li>Skutki działania siły wyższej</li>
          <li>Przerwy w działaniu usług zewnętrznych dostawców</li>
        </ul>

        <h2>11. Rozwiązanie umowy</h2>
        <p>
          Każda ze stron może rozwiązać umowę z 14-dniowym okresem wypowiedzenia.
          W przypadku rozwiązania umowy przed zakończeniem projektu, Klient zobowiązany
          jest do zapłaty za prace wykonane do momentu rozwiązania.
        </p>
        <p>Wpłacona zaliczka nie podlega zwrotowi, jeśli Wykonawca rozpoczął prace nad projektem.</p>

        <h2>12. Reklamacje</h2>
        <p>
          Reklamacje należy zgłaszać pisemnie (e-mail lub poczta) w terminie 14 dni od
          wykrycia usterki. Reklamacja powinna zawierać opis problemu oraz oczekiwany sposób rozwiązania.
        </p>
        <p>Wykonawca rozpatrzy reklamację w terminie 14 dni roboczych od jej otrzymania.</p>

        <h2>13. Poufność</h2>
        <p>
          Obie strony zobowiązują się do zachowania poufności informacji uzyskanych
          w trakcie współpracy, które stanowią tajemnicę przedsiębiorstwa drugiej strony.
        </p>

        <h2>14. Postanowienia końcowe</h2>
        <p>
          W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy
          prawa polskiego, w szczególności Kodeksu cywilnego.
        </p>
        <p>
          Wszelkie spory wynikające z realizacji usług będą rozstrzygane przez sąd
          właściwy dla siedziby Wykonawcy.
        </p>
        <p>
          Wykonawca zastrzega sobie prawo do zmiany Regulaminu. Zmiany wchodzą w życie
          po 14 dniach od publikacji na stronie internetowej.
        </p>

        <h2>15. Kontakt</h2>
        <p>W przypadku pytań dotyczących Regulaminu, prosimy o kontakt:</p>
        <ul>
          <li>Telefon: +48 662 529 962</li>
          <li>Adres: ul. Jedności Narodowej, 50-260 Wrocław</li>
        </ul>
      </LegalContent>
    </>
  );
}
