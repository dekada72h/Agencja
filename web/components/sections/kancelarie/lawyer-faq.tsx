"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Ile kosztuje strona internetowa dla kancelarii prawnej?",
    a: "Strona wizytówka z formularzem kontaktowym i podstawowym SEO to koszt od 2 000 zł netto. Rozbudowana strona z blogiem, profilami prawników i systemem kontaktowym kosztuje od 3 500 zł netto. Każdy projekt wyceniamy indywidualnie po krótkiej rozmowie. Wycena jest bezpłatna i niezobowiązująca.",
  },
  {
    q: "Jak długo trwa stworzenie strony dla kancelarii?",
    a: "Prosta strona wizytówka jest gotowa w 5-7 dni roboczych od momentu, gdy mamy wszystkie materiały. Rozbudowana strona z blogiem i kilkunastoma podstronami zajmuje 2-3 tygodnie. Pierwszy mockup graficzny przygotowujemy w ciągu 72 godzin.",
  },
  {
    q: "Czy strona będzie widoczna w Google na frazy prawnicze?",
    a: "Każda strona, którą tworzymy, jest od samego początku zoptymalizowana pod SEO. Odpowiednia struktura nagłówków, meta tagi, schema markup, szybkość ładowania — to wszystko wpływa na pozycje w Google. Dodatkowo pomagamy z pozycjonowaniem lokalnym, konfigurujemy Google Moja Firma. Efekty w postaci lepszych pozycji widać zwykle po 2-4 miesiącach.",
  },
  {
    q: "Czy mogę sam edytować treść na stronie?",
    a: "Tak, możemy przygotować prostą instrukcję edycji lub przeszkolić Cię z podstawowej edycji plików. W praktyce większość kancelarii woli zlecać nam drobne zmiany — to szybkie i tanie. Dodanie nowego wpisu na blogu, aktualizacja profilu prawnika czy zmiana numeru telefonu to kwestia kilku minut.",
  },
  {
    q: "Czy pomagacie z pozycjonowaniem po wdrożeniu strony?",
    a: "Jak najbardziej. Samo wdrożenie strony to dopiero początek. Oferujemy stałe wsparcie SEO, które obejmuje optymalizację treści, budowanie linków zwrotnych, prowadzenie bloga prawniczego i pozycjonowanie lokalne w Google Moja Firma. Co miesiąc dostaniesz raport z wynikami.",
  },
];

export function LawyerFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            FAQ
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl text-ink">
            Najczęściej zadawane pytania
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Odpowiedzi na pytania, które najczęściej słyszymy od właścicieli kancelarii prawnych.
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="rounded-2xl bg-white border border-gray-100 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left hover:bg-gray-50/60 transition-colors"
                >
                  <span className="font-display font-semibold text-base lg:text-lg text-ink">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "inline-flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0",
                      isOpen ? "bg-gradient-primary text-white" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 lg:px-6 lg:pb-6 text-base text-gray-700 leading-relaxed">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
