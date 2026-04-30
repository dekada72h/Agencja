"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SchReveal } from "../reveal";
import { Magnetic } from "../magnetic";
import { useCursor } from "../cursor-context";

const FORMSPREE = "https://formspree.io/f/xlgneypa";

const details = [
  { label: "Email", value: "katarzyna.schwenk@example.com" },
  { label: "Pracownia", value: "Wrocław · zwiedzanie po umówieniu" },
  {
    label: "Instagram",
    value: "@katarzyna_schwenk_art",
    note: "(wkrótce)",
  },
  { label: "Sprzedaż", value: "Wybrane prace dostępne · zapytaj" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function ContactGrid() {
  const [status, setStatus] = useState<Status>("idle");
  const { setVariant } = useCursor();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("source", "Schwenk · kontakt");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* info column */}
          <SchReveal>
            <h2 className="font-cormorant text-[clamp(2rem,3.5vw,3rem)] text-[var(--sk-ink)] leading-[1.1]">
              Kilka słów
              <br />
              <em className="text-[var(--sk-rose-deep)]">na początek.</em>
            </h2>
            <p className="mt-6 text-lg text-[var(--sk-muted)] leading-relaxed max-w-md">
              Chętnie odpowiem na pytania o dostępne prace, ceny, indywidualne zlecenia
              portretowe lub udział w wystawach. Pisz po polsku lub angielsku — odpowiadam
              zwykle w ciągu 2–3 dni.
            </p>

            <dl className="mt-10 divide-y divide-[var(--sk-line)] border-y border-[var(--sk-line)]">
              {details.map((d) => (
                <motion.div
                  key={d.label}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-baseline gap-6 py-5"
                >
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-[var(--sk-rose-deep)] min-w-[110px]">
                    {d.label}
                  </dt>
                  <dd className="text-[var(--sk-ink)] text-base">
                    {d.value}{" "}
                    {d.note && <em className="text-[var(--sk-muted)] text-sm">{d.note}</em>}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </SchReveal>

          {/* form column */}
          <SchReveal delay={0.15}>
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <Field name="name" label="Imię i nazwisko" required />
              <Field name="email" label="Adres e-mail" type="email" required />
              <Field name="subject" label="Temat" placeholder="Zapytanie o pracę / Zlecenie / Inne" />
              <TextArea name="message" label="Wiadomość" required />

              <Magnetic strength={0.18}>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  onMouseEnter={() => setVariant("magnet")}
                  onMouseLeave={() => setVariant("default")}
                  className="inline-block px-8 py-4 bg-[var(--sk-ink)] text-[var(--sk-cream)] text-[11px] tracking-[0.3em] uppercase font-medium border border-[var(--sk-ink)] hover:bg-transparent hover:text-[var(--sk-ink)] disabled:opacity-50 disabled:cursor-wait transition-colors duration-500"
                >
                  {status === "submitting" ? "Wysyłanie…" : "Wyślij wiadomość"}
                </button>
              </Magnetic>

              <p className="text-[10px] tracking-[0.05em] text-[var(--sk-muted)] leading-relaxed">
                Wysyłając formularz wyrażasz zgodę na kontakt zwrotny. Twoje dane nie są
                przekazywane stronom trzecim.
              </p>

              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-cormorant italic text-lg text-[var(--sk-rose-deep)]"
                  >
                    Dziękuję. Odpowiem najszybciej jak to możliwe.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-cormorant italic text-lg text-[var(--sk-burgundy)]"
                  >
                    Coś poszło nie tak — spróbuj ponownie lub napisz bezpośrednio na e-mail.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </SchReveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  name, label, type = "text", placeholder, required,
}: {
  name: string; label: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--sk-muted)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="bg-transparent border-0 border-b border-[var(--sk-line)] focus:border-[var(--sk-rose-deep)] focus:outline-none py-3 text-base text-[var(--sk-ink)] placeholder:text-[var(--sk-muted)]/60 transition-colors"
      />
    </label>
  );
}

function TextArea({
  name, label, required,
}: { name: string; label: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--sk-muted)]">
        {label}
      </span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="bg-transparent border-0 border-b border-[var(--sk-line)] focus:border-[var(--sk-rose-deep)] focus:outline-none py-3 text-base text-[var(--sk-ink)] resize-y min-h-[120px] transition-colors"
      />
    </label>
  );
}
