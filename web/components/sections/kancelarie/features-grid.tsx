"use client";

import { motion } from "motion/react";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import type { SVGProps } from "react";

const People = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const FileText = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const PhoneOut = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
    <path d="M15 2h6v6" />
    <line x1="21" y1="2" x2="14" y2="9" />
  </svg>
);
const Lock = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const Search = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);
const Layers = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const features = [
  { Icon: People, title: "Profile prawników ze zdjęciami", desc: "Klienci chcą wiedzieć, komu powierzają sprawę. Profesjonalne zdjęcie, opis doświadczenia, specjalizacje — to buduje relację jeszcze przed pierwszym spotkaniem." },
  { Icon: FileText, title: "Czytelny opis specjalizacji", desc: "Prawo cywilne, karne, rodzinne, gospodarcze, pracy — klient musi szybko znaleźć to, czego szuka. Każda specjalizacja powinna mieć osobną podstronę w języku zrozumiałym dla laika." },
  { Icon: PhoneOut, title: "Kontakt, który zachęca do działania", desc: "Numer telefonu widoczny na każdej podstronie. Formularz, który nie pyta o dwadzieścia rzeczy naraz. Adres z mapką. Godziny pracy. Skontaktowanie się z Tobą ma być proste." },
  { Icon: Lock, title: "Zgodność z RODO i bezpieczeństwo", desc: "Kancelarie przetwarzają wrażliwe dane klientów. Strona musi mieć certyfikat SSL, politykę prywatności zgodną z RODO i bezpieczny formularz kontaktowy. To nie opcja — to obowiązek." },
  { Icon: Search, title: "Blog z poradami prawnymi", desc: "Blog to potężne narzędzie SEO i budowania autorytetu. Artykuły typu \"Co grozi za jazdę po alkoholu\" czy \"Jak przebiega podział majątku\" przyciągają setki odwiedzin miesięcznie." },
  { Icon: Layers, title: "Szybkość i mobile-first", desc: "Ponad 60% wejść na strony kancelarii pochodzi z telefonów. Strona, która ładuje się 5 sekund na komórce, traci większość odwiedzających. Reguła: poniżej 1s na desktop, 2s na mobile." },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Elementy strony
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink">
            Co powinna zawierać strona kancelarii prawnej
          </h2>
          <p className="mt-5 text-lg text-gray-600">
            Strona kancelarii to nie wizytówka z adresem i numerem telefonu. To narzędzie, które ma
            przekonać niepewnego klienta, że trafił we właściwe miejsce.
          </p>
        </Reveal>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ Icon, title, desc }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="h-full rounded-2xl bg-white border border-gray-100 p-7 hover:shadow-glow hover:border-primary/30 transition-shadow"
              >
                <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center shadow-soft">
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 font-display font-semibold text-lg text-ink">{title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
