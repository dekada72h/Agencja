"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type Contact = {
  id: number;
  date: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: "new" | "responded" | "closed";
};

const statusStyles: Record<Contact["status"], string> = {
  new: "bg-emerald-50 text-emerald-700 border-emerald-200",
  responded: "bg-blue-50 text-blue-700 border-blue-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusLabel: Record<Contact["status"], string> = {
  new: "Nowe",
  responded: "Odpowiedziano",
  closed: "Zamknięte",
};

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const [filter, setFilter] = useState<"all" | Contact["status"]>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return contacts
      .filter((c) => filter === "all" || c.status === filter)
      .filter((c) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q)
        );
      });
  }, [contacts, filter, query]);

  const counts = useMemo(() => {
    return contacts.reduce(
      (acc, c) => {
        acc[c.status] += 1;
        acc.all += 1;
        return acc;
      },
      { all: 0, new: 0, responded: 0, closed: 0 } as Record<"all" | Contact["status"], number>,
    );
  }, [contacts]);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-5 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "responded", "closed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                filter === f ? "text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              )}
            >
              {filter === f && (
                <motion.span
                  layoutId="contacts-filter-pill"
                  className="absolute inset-0 bg-gradient-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">
                {f === "all" ? "Wszystkie" : statusLabel[f]} · {counts[f]}
              </span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj po nazwisku, email, usłudze…"
          className="px-4 py-2 rounded-full border border-gray-200 text-sm w-full sm:w-64 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Imię i nazwisko</th>
              <th className="px-5 py-3 hidden md:table-cell">Email</th>
              <th className="px-5 py-3 hidden lg:table-cell">Telefon</th>
              <th className="px-5 py-3">Usługa</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {visible.map((c) => (
                <motion.tr
                  key={c.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                >
                  <td className="px-5 py-4 text-gray-600 tabular-nums whitespace-nowrap">{c.date}</td>
                  <td className="px-5 py-4 font-medium text-ink">{c.name}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <a href={`mailto:${c.email}`} className="text-primary hover:underline">
                      {c.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-600 whitespace-nowrap">
                    <a href={`tel:${c.phone.replace(/\s+/g, "")}`} className="hover:text-primary">
                      {c.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{c.service}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        statusStyles[c.status]
                      )}
                    >
                      {statusLabel[c.status]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-gray-500">
            Brak zapytań pasujących do filtra.
          </p>
        )}
      </div>
    </div>
  );
}
