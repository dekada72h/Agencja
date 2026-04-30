"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LangSwitcher } from "./lang-switcher";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/blog", key: "blog" },
  { href: "/tools", key: "tools" },
  { href: "/contact", key: "contact" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-[background,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgb(0_0_0_/_0.04)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display font-bold text-lg lg:text-xl tracking-tight text-ink"
        >
          Dekada<span className="text-gradient-primary">72H</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map(({ href, key }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-gray-700 hover:text-ink"
                )}
              >
                {t(key)}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gradient-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-medium shadow-soft hover:shadow-glow transition-shadow"
          >
            {t("cta")}
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-md text-ink"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative w-5 h-3.5 block">
              <span
                className={cn(
                  "absolute left-0 right-0 h-0.5 bg-current transition-transform",
                  open ? "top-1.5 rotate-45" : "top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 top-1.5 h-0.5 bg-current transition-opacity",
                  open && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 h-0.5 bg-current transition-transform",
                  open ? "top-1.5 -rotate-45" : "top-3"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
          >
            <div className="mx-auto max-w-[1200px] px-6 py-6 flex flex-col gap-1">
              {links.map(({ href, key }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-2 py-3 text-base font-medium text-gray-800 hover:text-primary"
                >
                  {t(key)}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center justify-center px-5 py-3 rounded-full bg-gradient-primary text-white font-medium"
              >
                {t("cta")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
