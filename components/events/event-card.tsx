import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/lib/types";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  dict: any;
  lang: string;
  variant?: "default" | "compact";
}

const eventTypeColors: Record<Event["type"], string> = {
  practice: "bg-primary/10 text-primary border-primary/20",
  match: "bg-accent/10 text-accent-foreground border-accent/20",
  social: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  tournament: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

function formatDate(dateString: string, lang: string) {
  const date = new Date(dateString);
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  return {
    day: date.toLocaleDateString(locale, { day: "numeric" }),
    month: date.toLocaleDateString(locale, { month: "short" }),
    weekday: date.toLocaleDateString(locale, { weekday: "long" }),
    full: date.toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function formatTime(timeString: string) {
  if (!timeString) return "";
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return timeString;
}

const getLocalizedContent = (event: Event, dict: any) => {
  // Map event IDs or titles to dictionary keys if they exist, otherwise use original
  // In a real app, this would come from a CMS. For this demo, we use a mapping.
  const mapping: Record<string, string> = {
    "1": "weekly_practice",
    "2": "league_match",
    "3": "weekly_practice_zone",
    "4": "pizza_night",
    "5": "winter_classic",
    "6": "friendly_match",
  };

  const key = mapping[event.id];
  if (!key) return { title: event.title, description: event.description };

  // Some descriptions have specialized keys (like weekly_practice vs weekly_practice_zone)
  const descKey = key === "weekly_practice_zone" ? "weekly_practice_zone" : key;
  const titleKey = key === "weekly_practice_zone" ? "weekly_practice" : key;

  let title = dict.events_page.titles[titleKey] || event.title;
  let description = dict.events_page.descriptions[descKey] || event.description;

  if (event.opponent) {
    title = title.replace("%opponent%", event.opponent);
  }

  return { title, description };
};

export function EventCard({ event, dict, lang, variant = "default" }: EventCardProps) {
  const date = formatDate(event.date, lang);
  const { title, description } = getLocalizedContent(event, dict);
  const typeLabel = dict.events_page.types[event.type];

  if (variant === "compact") {
    return (
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
              <span className="text-xs font-medium text-primary uppercase">
                {date.month}
              </span>
              <span className="font-[family-name:var(--font-display)] text-xl font-bold text-primary">
                {date.day}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  <Link href={`/${lang}/events/${event.id}`}>
                    {title}
                  </Link>
                </h3>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs ${eventTypeColors[event.type]}`}
                >
                  {typeLabel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {formatTime(event.time)} - {event.location}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Date Block */}
          <div className="flex md:flex-col items-center justify-center bg-primary px-6 py-4 md:py-8 text-primary-foreground md:min-w-[120px]">
            <span className="text-sm font-medium uppercase mr-2 md:mr-0">
              {date.month}
            </span>
            <span className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold">
              {date.day}
            </span>
            <span className="text-sm ml-2 md:ml-0 md:mt-1">{date.weekday}</span>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <Badge
                  variant="outline"
                  className={`mb-2 ${eventTypeColors[event.type]}`}
                >
                  {typeLabel}
                </Badge>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold group-hover:text-primary transition-colors">
                  <Link href={`/${lang}/events/${event.id}`}>
                    {title}
                  </Link>
                </h3>
                {event.opponent && (
                  <p className="text-sm font-medium text-accent mt-1">
                    {dict.events_page.vs} {event.opponent}
                  </p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {formatTime(event.time)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
            </div>

            {event.locationUrl && (
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.events_page.view_on_map}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
