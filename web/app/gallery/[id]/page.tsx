import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ExternalLink,
  Camera,
  ImageIcon,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { galleryAlbums } from "@/lib/data";
import { CommentSection } from "@/components/gallery/comment-section";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  const album = galleryAlbums.find((a) => a.id === id);

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
  return galleryAlbums.map((album) => ({
    id: album.id,
  }));
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = galleryAlbums.find((a) => a.id === id);

  if (!album) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/gallery">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Album Header */}
          <div className="mb-8">
            <Badge className="mb-3">{album.photoCount} Photos</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              {album.title}
            </h1>
            <p className="text-muted-foreground mt-2">{album.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(album.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                {album.photoCount} photos
              </div>
            </div>
          </div>

          {/* Google Photos Embed Card */}
          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="aspect-video bg-secondary rounded-t-lg flex flex-col items-center justify-center p-8">
                <Camera className="h-16 w-16 text-secondary-foreground/30 mb-4" />
                <p className="text-muted-foreground text-center max-w-md">
                  This album is hosted on Google Photos for the best viewing
                  experience. Click below to open the full album.
                </p>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
                <div>
                  <p className="font-medium">View on Google Photos</p>
                  <p className="text-sm text-muted-foreground">
                    Full resolution photos with slideshow mode
                  </p>
                </div>
                <Button asChild className="gap-2 w-full sm:w-auto">
                  <a
                    href={album.googlePhotosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Album
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Grid - Placeholder */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  >
                    <Camera className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Open the Google Photos album to see all {album.photoCount}{" "}
                photos
              </p>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection albumId={album.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
