"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types";
import { useState } from "react";
import { EventCard } from "./event-card";

interface EventsCalendarProps {
  events: Event[];
  dict: any;
  lang: string;
}

const getEventTypeColors = (dict: any): Record<Event["type"], string> => ({
  practice: "bg-primary",
  match: "bg-accent",
  social: "bg-chart-4",
  tournament: "bg-chart-5",
});

export function EventsCalendar({ events, dict, lang }: EventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const eventTypeColors = getEventTypeColors(dict);

  // Get events for selected date
  // Fixed date comparison to avoid timezone issues
  const isSameDay = (d1: Date, d2: string) => {
    const date = new Date(d2);
    return (
      d1.getDate() === date.getDate() &&
      d1.getMonth() === date.getMonth() &&
      d1.getFullYear() === date.getFullYear()
    );
  };

  const eventsOnSelectedDate = events.filter((event) =>
    selectedDate ? isSameDay(selectedDate, event.date) : false
  );

  // Get all dates with events
  const eventDates = events.map((event) => new Date(event.date));

  // Custom day content to show event indicators
  const getDayContent = (day: Date) => {
    const dayEvents = events.filter((event) => isSameDay(day, event.date));

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
          <CardTitle className="text-lg">{dict.events_page.select_date}</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={lang === "tr" ? undefined : undefined} // Add actual locale if needed from date-fns
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: "bold",
              },
            }}
            components={{
              DayButton: ({ day, modifiers, ...props }) => (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  className="relative overflow-visible"
                  {...props}
                >
                  <div className="flex flex-col items-center">
                    <span>{day.date.getDate()}</span>
                    {getDayContent(day.date)}
                  </div>
                </CalendarDayButton>
              ),
            }}
            className="rounded-md"
          />

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium mb-2">{dict.events_page.event_types}</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(eventTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {dict.events_page.types[type as Event["type"]]}
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
          {selectedDate?.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>

        {eventsOnSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {eventsOnSelectedDate.map((event) => (
              <EventCard key={event.id} event={event} dict={dict} lang={lang} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {dict.events_page.no_events_date}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {dict.events_page.select_indicator}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
