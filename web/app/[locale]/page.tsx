import { setRequestLocale } from "next-intl/server";
import { HeroStub } from "@/components/hero-stub";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HeroStub />;
}
