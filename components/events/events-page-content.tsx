"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event } from "@/lib/types";
import { CalendarDays, List } from "lucide-react";
import { EventsCalendar } from "./events-calendar";
import { EventsList } from "./events-list";

interface EventsPageContentProps {
  events: Event[];
  dict: any;
  lang: string;
}

export function EventsPageContent({ events, dict, lang }: EventsPageContentProps) {
  return (
    <Tabs defaultValue="list" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            {dict.events_page.list_view}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            {dict.events_page.calendar_view}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="list">
        <EventsList events={events} dict={dict} lang={lang} />
      </TabsContent>

      <TabsContent value="calendar">
        <EventsCalendar events={events} dict={dict} lang={lang} />
      </TabsContent>
    </Tabs>
  );
}
