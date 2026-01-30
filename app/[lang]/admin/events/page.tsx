import { LogoutButton } from "@/components/auth/logout-button";
import { EventForm } from "@/components/events/event-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
            Admin: Add New Event
          </h1>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill in the information below to add a new event to the calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
