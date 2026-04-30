"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Check, Arrow } from "@/components/icons";

const FORMSPREE = "https://formspree.io/f/xlgneypa";

type ProjectType = "wizytowka" | "landing" | "sklep" | "rozbudowana";
type PagesRange = "1-5" | "6-10" | "11-20" | "20+";
type Timeline = "standard" | "ekspres" | "pilny";
type Feature =
  | "formularz" | "galeria" | "blog" | "rezerwacje"
  | "animacje" | "wielojezycznosc" | "automatyzacja" | "social";

const PROJECT_BASE: Record<ProjectType, number> = {
  wizytowka: 1500, landing: 1200, sklep: 4000, rozbudowana: 3500,
};
const PAGES_PRICE: Record<PagesRange, number> = {
  "1-5": 0, "6-10": 500, "11-20": 1200, "20+": 2500,
};
const TIMELINE_MULT: Record<Timeline, number> = {
  standard: 1, ekspres: 1.25, pilny: 1.5,
};
const FEATURE_PRICE: Record<Feature, number> = {
  formularz: 0, galeria: 400, blog: 700, rezerwacje: 900,
  animacje: 500, wielojezycznosc: 600, automatyzacja: 1000, social: 300,
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const fmt = (n: number) =>
  new Intl.NumberFormat("pl-PL").format(Math.round(n)) + " zł";

export function PriceCalculator() {
  const tt = useTranslations("tools");
  const t = (k: string) => tt(`calc.${k}`);
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ProjectType | null>(null);
  const [pages, setPages] = useState<PagesRange | null>(null);
  const [features, setFeatures] = useState<Set<Feature>>(new Set());
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  const total = useMemo(() => {
    const base = type ? PROJECT_BASE[type] : 0;
    const pagesAdd = pages ? PAGES_PRICE[pages] : 0;
    const featAdd = [...features].reduce((s, f) => s + FEATURE_PRICE[f], 0);
    const subtotal = base + pagesAdd + featAdd;
    const mult = timeline ? TIMELINE_MULT[timeline] : 1;
    return subtotal * mult;
  }, [type, pages, features, timeline]);

  const canNext = (s: number) =>
    (s === 1 && type) ||
    (s === 2 && pages) ||
    (s === 3) || // features optional
    (s === 4 && timeline);

  const toggleFeature = (f: Feature) => {
    setFeatures((curr) => {
      const next = new Set(curr);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const reset = () => {
    setStep(1); setType(null); setPages(null);
    setFeatures(new Set()); setTimeline(null);
    setStatus("idle");
  };

  const projectSummary = useMemo(() => {
    if (!type) return "";
    return [
      `Typ: ${type}`,
      pages ? `Podstrony: ${pages}` : "",
      features.size ? `Funkcje: ${[...features].join(", ")}` : "",
      timeline ? `Termin: ${timeline}` : "",
      `Wycena: ${fmt(total)}`,
    ].filter(Boolean).join(" | ");
  }, [type, pages, features, timeline, total]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const data = new FormData(e.currentTarget);
    data.set("source", "Kalkulator wyceny");
    data.set("project_summary", projectSummary);
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-primary p-8 lg:p-10 text-white text-center">
        <h2 className="font-display font-bold text-2xl lg:text-3xl">
          {tt("calculator.header._self")}
        </h2>
        <p className="mt-2 text-white/85 text-sm">{tt("calculator.header.desc")}</p>
      </div>

      {/* Progress */}
      <div className="px-6 lg:px-10 pt-8 flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              n <= Math.min(step, 4) ? "bg-gradient-primary" : "bg-gray-200"
            )}
          />
        ))}
      </div>

      {/* Body */}
      <div className="px-6 lg:px-10 py-10 min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step key={1} title={t("step1.title")} desc={t("step1.desc")}>
              <CardGrid>
                <OptionCard
                  selected={type === "wizytowka"}
                  onClick={() => setType("wizytowka")}
                  title={t("type.wizytowka._self")}
                  desc={t("type.wizytowka.desc")}
                  hint="od 1 500 zł"
                />
                <OptionCard
                  selected={type === "landing"}
                  onClick={() => setType("landing")}
                  title={t("type.landing._self")}
                  desc={t("type.landing.desc")}
                  hint="od 1 200 zł"
                />
                <OptionCard
                  selected={type === "sklep"}
                  onClick={() => setType("sklep")}
                  title={t("type.sklep._self")}
                  desc={t("type.sklep.desc")}
                  hint="od 4 000 zł"
                />
                <OptionCard
                  selected={type === "rozbudowana"}
                  onClick={() => setType("rozbudowana")}
                  title={t("type.rozbudowana._self")}
                  desc={t("type.rozbudowana.desc")}
                  hint="od 3 500 zł"
                />
              </CardGrid>
            </Step>
          )}

          {step === 2 && (
            <Step key={2} title={t("step2.title")} desc={t("step2.desc")}>
              <CardGrid>
                <OptionCard selected={pages === "1-5"} onClick={() => setPages("1-5")} title="1-5 podstron" desc={t("pages.small")} hint={t("pages.included")} />
                <OptionCard selected={pages === "6-10"} onClick={() => setPages("6-10")} title="6-10 podstron" desc={t("pages.medium")} hint="+500 zł" />
                <OptionCard selected={pages === "11-20"} onClick={() => setPages("11-20")} title="11-20 podstron" desc={t("pages.large")} hint="+1 200 zł" />
                <OptionCard selected={pages === "20+"} onClick={() => setPages("20+")} title="20+ podstron" desc={t("pages.xlarge")} hint="+2 500 zł" />
              </CardGrid>
            </Step>
          )}

          {step === 3 && (
            <Step key={3} title={t("step3.title")} desc={t("step3.desc")}>
              <div className="grid sm:grid-cols-2 gap-3">
                {(Object.keys(FEATURE_PRICE) as Feature[]).map((f) => {
                  const tKey =
                    f === "wielojezycznosc" ? "multilang" :
                    f === "rezerwacje" ? "booking" :
                    f === "formularz" ? "form" :
                    f === "galeria" ? "gallery" :
                    f === "animacje" ? "animations" :
                    f === "automatyzacja" ? "automation" :
                    f === "social" ? "social" :
                    f; // blog
                  const checked = features.has(f);
                  const price = FEATURE_PRICE[f];
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors",
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      )}
                    >
                      <span
                        className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
                          checked ? "bg-gradient-primary text-white" : "bg-gray-100 text-transparent"
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink">
                          {t(`feature.${tKey}._self`)}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {t(`feature.${tKey}.desc`)}
                        </div>
                      </div>
                      <div className={cn("text-xs font-bold whitespace-nowrap", price === 0 ? "text-emerald-600" : "text-primary")}>
                        {price === 0 ? t("free") : `+${fmt(price)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step key={4} title={t("step4.title")} desc={t("step4.desc")}>
              <div className="grid sm:grid-cols-3 gap-3">
                <OptionCard selected={timeline === "standard"} onClick={() => setTimeline("standard")} title={t("time.standard._self")} desc={t("time.standard.desc")} hint={t("time.standard.price")} />
                <OptionCard selected={timeline === "ekspres"} onClick={() => setTimeline("ekspres")} title={t("time.express._self")} desc={t("time.express.desc")} hint="+25%" />
                <OptionCard selected={timeline === "pilny"} onClick={() => setTimeline("pilny")} title={t("time.urgent._self")} desc={t("time.urgent.desc")} hint="+50%" />
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step key={5} title={t("step5.title")} desc={t("step5.desc")}>
              <div className="rounded-2xl bg-gray-50 p-6 lg:p-8 mb-8">
                <h4 className="font-display font-semibold text-base text-ink mb-4">
                  {t("summary.title")}
                </h4>
                <dl className="space-y-3 text-sm">
                  <SummaryRow label={t("summary.type")} value={type ?? "-"} />
                  <SummaryRow label={t("summary.pages")} value={pages ?? "-"} />
                  <SummaryRow
                    label={t("summary.features")}
                    value={features.size ? [...features].join(", ") : "-"}
                  />
                  <SummaryRow label={t("summary.timeline")} value={timeline ?? "-"} />
                </dl>
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-baseline justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                    {t("summary.total")}
                  </span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className="font-display font-bold text-3xl lg:text-4xl text-gradient-primary"
                  >
                    {fmt(total)}
                  </motion.span>
                </div>
                <p className="mt-3 text-xs text-gray-500">{t("summary.note")}</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <h3 className="font-display font-semibold text-xl text-ink">
                  {t("form.title")}
                </h3>
                <p className="text-sm text-gray-600">{t("form.desc")}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <CalcField name="name" label={`${t("form.name")} *`} required />
                  <CalcField name="email" type="email" label={`${t("form.email")} *`} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <CalcField name="phone" type="tel" label={`${t("form.phone")} *`} required />
                  <CalcField name="company" label={t("form.company")} />
                </div>
                <div>
                  <label htmlFor="calc-message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("form.message")}
                  </label>
                  <textarea
                    id="calc-message"
                    name="message"
                    placeholder="Opisz swój projekt, branżę, oczekiwania..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-ink resize-y min-h-[100px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu przygotowania wyceny. Zapoznałem/am się z{" "}
                    <Link href="/privacy" className="text-primary font-medium hover:underline">
                      polityką prywatności
                    </Link>.
                  </span>
                </label>
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3.5 rounded-full bg-gradient-primary text-white font-semibold shadow-soft hover:shadow-glow disabled:opacity-60 disabled:cursor-wait transition-shadow"
                >
                  {status === "submitting" ? "Wysyłanie…" : t("form.submit")}
                </motion.button>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm text-center"
                    >
                      Dziękujemy! Otrzymaliśmy Twoje zapytanie. Skontaktujemy się w ciągu 24h ze szczegółową wyceną.
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm text-center"
                    >
                      Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się telefonicznie.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Step>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="px-6 lg:px-10 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t("back")}
        </button>
        {step < 5 && (
          <button
            type="button"
            onClick={() => canNext(step) && setStep((s) => Math.min(5, s + 1))}
            disabled={!canNext(step)}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-white text-sm font-semibold shadow-soft hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed transition-shadow"
          >
            {step === 4 ? t("summary._self") : t("next")}
            <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
        {step === 5 && (
          <button
            type="button"
            onClick={reset}
            className="px-6 py-2.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-primary transition-colors"
          >
            {t("restart")}
          </button>
        )}
      </div>
    </div>
  );
}

function Step({
  title, desc, children,
}: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="font-display font-bold text-2xl text-ink">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
      <div className="mt-8">{children}</div>
    </motion.div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function OptionCard({
  selected, onClick, title, desc, hint,
}: {
  selected: boolean; onClick: () => void;
  title: string; desc: string; hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative p-5 rounded-2xl border-2 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-gray-300 bg-white"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-display font-semibold text-base text-ink">{title}</div>
        {selected && (
          <span className="inline-flex w-6 h-6 rounded-full bg-gradient-primary text-white items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
      <div className="mt-1.5 text-xs text-gray-600">{desc}</div>
      <div className="mt-3 inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
        {hint}
      </div>
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function CalcField({
  name, label, type = "text", required,
}: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={`calc-${name}`} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={`calc-${name}`}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
      />
    </div>
  );
}
