import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Locale } from "@/i18n-config";
import type { GalleryAlbum } from "@/lib/types";
import { Camera, ExternalLink, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AlbumCardProps {
  album: GalleryAlbum;
  lang: Locale;
  view_album_text?: string;
}

export function AlbumCard({ album, lang, view_album_text }: AlbumCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] bg-secondary overflow-hidden flex items-center justify-center">
          {album.coverImage && !album.coverImage.includes('photos.app.goo.gl') && !album.coverImage.includes('goo.gl') ? (
            <Image
              src={album.coverImage}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Camera className="h-16 w-16 text-secondary-foreground/20" />
          )}

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge className="gap-2">
                <ExternalLink className="h-3 w-3" />
                {view_album_text || "View Album"}
              </Badge>
            </div>
          </div>

          {/* Photo Count Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="gap-1 bg-background/80">
              <ImageIcon className="h-3 w-3" />
              {album.photoCount}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <Link
            href={`/${lang}/gallery/${album.id}`}
            className="block group-hover:text-primary transition-colors"
          >
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-lg">
              {album.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {album.description}
          </p>
          <time className="text-xs text-muted-foreground mt-3 block">
            {new Date(album.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
