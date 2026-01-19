"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./event-card";
import type { Event } from "@/lib/types";

interface EventsCalendarProps {
  events: Event[];
}

const eventTypeColors: Record<Event["type"], string> = {
  practice: "bg-primary",
  match: "bg-accent",
  social: "bg-chart-4",
  tournament: "bg-chart-5",
};

export function EventsCalendar({ events }: EventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Get events for selected date
  const selectedDateStr = selectedDate?.toISOString().split("T")[0];
  const eventsOnSelectedDate = events.filter(
    (event) => event.date === selectedDateStr
  );

  // Get all dates with events
  const eventDates = events.map((event) => new Date(event.date));

  // Custom day content to show event indicators
  const getDayContent = (day: Date) => {
    const dayStr = day.toISOString().split("T")[0];
    const dayEvents = events.filter((event) => event.date === dayStr);

    if (dayEvents.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        {dayEvents.slice(0, 3).map((event, i) => (
          <span
            key={event.id}
            className={`h-1 w-1 rounded-full ${eventTypeColors[event.type]}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[350px,1fr]">
      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Select a Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: "bold",
              },
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  {date.getDate()}
                  {getDayContent(date)}
                </div>
              ),
            }}
            className="rounded-md"
          />

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium mb-2">Event Types</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(eventTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-4">
          {selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>

        {eventsOnSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {eventsOnSelectedDate.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No events scheduled for this date.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Select a date with an indicator to see events.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
