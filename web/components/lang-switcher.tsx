"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

const labels: Record<(typeof routing.locales)[number], string> = {
  pl: "PL",
  en: "EN",
  de: "DE",
};

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100/80 p-1 text-xs font-medium">
      {routing.locales.map((lng) => (
        <button
          key={lng}
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => router.replace(pathname, { locale: lng }))
          }
          className={cn(
            "px-2.5 py-1 rounded-full transition-colors",
            lng === locale
              ? "bg-white text-ink shadow-sm"
              : "text-gray-600 hover:text-ink"
          )}
        >
          {labels[lng]}
        </button>
      ))}
    </div>
  );
}
