import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getEvents } from "@/lib/supabase";
import { getServerPlayer } from "@/lib/supabase/server";
import { formatTime } from "@/lib/utils";
import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminAttendancePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const player = await getServerPlayer();
  if (!player || !player.isAdmin) redirect(`/${lang}/login`);

  const events = await getEvents(false); // Newest first

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Attendance Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Select an event to mark attendance and points for players.
        </p>
      </div>

      <div className="grid gap-4">
        {events.map((event) => {
          const dateObject = new Date(event.date);
          const formattedDate = dateObject.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return (
            <Link key={event.id} href={`/${lang}/admin/attendance/${event.id}`}>
              <Card className="group hover:border-primary/20 transition-all cursor-pointer bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-primary/5">
                        {event.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground">
                        {formattedDate}
                      </span>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors italic">
                      {event.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(event.time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardHeader>
              </Card>
            </Link>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-muted-foreground">Create your first event to start tracking attendance.</p>
            <Button asChild className="mt-4">
              <Link href={`/${lang}/admin/events/new`}>Create Event</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
