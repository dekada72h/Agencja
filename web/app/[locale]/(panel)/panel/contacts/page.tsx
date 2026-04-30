import type { Metadata } from "next";
import { ContactsTable } from "@/components/panel/contacts-table";

export const metadata: Metadata = {
  title: "Zapytania · Panel | Dekada72H",
  robots: { index: false, follow: false },
};

// Placeholder contact submissions. Wire to a real source in a follow-up:
//   1. add /api/webhook/contact endpoint (POST from Formspree)
//   2. write submissions to a small DB (SQLite/Postgres)
//   3. replace the mock array below with a server-side fetch from that DB
const mockContacts = [
  { id: 1,  date: "2026-04-29 14:22", name: "Anna Kowalska",       email: "anna.k@example.com",          phone: "+48 601 234 567", service: "Strony WWW",     status: "new" as const },
  { id: 2,  date: "2026-04-28 09:11", name: "Piotr Nowak",          email: "piotr@nowak-kancelaria.pl",   phone: "+48 502 111 333", service: "Landing Page",   status: "responded" as const },
  { id: 3,  date: "2026-04-27 16:48", name: "Magdalena Wiśniewska", email: "m.wisniewska@example.com",    phone: "+48 783 456 789", service: "SEO",             status: "new" as const },
  { id: 4,  date: "2026-04-26 11:03", name: "Tomasz Lewandowski",   email: "tlewandowski@example.com",    phone: "+48 695 222 444", service: "Automatyzacja",  status: "responded" as const },
  { id: 5,  date: "2026-04-25 17:30", name: "Karolina Mazur",       email: "k.mazur@example.com",         phone: "+48 730 555 111", service: "Inne",            status: "closed" as const },
  { id: 6,  date: "2026-04-22 10:14", name: "Jakub Wójcik",          email: "jakub.wojcik@example.com",    phone: "+48 660 100 200", service: "Strony WWW",     status: "responded" as const },
  { id: 7,  date: "2026-04-19 13:55", name: "Dorota Kamińska",       email: "dorota.k@example.com",        phone: "+48 502 999 888", service: "SEO",             status: "closed" as const },
  { id: 8,  date: "2026-04-15 08:42", name: "Marcin Szymański",      email: "marcin@szymanski.eu",         phone: "+48 660 700 600", service: "Strony WWW",     status: "closed" as const },
];

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">
            Zapytania
          </h1>
          <p className="mt-2 text-gray-600">
            Wszystkie wiadomości z formularza kontaktowego oraz kalkulatora wyceny.
          </p>
        </div>
      </div>
      <ContactsTable contacts={mockContacts} />
      <p className="mt-6 text-xs text-gray-400 italic">
        Powyższe dane są przykładowe. Po podpięciu webhooka z Formspree pojawią
        się tu prawdziwe zapytania.
      </p>
    </div>
  );
}
