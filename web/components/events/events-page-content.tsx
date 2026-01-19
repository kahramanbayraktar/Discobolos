"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsList } from "./events-list";
import { EventsCalendar } from "./events-calendar";
import { List, CalendarDays } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventsPageContentProps {
  events: Event[];
}

export function EventsPageContent({ events }: EventsPageContentProps) {
  return (
    <Tabs defaultValue="list" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="list">
        <EventsList events={events} />
      </TabsContent>

      <TabsContent value="calendar">
        <EventsCalendar events={events} />
      </TabsContent>
    </Tabs>
  );
}
