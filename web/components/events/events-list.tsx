"use client";

import { useState } from "react";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";

interface EventsListProps {
  events: Event[];
}

const eventTypes = [
  { value: "all", label: "All Events" },
  { value: "practice", label: "Practice" },
  { value: "match", label: "Matches" },
  { value: "social", label: "Social" },
  { value: "tournament", label: "Tournaments" },
] as const;

export function EventsList({ events }: EventsListProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  // Group events by month
  const groupedEvents = filteredEvents.reduce(
    (acc, event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString("en-US", {
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
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No {filter === "all" ? "" : filter} events scheduled.
          </p>
        </div>
      )}
    </div>
  );
}
