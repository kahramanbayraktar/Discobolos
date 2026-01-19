import type { Metadata } from "next";
import { EventsPageContent } from "@/components/events/events-page-content";
import { events } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events & Schedule",
  description:
    "View upcoming practices, matches, tournaments, and social events for Disc Dynasty Ultimate Frisbee team.",
};

export default function EventsPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Schedule</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            Events & Calendar
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Stay up to date with all our practices, matches, tournaments, and
            social gatherings. We'd love to see you on the field!
          </p>
        </div>

        <EventsPageContent events={events} />
      </div>
    </div>
  );
}
