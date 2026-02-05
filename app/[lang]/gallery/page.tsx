import { AlbumCard } from "@/components/gallery/album-card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getGalleryAlbums } from "@/lib/supabase";
import { Camera } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Browse photos and videos from Discobolos matches, tournaments, practices, and team events.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = (await getDictionary(lang)).gallery || {};
  const albums = await getGalleryAlbums();

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">{dict.badge || "Media"}</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            {dict.title || "Photo Gallery"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {dict.description || "Relive our best moments."}
          </p>
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto mb-12 p-6 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{dict.integration_title || "Google Photos Integration"}</h3>
              <p className="text-sm text-muted-foreground">
                {dict.integration_desc || "Our photo albums are hosted on Google Photos."}
              </p>
            </div>
          </div>
        </div>

        {/* Albums Grid - centered boxes */}
        <div className="flex flex-wrap justify-center gap-6">
          {albums.map((album) => (
            <div key={album.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-[400px]">
              <AlbumCard album={album} lang={lang} view_album_text={dict.view_album} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-muted">
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              {albums.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{dict.stats_albums || "Albums"}</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-muted">
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              {albums.reduce((sum, album) => sum + album.photoCount, 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{dict.stats_photos || "Total Photos"}</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-muted">
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              {new Date().getFullYear() - 2024}+
            </p>
            <p className="text-sm text-muted-foreground mt-1">{dict.stats_years || "Years of Memories"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
