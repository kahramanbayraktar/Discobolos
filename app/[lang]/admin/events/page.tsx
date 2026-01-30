import { LogoutButton } from "@/components/auth/logout-button";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getEvents } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { ClipboardList, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminEventsListPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const events = await getEvents();

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: Events Management
        </h1>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href={`/${lang}/admin/events/new`} className="gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Manage your schedule, edit details or remove events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No events found. Create your first event!
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {new Date(event.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{event.title}</TableCell>
                    <TableCell className="capitalize">{event.type}</TableCell>
                    <TableCell className="truncate max-w-[150px]">{event.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="icon" className="text-blue-500 hover:text-blue-600">
                          <Link href={`/${lang}/admin/events/${event.id}/attendance`}>
                            <ClipboardList className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/${lang}/admin/events/${event.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteEventButton eventId={event.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
