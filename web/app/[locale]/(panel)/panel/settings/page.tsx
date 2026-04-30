import type { Metadata } from "next";
import { auth } from "@/auth";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Ustawienia · Panel | Dekada72H",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await auth();
  const u = session!.user;

  return (
    <div className="mx-auto max-w-[800px] px-6 lg:px-10 py-10">
      <Reveal>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">
          Ustawienia
        </h1>
        <p className="mt-2 text-gray-600">Twoje konto i ustawienia panelu.</p>
      </Reveal>

      <Reveal>
        <section className="mt-10 rounded-2xl bg-white border border-gray-100 p-7">
          <h2 className="font-display font-semibold text-lg text-ink mb-6">
            Konto
          </h2>
          <dl className="divide-y divide-gray-100">
            <Row label="Imię i nazwisko" value={u.name} />
            <Row label="Email" value={u.email} />
            <Row label="Rola" value={u.role === "owner" ? "Właściciel" : "Wspólnik"} />
          </dl>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-6 rounded-2xl bg-white border border-gray-100 p-7">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">
            Zmiana hasła
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hasła wspólników są przechowywane jako bcrypt-hashe w pliku{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs">
              data/partners.json
            </code>{" "}
            poza obrazem Dockera. Aby zmienić hasło, wygeneruj nowy hash i
            podmień plik na VPSie — instrukcja w{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-xs">
              web/data/README.md
            </code>
            .
          </p>
          <p className="mt-3 text-xs text-gray-400 italic">
            Wkrótce: panel zmiany hasła z poziomu UI.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-6 rounded-2xl bg-white border border-gray-100 p-7">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">
            Integracje
          </h2>
          <ul className="space-y-3 text-sm">
            <Integration
              name="Formspree"
              status="planned"
              note="Webhook do zapisu zapytań w bazie panelu."
            />
            <Integration
              name="Plausible / GA4"
              status="planned"
              note="Statystyki wizyt i top routes na dashboardzie."
            />
            <Integration
              name="Resend (magic links)"
              status="planned"
              note="Logowanie linkiem mailowym zamiast hasła."
            />
          </ul>
        </section>
      </Reveal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 text-sm">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function Integration({
  name,
  status,
  note,
}: {
  name: string;
  status: "active" | "planned";
  note: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          status === "active"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}
      >
        {status === "active" ? "Aktywne" : "Planowane"}
      </span>
      <div>
        <div className="font-medium text-ink">{name}</div>
        <div className="text-xs text-gray-600">{note}</div>
      </div>
    </li>
  );
}
