import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en", "de"],
  defaultLocale: "pl",
  localePrefix: "as-needed", // PL has no prefix; /en, /de get prefix
});

export type Locale = (typeof routing.locales)[number];
