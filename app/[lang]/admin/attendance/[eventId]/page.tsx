import { AttendanceEditor } from "@/components/admin/attendance-editor";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getAttendance, getEventById, getPlayers, getRSVPs } from "@/lib/supabase";
import { getServerPlayer } from "@/lib/supabase/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function AdminEventAttendancePage({
  params,
}: {
  params: Promise<{ lang: Locale; eventId: string }>;
}) {
  const { lang, eventId } = await params;
  const dict = await getDictionary(lang);
  
  const player = await getServerPlayer();
  if (!player || !player.isAdmin) redirect(`/${lang}/login`);

  const event = await getEventById(eventId);
  if (!event) notFound();

  const players = await getPlayers();
  const attendance = await getAttendance(eventId);
  const rsvps = await getRSVPs(eventId);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/${lang}/admin/attendance`}>
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight italic">
            {event.title}
          </h1>
          <p className="text-muted-foreground">
            Mark attendance for {new Date(event.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
          </p>
        </div>
      </div>

      <AttendanceEditor 
        event={event}
        players={players}
        initialAttendance={attendance}
        rsvps={rsvps}
        dict={dict}
      />
    </div>
  );
}
