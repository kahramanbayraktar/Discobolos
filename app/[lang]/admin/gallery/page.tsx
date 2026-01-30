import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getGalleryAlbums } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { Edit, Image as ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminGalleryListPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const albums = await getGalleryAlbums();

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: Gallery Management
        </h1>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href={`/${lang}/admin/gallery/new`} className="gap-2">
              <Plus className="h-4 w-4" />
              New Album
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Albums & Collections</CardTitle>
          <CardDescription>
            Manage your match photos and Google Photos integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {albums.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No albums found. Create your first collection!
                  </TableCell>
                </TableRow>
              ) : (
                albums.map((album) => (
                  <TableRow key={album.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 bg-muted rounded overflow-hidden flex items-center justify-center">
                        {album.coverImage && !album.coverImage.includes('photos.app.goo.gl') && !album.coverImage.includes('goo.gl') ? (
                          <Image
                            src={album.coverImage}
                            alt={album.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{album.title}</TableCell>
                    <TableCell>
                      {new Date(album.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                    </TableCell>
                    <TableCell>{album.photoCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/${lang}/admin/gallery/${album.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        {/* Delete button will be added later */}
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
