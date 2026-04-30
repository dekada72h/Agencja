import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/reveal";
import { Pin, Phone, Clock } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("meta.desc"),
    alternates: {
      canonical: locale === "pl" ? "https://dekada72h.com/contact" : `https://dekada72h.com/${locale}/contact`,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: t("breadcrumb") }]}
        title={t("header.title")}
        subtitle={t("header.desc")}
      />

      {/* Info Card */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal direction="left" className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink">
              {t("info.title")}
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">{t("info.desc")}</p>

            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center flex-shrink-0">
                  <Pin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-base text-ink">
                    {t("info.address.label")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    ul. Jedności Narodowej
                    <br />
                    50-260 Wrocław
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="inline-flex w-12 h-12 rounded-xl bg-gradient-primary text-white items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-base text-ink">
                    {t("info.phone.label")}
                  </h3>
                  <a
                    href="tel:+48662529962"
                    className="mt-1 inline-block text-sm text-primary font-medium hover:underline"
                  >
                    +48 662 529 962
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="flex items-center gap-2 font-display font-semibold text-base text-ink">
                <Clock className="w-5 h-5 text-primary" />
                {t("info.hours.title")}
              </h3>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">{t("info.hours.days")}</span>
                <span className="text-ink font-medium">9:00 - 21:00</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Quick Contact Card */}
      <section className="pb-20">
        <div className="mx-auto max-w-md px-6">
          <Reveal>
            <div className="rounded-2xl bg-white p-7 text-center shadow-soft hover:shadow-glow transition-shadow">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-primary text-white items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </span>
              <h3 className="font-display font-semibold text-lg text-ink">
                {t("quick.call.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{t("quick.call.desc")}</p>
              <a
                href="tel:+48662529962"
                className="mt-4 inline-flex items-center gap-2 text-primary font-semibold"
              >
                +48 662 529 962
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="text-center mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("map.label")}
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl text-ink">
              {t("map.title")}
            </h2>
            <p className="mt-3 text-gray-600">{t("map.desc")}</p>
          </Reveal>
          <Reveal>
            <div className="aspect-[16/8] rounded-3xl overflow-hidden shadow-xl">
              <iframe
                title="Dekada72H Wrocław"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2504.8876036097693!2d17.03847731579453!3d51.11391797957558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fc276d8f6e9e5%3A0x3f3c0e3b4a9c9e0a!2sul.%20Jedno%C5%9Bci%20Narodowej%2C%20Wroc%C5%82aw!5e0!3m2!1spl!2spl!4v1703000000000!5m2!1spl!2spl"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
