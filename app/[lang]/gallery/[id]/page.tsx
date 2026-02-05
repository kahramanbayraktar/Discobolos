import { CommentSection } from "@/components/gallery/comment-section";
import { GalleryUpload } from "@/components/gallery/gallery-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getGalleryAlbumById, getGalleryAlbums, getGallerySubmissions } from "@/lib/supabase";
import { GallerySubmission } from "@/lib/types";
import {
    ArrowLeft,
    Calendar,
    Camera,
    ExternalLink,
    ImageIcon,
    MessageSquare,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export const revalidate = 0;

interface AlbumPageProps {
  params: Promise<{ id: string; lang: Locale }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  const album = await getGalleryAlbumById(id);

  if (!album) {
    return {
      title: "Album Not Found",
    };
  }

  return {
    title: album.title,
    description: album.description,
  };
}

export async function generateStaticParams() {
  const albums = await getGalleryAlbums();
  return albums.map((album) => ({
    id: album.id,
  }));
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id, lang } = await params;
  const album = await getGalleryAlbumById(id);

  if (!album) {
    notFound();
  }

  const [dictResult, submissions] = await Promise.all([
    getDictionary(lang),
    getGallerySubmissions(id)
  ]);

  const dict = dictResult.gallery || {};
  const approvedSubmissions = submissions.filter((s: GallerySubmission) => s.status === 'approved');

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={`/${lang}/gallery`}>
              <ArrowLeft className="h-4 w-4" />
              {dict.back_to_gallery || "Back to Gallery"}
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Album Header */}
          <div className="mb-8">
            <Badge className="mb-3">
              {(dict.photos_count || "%count% Photos").replace("%count%", album.photoCount.toString())}
            </Badge>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              {album.title}
            </h1>
            <p className="text-muted-foreground mt-2">{album.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(album.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                {album.photoCount} {dict.photos_label || "photos"}
              </div>
            </div>
          </div>

          {/* Google Photos Embed Card with Cover Image */}
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-secondary flex flex-col items-center justify-center p-8 group">
                {album.coverImage ? (
                  <>
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="relative z-10 text-center">
                       <Camera className="h-16 w-16 text-white/50 mb-4 mx-auto" />
                       <p className="text-white text-lg font-medium drop-shadow-md max-w-md">
                        {dict.hosted_on_google}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="h-16 w-16 text-secondary-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-center max-w-md">
                      {dict.hosted_on_google}
                    </p>
                  </>
                )}
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
                <div>
                  <p className="font-medium">{dict.view_on_google || "View on Google Photos"}</p>
                  <p className="text-sm text-muted-foreground">
                    {dict.full_resolution || "Full resolution photos with slideshow mode"}
                  </p>
                </div>
                <Button asChild className="gap-2 w-full sm:w-auto">
                  <a
                    href={album.googlePhotosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dict.open_album || "Open Album"}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Card */}
          <Card className="mb-8 border-dashed border-2 bg-accent/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Camera className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-lg">{dict.contribute_title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dict.contribute_desc}
                  </p>
                </div>
                <GalleryUpload albumId={album.id} dict={dict} />
              </div>
            </CardContent>
          </Card>

          {/* Preview Grid */}
          {(album.previewImages && album.previewImages.length > 0) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {dict.highlights_preview || "Highlights Preview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {album.previewImages.map((url, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {(dict.highlights_desc || "Highlights").replace("%count%", album.photoCount.toString())}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Community Highlights (Approved Submissions) */}
          {approvedSubmissions.length > 0 && (
            <Card className="mb-8 overflow-hidden">
              <CardHeader className="bg-accent/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  {dict.community_highlights_title}
                </CardTitle>
                <CardDescription>
                  {dict.community_highlights_desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {approvedSubmissions.map((sub) => (
                    <div key={sub.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                      {sub.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video 
                          src={sub.url} 
                          className="h-full w-full object-cover"
                          controls={false}
                          muted
                        />
                      ) : (
                        <Image
                          src={sub.url}
                          alt={`Shared by ${sub.authorName}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-[10px] text-white font-medium truncate">
                           {sub.authorName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {dict.comments || "Comments"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection albumId={album.id} lang={lang} dict={dict} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
