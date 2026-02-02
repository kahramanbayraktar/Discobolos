import { AlbumForm } from "@/components/gallery/album-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n-config";
import { getGalleryAlbumById } from "@/lib/supabase";
import { getServerPlayer } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function AdminEditAlbumPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const activePlayer = await getServerPlayer();
  if (!activePlayer || !activePlayer.isCaptain) redirect(`/${lang}/login`);

  const album = await getGalleryAlbumById(id);
  if (!album) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: Edit Album
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Album</CardTitle>
          <CardDescription>
            Editing details for "{album.title}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlbumForm initialData={album} />
        </CardContent>
      </Card>
    </div>
  );
}
