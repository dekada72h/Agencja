"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";

const rows = [
  {
    name: "Strona wizytówka",
    sub: "3-5 podstron, formularz kontaktowy, responsywność, SEO",
    price: "od 2 000 zł",
  },
  {
    name: "Rozbudowana strona z blogiem",
    sub: "8-12 podstron, profile prawników, blog, formularze, Google Moja Firma",
    price: "od 3 500 zł",
  },
  {
    name: "Strona premium",
    sub: "Indywidualny projekt, copywriting, pełne SEO, system rezerwacji konsultacji",
    price: "od 6 000 zł",
  },
];

export function PricingTable() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-10">
        <Reveal>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            Cennik
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl">
            Ile kosztuje strona dla kancelarii prawnej?
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-3xl">
            Nie lubimy &bdquo;cen od&rdquo;. Ale rozumiemy, że chcesz wiedzieć, o jakich kwotach mówimy, zanim
            się z nami skontaktujesz. To fair. Więc oto orientacyjne widełki.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
            {rows.map((r, i) => (
              <motion.div
                key={r.name}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-6 lg:p-8 ${
                  i !== rows.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div>
                  <div className="font-display font-semibold text-xl text-white">{r.name}</div>
                  <div className="mt-1 text-sm text-white/60">{r.sub}</div>
                </div>
                <div className="font-display font-bold text-2xl text-gradient-primary whitespace-nowrap">
                  {r.price}
                </div>
              </motion.div>
            ))}
            <div className="bg-white/5 px-6 py-4 lg:px-8 text-xs text-white/60">
              Ceny netto. W każdym pakiecie: pierwszy rok domeny i hostingu gratis, certyfikat SSL i wsparcie
              techniczne po wdrożeniu.
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 space-y-5 text-base text-white/80 leading-relaxed max-w-3xl">
            <p>
              Pomyśl o tym w kategoriach zwrotu z inwestycji. Średnia stawka adwokacka we Wrocławiu to 300-500
              zł za godzinę. Jeden nowy klient z internetu, którego poprowadzisz przez sprawę trwającą
              kilkanaście godzin, to zwrot kosztów całej strony. A strona pracuje miesiącami i latami.
            </p>
            <p>
              Każdą wycenę robimy indywidualnie.{" "}
              <Link href="/contact" className="text-primary-light underline hover:text-white">
                Wyślij zapytanie przez nasz formularz
              </Link>
              {" "}— odpowiemy w ciągu 24 godzin z konkretną wyceną.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
