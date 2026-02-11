import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n-config";
import type { Event } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const eventTypeColors: Record<Event["type"], string> = {
  practice: "bg-primary/10 text-primary border-primary/20",
  match: "bg-accent/10 text-accent border-accent/20",
  social: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  tournament: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

function formatDate(dateString: string, locale: Locale) {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString(locale, { day: "numeric" }),
    month: date.toLocaleDateString(locale, { month: "short" }),
    weekday: date.toLocaleDateString(locale, { weekday: "short" }),
  };
}

export function EventsPreview({ dict, lang, events }: { dict: any, lang: Locale, events: Event[] }) {
  // Filter for future events and take first 3
  const now = new Date();
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date(now.setHours(0,0,0,0)))
    .slice(0, 3);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-primary mb-2">
              {dict.title}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              {dict.subtitle}
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 w-fit bg-transparent">
            <Link href={`/${lang}/events`}>
              {dict.view_all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-muted/30 rounded-2xl border-2 border-dashed border-muted">
              <p className="text-muted-foreground">{dict.empty}</p>
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const date = formatDate(event.date, lang);
              return (
                <Card
                  key={event.id}
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-none bg-card-gradient"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative w-full h-48 overflow-hidden bg-muted">
                      <Image
                        src={event.image || '/images/logo.png'}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized={!!event.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={`capitalize ${eventTypeColors[event.type]} backdrop-blur-md border-none`}
                        >
                          {dict.types ? dict.types[event.type] : event.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1">
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center bg-primary px-4 py-6 text-primary-foreground min-w-[80px]">
                        <span className="text-xs font-medium uppercase opacity-80">
                          {date.month}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-3xl font-bold">
                          {date.day}
                        </span>
                        <span className="text-xs opacity-80">{date.weekday}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            <Link href={`/${lang}/events/${event.id}`}>
                              {event.title}
                            </Link>
                          </h3>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>
                              {formatTime(event.time)}
                              {event.endTime && ` - ${formatTime(event.endTime)}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {event.opponent && (
                          <p className="text-sm font-semibold text-accent flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-accent" />
                            vs. {event.opponent}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

