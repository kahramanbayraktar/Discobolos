import type { Metadata } from "next";
import { AlbumCard } from "@/components/gallery/album-card";
import { galleryAlbums } from "@/lib/data";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Browse photos and videos from Disc Dynasty matches, tournaments, practices, and team events.",
};

export default function GalleryPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Media</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            Photo Gallery
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Relive our best moments - from championship victories to team
            bonding events. All albums are hosted on Google Photos for easy
            viewing and sharing.
          </p>
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Google Photos Integration</h3>
              <p className="text-sm text-muted-foreground">
                Our photo albums are hosted on Google Photos. Click on any album
                to view all photos in a beautiful, full-screen gallery. You can
                also download, share, or add your own photos to team albums!
              </p>
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galleryAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-muted">
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              {galleryAlbums.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Albums</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-muted">
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              {galleryAlbums.reduce((sum, album) => sum + album.photoCount, 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Photos</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-muted">
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              {new Date().getFullYear() - 2018}+
            </p>
            <p className="text-sm text-muted-foreground mt-1">Years of Memories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
