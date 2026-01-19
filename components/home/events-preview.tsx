import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { events } from "@/lib/data";
import type { Event } from "@/lib/types";

const eventTypeColors: Record<Event["type"], string> = {
  practice: "bg-primary/10 text-primary border-primary/20",
  match: "bg-accent/10 text-accent-foreground border-accent/20",
  social: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  tournament: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    month: date.toLocaleDateString("en-US", { month: "short" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

export function EventsPreview() {
  const upcomingEvents = events.slice(0, 3);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-primary mb-2">
              Upcoming Events
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              Join Us on the Field
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 w-fit bg-transparent">
            <Link href="/events">
              View Full Calendar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => {
            const date = formatDate(event.date);
            return (
              <Card
                key={event.id}
                className="group hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Date Block */}
                    <div className="flex flex-col items-center justify-center bg-primary px-4 py-6 text-primary-foreground min-w-[80px]">
                      <span className="text-xs font-medium uppercase">
                        {date.month}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-3xl font-bold">
                        {date.day}
                      </span>
                      <span className="text-xs">{date.weekday}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`shrink-0 ${eventTypeColors[event.type]}`}
                        >
                          {event.type}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {event.time}
                            {event.endTime && ` - ${event.endTime}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {event.opponent && (
                        <p className="text-sm font-medium text-accent">
                          vs. {event.opponent}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
