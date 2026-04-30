"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/panel", label: "Dashboard" },
  { href: "/panel/contacts", label: "Zapytania" },
  { href: "/panel/settings", label: "Ustawienia" },
];

export function PanelNav({
  user,
  logout,
}: {
  user: { email: string; name?: string | null; role?: "owner" | "partner" };
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link
            href="/panel"
            className="font-display font-bold text-base text-ink"
          >
            Dekada<span className="text-gradient-primary">72H</span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              Panel
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => {
              const active =
                l.href === "/panel"
                  ? pathname === l.href
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-gray-700 hover:text-ink"
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="panel-underline"
                      className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-ink">
              {user.name ?? user.email}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              {user.role ?? "partner"}
            </span>
          </div>
          <span className="inline-flex w-9 h-9 rounded-full bg-gradient-primary text-white items-center justify-center font-display font-semibold text-sm">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="hidden md:inline-block px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Wyloguj
            </button>
          </form>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="md:hidden w-9 h-9 inline-flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-ink">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="mx-auto max-w-[1200px] px-6 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <form action={logout}>
              <button
                type="submit"
                className="mt-2 w-full px-3 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 text-left"
              >
                Wyloguj
              </button>
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}
