import { LogoutButton } from "@/components/auth/logout-button";
import { EventForm } from "@/components/events/event-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getEventById } from "@/lib/supabase";
import { getServerPlayer } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const player = await getServerPlayer();
  if (!player || !player.isAdmin) redirect(`/${lang}/login`);

  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: Edit Event
        </h1>
        <LogoutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Event</CardTitle>
          <CardDescription>
            Modify the details of the selected event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm initialData={event} dict={dict} />
        </CardContent>
      </Card>
    </div>
  );
}
