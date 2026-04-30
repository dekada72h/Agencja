import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next internals
    // - static files (with extensions like .ico, .png, .jpg, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
