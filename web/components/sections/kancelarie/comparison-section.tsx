"use client";

import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { Check } from "@/components/icons";

const goodPoints = [
  "Brak luk bezpieczeństwa — nie ma wtyczek do zhakowania",
  "Ładowanie poniżej 1 sekundy (PageSpeed 95-100)",
  "Zero aktualizacji do robienia — strona po prostu działa",
  "Lepsze pozycje w Google (szybkość to czynnik rankingowy)",
  "Niższe koszty utrzymania — tani hosting wystarcza",
];

const badPoints = [
  "Regularne ataki hakerów na znane luki w pluginach",
  "Wolne ładowanie (3-6 sekund z typowymi wtyczkami)",
  "Ciągłe aktualizacje, które mogą zepsuć stronę",
  "Gorsze wyniki Core Web Vitals",
  "Droższy hosting, koszty utrzymania wtyczek premium",
];

export function ComparisonSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-10">
        <Reveal>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            Technologia
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl">
            Dlaczego kancelarie powinny unikać WordPressa
          </h2>
        </Reveal>

        <Reveal>
          <div className="mt-8 space-y-5 text-lg text-white/85 leading-relaxed max-w-3xl">
            <p>
              Większość agencji proponuje kancelariom strony na WordPressie. To szybkie, tanie i...
              problematyczne. Dla zwykłej firmy WordPress może być OK. Ale kancelaria prawna to nie zwykła firma.
            </p>
            <p>
              Kancelaria przetwarza dane osobowe klientów, informacje o sprawach sądowych, wrażliwe dokumenty.
              WordPress z dziesiątkami wtyczek to zaproszenie dla hakerów. W samym 2025 roku wykryto ponad 9000
              luk bezpieczeństwa w pluginach WordPressa. Chcesz, żeby dane Twoich klientów wyciekły przez dziurawą
              wtyczkę do formularza kontaktowego?
            </p>
            <p>
              Nasze strony są{" "}
              <Link href="/blog/html-vs-wordpress" className="text-primary-light underline hover:text-white">
                pisane ręcznie w HTML, CSS i JavaScript
              </Link>
              . Bez CMS-a, bez wtyczek, bez bazy danych do zhakowania.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-5">
          <Reveal direction="left">
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-emerald-400/30 p-7">
              <h3 className="font-display font-bold text-xl text-emerald-300">Strona HTML (nasze podejście)</h3>
              <ul className="mt-5 space-y-3">
                {goodPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-white/90">
                    <span className="inline-flex w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-red-400/20 p-7">
              <h3 className="font-display font-bold text-xl text-red-300">Strona na WordPressie</h3>
              <ul className="mt-5 space-y-3">
                {badPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-white/80">
                    <span className="inline-flex w-6 h-6 rounded-full bg-red-500/25 text-red-300 items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-10 text-base text-white/70 max-w-3xl">
            Jeśli chcesz głębiej zrozumieć różnice, mamy{" "}
            <Link href="/blog/html-vs-wordpress" className="text-primary-light underline hover:text-white">
              obszerny artykuł porównujący HTML z WordPressem
            </Link>
            . Krótko mówiąc: dla kancelarii prawnej bezpieczeństwo i szybkość to nie &bdquo;nice to have&rdquo;
            — to wymóg.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
