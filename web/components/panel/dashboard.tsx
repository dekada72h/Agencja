"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { Arrow } from "@/components/icons";

// Dashboard overview. The numbers below are placeholders — wire them to
// real data sources in a follow-up:
//   • visitorsToday/Week → Plausible / GA4 Reporting API
//   • contactsThisMonth  → Formspree webhook → /api/webhook/contact → DB
//   • topPosts           → Plausible groupBy(page) for /blog/*
// For now they read from a small mock so the page is demonstrable.

const mock = {
  visitorsToday: 142,
  visitorsWeek: 1037,
  contactsThisMonth: 8,
  blogReadsWeek: 412,
  recentContacts: [
    { id: 1, name: "Anna Kowalska", email: "anna.k@example.com", subject: "Strona dla kancelarii", date: "2 godz. temu" },
    { id: 2, name: "Piotr Nowak", email: "piotr@nowak-kancelaria.pl", subject: "Wycena landing page", date: "wczoraj" },
    { id: 3, name: "Magdalena Wiśniewska", email: "m.wisniewska@example.com", subject: "SEO — Wrocław", date: "2 dni temu" },
  ],
  topRoutes: [
    { path: "/services", views: 312 },
    { path: "/blog/jak-zwiekszyc-konwersje-na-stronie", views: 187 },
    { path: "/portfolio/Katarzyna-Schwenk", views: 124 },
    { path: "/portfolio", views: 98 },
    { path: "/strony-internetowe-dla-kancelarii-wroclaw", views: 76 },
  ],
};

export function Dashboard({
  user,
}: {
  user: { email: string; name: string; role: "owner" | "partner" };
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10">
      <Reveal>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">
          Cześć, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-2 text-gray-600">
          Krótkie podsumowanie ostatniego tygodnia.
        </p>
      </Reveal>

      {/* Stats */}
      <StaggerChildren className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Wizyty dziś" value={mock.visitorsToday} suffix="" />
        <StatCard label="Wizyty 7d" value={mock.visitorsWeek} suffix="" />
        <StatCard label="Zapytania mies." value={mock.contactsThisMonth} suffix="" />
        <StatCard label="Czytania bloga 7d" value={mock.blogReadsWeek} suffix="" />
      </StaggerChildren>

      <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Recent contacts */}
        <Reveal direction="left" className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg text-ink">
              Ostatnie zapytania
            </h2>
            <Link
              href="/panel/contacts"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all"
            >
              wszystkie <Arrow className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {mock.recentContacts.map((c) => (
              <motion.li
                key={c.id}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="py-4 flex items-start gap-3"
              >
                <span className="inline-flex w-9 h-9 rounded-full bg-gradient-primary text-white items-center justify-center font-semibold text-sm shrink-0">
                  {c.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-ink truncate">{c.name}</span>
                    <span className="text-xs text-gray-500 shrink-0">{c.date}</span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">{c.subject}</div>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {c.email}
                  </a>
                </div>
              </motion.li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] text-gray-400 italic">
            Dane w tym widoku są przykładowe. Po podpięciu webhooka Formspree
            (lub innego źródła) wskoczą tu prawdziwe zapytania.
          </p>
        </Reveal>

        {/* Top routes */}
        <Reveal direction="right" className="rounded-2xl bg-white border border-gray-100 p-6">
          <h2 className="font-display font-semibold text-lg text-ink mb-5">
            Najczęściej oglądane
          </h2>
          <ul className="space-y-3">
            {mock.topRoutes.map((r, i) => (
              <motion.li
                key={r.path}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-center justify-between gap-3"
              >
                <Link
                  href={r.path}
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-gray-700 hover:text-primary truncate"
                >
                  {r.path}
                </Link>
                <span className="text-sm font-semibold text-ink shrink-0 tabular-nums">
                  {r.views}
                </span>
              </motion.li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] text-gray-400 italic">
            Po podpięciu Plausible / GA4 Reporting API.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-soft transition-shadow"
      >
        <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </div>
        <div className="mt-2 font-display font-bold text-3xl text-ink leading-none">
          <Counter to={value} suffix={suffix} />
        </div>
      </motion.div>
    </StaggerItem>
  );
}
