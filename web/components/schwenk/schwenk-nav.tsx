"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Magnetic } from "./magnetic";
import { useCursor } from "./cursor-context";

const links = [
  { href: "/portfolio/Katarzyna-Schwenk", label: "Strona główna" },
  { href: "/portfolio/Katarzyna-Schwenk/o-mnie", label: "O mnie" },
  { href: "/portfolio/Katarzyna-Schwenk/galeria", label: "Galeria" },
  { href: "/portfolio/Katarzyna-Schwenk/kontakt", label: "Kontakt" },
];

export function SchwenkNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setVariant } = useCursor();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-[background,backdrop-filter,box-shadow] duration-500 ${
        scrolled
          ? "bg-[color-mix(in_srgb,var(--sk-cream)_88%,transparent)] backdrop-blur-xl border-b border-[var(--sk-line)]/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
        <Magnetic strength={0.18}>
          <Link
            href="/portfolio/Katarzyna-Schwenk"
            onMouseEnter={() => setVariant("magnet")}
            onMouseLeave={() => setVariant("default")}
            className="font-cormorant text-2xl tracking-[0.01em] text-[var(--sk-ink)]"
          >
            Katarzyna{" "}
            <span className="italic text-[var(--sk-rose-deep)]">Schwenk</span>
          </Link>
        </Magnetic>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => {
            const active =
              l.href === "/portfolio/Katarzyna-Schwenk"
                ? pathname === l.href || pathname === l.href + "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setVariant("magnet")}
                onMouseLeave={() => setVariant("default")}
                className="relative group text-sm tracking-wide text-[var(--sk-charcoal)] hover:text-[var(--sk-ink)] transition-colors"
              >
                {l.label}
                <span
                  className={`absolute left-0 -bottom-1 h-px bg-[var(--sk-rose-deep)] transition-all duration-500 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden relative w-10 h-10 inline-flex items-center justify-center text-[var(--sk-ink)]"
        >
          <span className="relative w-6 h-4 block">
            <span
              className={`absolute left-0 right-0 h-px bg-current transition-transform ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-1.5 h-px bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-px bg-current transition-transform ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[var(--sk-cream)]/95 backdrop-blur-xl border-t border-[var(--sk-line)]"
          >
            <nav className="mx-auto max-w-[1280px] px-6 py-8 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                >
                  <Link
                    href={l.href}
                    className="block py-3 font-cormorant text-2xl text-[var(--sk-ink)] hover:text-[var(--sk-rose-deep)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
