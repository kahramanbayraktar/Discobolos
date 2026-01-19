import { CTASection } from "@/components/home/cta-section";
import { EventsPreview } from "@/components/home/events-preview";
import { HeroSection } from "@/components/home/hero-section";
import { NewsPreview } from "@/components/home/news-preview";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <HeroSection dict={dict.hero} lang={lang} />
      <EventsPreview dict={dict.events} lang={lang} />
      <NewsPreview dict={dict.news} lang={lang} />
      <CTASection dict={dict.cta} lang={lang} />
    </>
  );
}
