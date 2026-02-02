import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n-config";
import type { GalleryAlbum } from "@/lib/types";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function GalleryPreview({ dict, lang, albums }: { dict: any; lang: Locale; albums: GalleryAlbum[] }) {
  const latestAlbums = albums.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-primary mb-2">{dict.badge}</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              {dict.title}
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 w-fit bg-transparent">
            <Link href={`/${lang}/gallery`}>
              {dict.view_all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestAlbums.map((album) => (
            <Link key={album.id} href={`/${lang}/gallery/${album.id}`} className="group">
              <Card className="h-full overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-white font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        {dict.photos_count.replace("%count%", album.photoCount)}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col bg-card">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                      {album.description}
                    </p>
                    <time className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">
                      {new Date(album.date).toLocaleDateString(
                        lang === "tr" ? "tr-TR" : "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
