import { AlbumForm } from "@/components/gallery/album-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n-config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminNewAlbumPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: New Album
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Album Information</CardTitle>
          <CardDescription>
            Create a new photo collection and link it to Google Photos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlbumForm />
        </CardContent>
      </Card>
    </div>
  );
}
