"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";

const steps = [
  { num: "01", title: "Konsultacja", desc: "Rozmawiamy o Twojej kancelarii, specjalizacjach i celach. Analizujemy konkurencję we Wrocławiu." },
  { num: "02", title: "Projekt graficzny", desc: "Przygotowujemy mockup strony w 72h. Dopracowujemy go razem, aż będziesz w pełni zadowolony." },
  { num: "03", title: "Kodowanie i treści", desc: "Piszemy stronę od zera. Pomagamy z treściami — znamy specyfikę branży prawnej." },
  { num: "04", title: "Start i SEO", desc: "Uruchamiamy stronę, konfigurujemy pozycjonowanie lokalne i Google Moja Firma." },
];

export function ProcessSteps() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <Reveal>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Proces
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            Jak pracujemy — od rozmowy do uruchomienia
          </h2>
        </Reveal>

        <Reveal>
          <div className="mt-8 space-y-5 text-lg text-gray-700 leading-relaxed max-w-3xl">
            <p>
              Nie wrzucamy Cię na taśmę produkcyjną. Każda kancelaria jest inna — inna specjalizacja, inny styl
              komunikacji, inna grupa klientów. Mecenas od spraw karnych potrzebuje zupełnie innej strony niż
              radca prawny obsługujący spółki handlowe.
            </p>
            <p>
              Dlatego zaczynamy od rozmowy. Spotkajmy się na kawę we Wrocławiu — jesteśmy lokalni, nasze biuro
              jest na ul. Jedności Narodowej. Albo porozmawiajmy przez telefon, jeśli wolisz.
            </p>
          </div>
        </Reveal>

        <StaggerChildren className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <StaggerItem key={s.num}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="h-full rounded-2xl bg-white p-7 border border-gray-100 hover:shadow-glow hover:border-primary/30 transition-shadow"
              >
                <div className="font-display font-bold text-4xl text-gradient-primary leading-none mb-4">
                  {s.num}
                </div>
                <h4 className="font-display font-semibold text-lg text-ink">{s.title}</h4>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <Reveal>
          <p className="mt-10 text-base text-gray-700 max-w-3xl">
            Cały proces trwa zwykle 2-3 tygodnie. Możesz zobaczyć nasz{" "}
            <Link href="/portfolio" className="text-primary underline hover:text-primary-dark">
              pełny katalog realizacji w portfolio
            </Link>
            . A jeśli potrzebujesz czegoś więcej niż strona — na przykład{" "}
            <Link href="/services" className="text-primary underline hover:text-primary-dark">
              SEO, landing page czy automatyzację
            </Link>
            {" "}— robimy to wszystko.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
