import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl handles locale rewriting for all routes (including /panel/*).
// Authentication for /panel/* is enforced server-side in
// app/[locale]/(panel)/panel/layout.tsx via `auth()` + redirect("/panel/login").

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
