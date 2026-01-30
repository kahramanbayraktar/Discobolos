"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";
import { useState } from "react";
import { EventCard } from "./event-card";

interface EventsListProps {
  events: Event[];
  dict: any;
  lang: string;
}

export function EventsList({ events, dict, lang }: EventsListProps) {
  const [filter, setFilter] = useState<string>("all");

  const eventTypes = [
    { value: "all", label: dict.events_page.types.all },
    { value: "practice", label: dict.events_page.types.practice },
    { value: "match", label: dict.events_page.types.match },
    { value: "social", label: dict.events_page.types.social },
    { value: "tournament", label: dict.events_page.types.tournament },
  ] as const;

  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  // Group events by month
  const groupedEvents = filteredEvents.reduce(
    (acc, event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {eventTypes.map((type) => (
          <Button
            key={type.value}
            variant={filter === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type.value)}
          >
            {type.label}
            {type.value !== "all" && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {events.filter((e) => e.type === type.value).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Events grouped by month */}
      {Object.entries(groupedEvents).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <section key={monthYear}>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-4 flex items-center gap-3">
                <span className="h-0.5 w-6 bg-primary rounded" />
                {monthYear}
              </h3>
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <EventCard key={event.id} event={event} dict={dict} lang={lang} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {dict.events_page.no_events_scheduled.replace(
              "%type%",
              filter === "all" ? "" : dict.events_page.types[filter]
            )}
          </p>
        </div>
      )}
    </div>
  );
}
