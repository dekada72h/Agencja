import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-gradient-dark text-gray-300">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="font-display font-bold text-xl text-white">
            Dekada<span className="text-gradient-primary">72H</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            {t("brand_desc")}
          </p>
        </div>

        <nav className="space-y-3">
          <div className="text-white text-sm font-semibold uppercase tracking-wider">
            {tNav("services")}
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-white">{tNav("services")}</Link></li>
            <li><Link href="/portfolio" className="hover:text-white">{tNav("portfolio")}</Link></li>
            <li><Link href="/blog" className="hover:text-white">{tNav("blog")}</Link></li>
            <li><Link href="/tools" className="hover:text-white">{tNav("tools")}</Link></li>
          </ul>
        </nav>

        <nav className="space-y-3">
          <div className="text-white text-sm font-semibold uppercase tracking-wider">
            {tNav("about")}
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">{tNav("about")}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{tNav("contact")}</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </nav>

        <div className="space-y-3">
          <div className="text-white text-sm font-semibold uppercase tracking-wider">
            {tNav("contact")}
          </div>
          <ul className="space-y-2 text-sm">
            <li>Wrocław, Polska</li>
            <li><a href="mailto:kontakt@dekada72h.com" className="hover:text-white">kontakt@dekada72h.com</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-6 flex flex-col md:flex-row gap-2 items-center justify-between text-xs text-gray-500">
          <span>© {year} Dekada72H. {t("rights")}.</span>
          <span>{t("made_by")} Dekada72H</span>
        </div>
      </div>
    </footer>
  );
}
