import { AttendanceRecordForm } from "@/components/attendance/attendance-record-form";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getAttendance, getEventById, getPlayers } from "@/lib/supabase";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminAttendancePage({ 
  params 
}: { 
  params: Promise<{ lang: Locale; id: string }> 
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const players = await getPlayers();
  const event = await getEventById(id);
  const initialAttendance = await getAttendance(id);

  if (!event) notFound();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href={`/${lang}/admin/events`} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Etkinliklere Dön
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{dict.attendance.admin.title}</h1>
          <p className="text-muted-foreground mt-1">
            {event.title} - {new Date(event.date).toLocaleDateString(lang)}
          </p>
        </div>
      </div>

      <AttendanceRecordForm 
        players={players} 
        eventId={id} 
        initialAttendance={initialAttendance}
        dict={dict}
      />
    </div>
  );
}
