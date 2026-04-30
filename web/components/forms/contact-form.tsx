"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgneypa";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto"
    >
      <h3 className="font-display font-bold text-2xl md:text-3xl text-ink text-center">
        {t("title")}
      </h3>
      <p className="mt-2 text-gray-600 text-center mb-8">{t("desc")}</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field name="name" type="text" label={t("name")} placeholder="Jan Kowalski" required />
        <Field name="email" type="email" label={t("email")} placeholder="jan@example.com" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <Field name="phone" type="tel" label={t("phone")} placeholder="+48 123 456 789" required />
        <SelectField
          name="service"
          label={t("service._self")}
          options={[
            { value: "", label: t("service.placeholder") },
            { value: "strona-www", label: t("service.www") },
            { value: "landing-page", label: t("service.landing") },
            { value: "seo", label: t("service.seo") },
            { value: "automatyzacja", label: t("service.auto") },
            { value: "inne", label: t("service.other") },
          ]}
        />
      </div>

      <div className="mt-5">
        <SelectField
          name="referral"
          label={t("referral._self")}
          options={[
            { value: "", label: t("referral.placeholder") },
            { value: "damian", label: t("referral.damian") },
            { value: "kuba", label: t("referral.kuba") },
            { value: "internet", label: t("referral.internet") },
          ]}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {t("message")} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Opisz swój projekt lub zadaj pytanie..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-ink resize-y min-h-[140px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
        />
      </div>

      <label className="mt-6 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 w-5 h-5 rounded border-2 border-gray-300 accent-primary cursor-pointer"
        />
        <span className="text-sm text-gray-600 leading-relaxed">
          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie.
          Zapoznałem/am się z{" "}
          <Link href="/privacy" className="text-primary font-medium hover:underline">
            polityką prywatności
          </Link>
          .
        </span>
      </label>

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-full px-8 py-4 rounded-full bg-gradient-primary text-white font-semibold text-base shadow-soft hover:shadow-glow disabled:opacity-60 disabled:cursor-wait transition-shadow"
      >
        {status === "submitting" ? "Wysyłanie…" : t("submit")}
      </motion.button>

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm text-center"
          >
            {t("success")}
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm text-center"
          >
            {t("error")}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({
  name,
  type,
  label,
  placeholder,
  required,
}: {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 bg-white text-ink appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-shadow"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
