import { HeroSection } from "@/components/home/hero-section";
import { EventsPreview } from "@/components/home/events-preview";
import { NewsPreview } from "@/components/home/news-preview";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <EventsPreview />
      <NewsPreview />
      <CTASection />
    </>
  );
}
