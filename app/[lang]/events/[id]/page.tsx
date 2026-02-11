import { RSVPSurvey } from "@/components/events/rsvp-survey";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getEventById, getPlayers, getRSVPs } from "@/lib/supabase";
import { getServerPlayer } from "@/lib/supabase/server";
import { formatTime } from "@/lib/utils";
import { Calendar, ChevronLeft, Clock, ExternalLink, MapPin } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EventDetailPageProps {
  params: Promise<{ lang: Locale; id: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const event = await getEventById(id);
  const dict = await getDictionary(lang);

  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} | Discobolos`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  
  const event = await getEventById(id);
  if (!event) notFound();

  const rsvps = await getRSVPs(id);
  const players = await getPlayers();
  const currentPlayer = await getServerPlayer();

  const dateObject = new Date(event.date);
  const formattedDate = dateObject.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const eventTypeColors: Record<string, string> = {
    practice: "bg-primary/10 text-primary border-primary/20",
    match: "bg-accent/10 text-accent border-accent/20",
    social: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    tournament: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  };

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8 hover:bg-primary/5 group">
          <Link href={`/${lang}/events`} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {dict.event_detail.back_to_events}
          </Link>
        </Button>

        {/* Header Section with Poster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Left Column: Poster Image */}
          <div className="lg:col-span-5 xl:col-span-4">
            {event.image ? (
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-primary/10 bg-muted/30">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                  className="object-cover transition-transform hover:scale-[1.02] duration-500"
                  priority
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] rounded-2xl bg-muted/30 border border-primary/10 flex items-center justify-center">
                 <div className="text-center p-6 text-muted-foreground">
                    <span className="block text-4xl mb-4">🎨</span>
                    No Poster Available
                 </div>
              </div>
            )}
          </div>

          {/* Right Column: Event Info */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
             <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="outline" className={`capitalize px-3 py-1 text-sm ${eventTypeColors[event.type]}`}>
                {dict.events_page.types[event.type]}
              </Badge>
              <span className="text-muted-foreground font-medium">
                {formattedDate}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {event.title}
            </h1>

            <div className="grid gap-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-primary/5 hover:bg-muted/70 transition-colors">
                <div className="p-2.5 bg-background rounded-lg text-primary shadow-sm mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Tarih</p>
                  <p className="font-medium text-lg">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-primary/5 hover:bg-muted/70 transition-colors">
                <div className="p-2.5 bg-background rounded-lg text-primary shadow-sm mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Saat</p>
                  <p className="font-medium text-lg">
                    {formatTime(event.time)} {event.endTime ? `- ${formatTime(event.endTime)}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-primary/5 hover:bg-muted/70 transition-colors">
                <div className="p-2.5 bg-background rounded-lg text-primary shadow-sm mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Konum</p>
                  {event.locationUrl ? (
                    <a 
                      href={event.locationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-lg underline decoration-primary/30 underline-offset-4 hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      {event.location}
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  ) : (
                    <p className="font-medium text-lg">{event.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
             <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-4">Etkinlik Detayları</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>

        {/* Survey Section */}
        <div className="mt-16 pt-16 border-t border-primary/10">
          <RSVPSurvey 
            eventId={id}
            currentPlayer={currentPlayer}
            initialRSVPs={rsvps}
            players={players}
            dict={dict}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}

