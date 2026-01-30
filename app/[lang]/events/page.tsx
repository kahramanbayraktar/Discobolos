import { EventsPageContent } from "@/components/events/events-page-content";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { events } from "@/lib/data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.events_page.title,
    description: dict.events_page.description,
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">
            {dict.events_page.badge}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            {dict.events_page.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {dict.events_page.description}
          </p>
        </div>

        <EventsPageContent events={events} dict={dict} lang={lang} />
      </div>
    </div>
  );
}
