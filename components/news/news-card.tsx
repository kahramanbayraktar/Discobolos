import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ArrowRight } from "lucide-react";
import type { NewsPost } from "@/lib/types";

interface NewsCardProps {
  post: NewsPost;
  featured?: boolean;
}

const categoryLabels: Record<NewsPost["category"], string> = {
  "match-report": "Match Report",
  announcement: "Announcement",
  feature: "Feature",
};

const categoryColors: Record<NewsPost["category"], string> = {
  "match-report": "bg-primary/10 text-primary border-primary/20",
  announcement: "bg-accent/10 text-accent-foreground border-accent/20",
  feature: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export function NewsCard({ post, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="aspect-video md:aspect-auto bg-secondary relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Newspaper className="h-20 w-20 text-secondary-foreground/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-secondary/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge
                variant="outline"
                className={`w-fit mb-3 ${categoryColors[post.category]}`}
              >
                {categoryLabels[post.category]}
              </Badge>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold group-hover:text-primary transition-colors mb-3">
                <Link href={`/news/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  <span>{post.author}</span>
                  <span className="mx-2">·</span>
                  <time>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <Link
                  href={`/news/${post.slug}`}
                  className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Read
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image */}
        <div className="aspect-video bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="h-12 w-12 text-secondary-foreground/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <Badge
            variant="outline"
            className={`w-fit mb-3 ${categoryColors[post.category]}`}
          >
            {categoryLabels[post.category]}
          </Badge>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2">
            <Link href={`/news/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {post.excerpt}
          </p>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
            <time className="text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
            <span className="text-muted-foreground">{post.author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
