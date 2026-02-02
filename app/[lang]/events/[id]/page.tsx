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

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className={`capitalize px-3 py-1 ${eventTypeColors[event.type]}`}>
              {dict.events_page.types[event.type]}
            </Badge>
            <span className="text-muted-foreground text-sm font-medium">
              {formattedDate}
            </span>
          </div>
          
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-primary/5">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Tarih</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-primary/5">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Saat</p>
                <p className="font-medium">{formatTime(event.time)} {event.endTime ? `- ${formatTime(event.endTime)}` : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-primary/5">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Konum</p>
                {event.locationUrl ? (
                  <a 
                    href={event.locationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium underline decoration-primary/30 underline-offset-4 hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {event.location}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="font-medium">{event.location}</p>
                )}
              </div>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
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
