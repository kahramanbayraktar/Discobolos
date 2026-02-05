import { LogoutButton } from "@/components/auth/logout-button";
import { SubmissionActions } from "@/components/gallery/submission-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Locale } from "@/i18n-config";
import { getGalleryAlbums, getGallerySubmissions } from "@/lib/supabase";
import { getServerPlayer } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminSubmissionsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const player = await getServerPlayer();
  if (!player || !player.isAdmin) redirect(`/${lang}/login`);

  const submissions = await getGallerySubmissions();
  const albums = await getGalleryAlbums();

  const getAlbumTitle = (id: string) => albums.find(a => a.id === id)?.title || "Unknown Album";

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/${lang}/admin/gallery`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
            Review Submissions
          </h1>
        </div>
        <LogoutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Uploads</CardTitle>
          <CardDescription>
            Approve or reject photos and videos submitted by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No submissions found.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 bg-muted rounded overflow-hidden">
                        {sub.url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <div className="flex items-center justify-center h-full bg-black text-white text-[10px]">VIDEO</div>
                        ) : (
                          <Image
                            src={sub.url}
                            alt="Submission"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{sub.authorName}</TableCell>
                    <TableCell>{getAlbumTitle(sub.albumId)}</TableCell>
                    <TableCell>
                      <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <SubmissionActions id={sub.id} currentStatus={sub.status} />
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
