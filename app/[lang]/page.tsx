import { BirthdaySurprise } from "@/components/home/birthday-surprise";
import { CTASection } from "@/components/home/cta-section";
import { EventsPreview } from "@/components/home/events-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { HeroSection } from "@/components/home/hero-section";
// import { NewsPreview } from "@/components/home/news-preview";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getEvents, getGalleryAlbums, getPlayers } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const [players, events, albums] = await Promise.all([
    getPlayers(),
    getEvents(),
    getGalleryAlbums()
  ]);

  return (
    <>
      <HeroSection dict={dict.hero} lang={lang} playerCount={players.length} />
      <EventsPreview 
        dict={{...dict.events, types: dict.events_page.types}} 
        lang={lang} 
        events={events} 
      />
      {/* <NewsPreview dict={dict.news} lang={lang} /> */}
      <GalleryPreview dict={dict.gallery} lang={lang} albums={albums} />
      <CTASection dict={dict.cta} lang={lang} />
      <BirthdaySurprise dict={dict.birthday} />
    </>
  );
}
