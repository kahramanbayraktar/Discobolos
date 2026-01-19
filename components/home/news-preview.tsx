import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Newspaper } from "lucide-react";
import { newsPosts } from "@/lib/data";
import type { NewsPost } from "@/lib/types";

const categoryLabels: Record<NewsPost["category"], string> = {
  "match-report": "Match Report",
  announcement: "Announcement",
  feature: "Feature",
};

export function NewsPreview() {
  const latestPosts = newsPosts.slice(0, 3);
  const [featuredPost, ...otherPosts] = latestPosts;

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-primary mb-2">Latest News</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
              Team Updates
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2 w-fit bg-transparent">
            <Link href="/news">
              All News
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured Post */}
          <Card className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Newspaper className="h-16 w-16 text-secondary-foreground/20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="mb-2">
                    {categoryLabels[featuredPost.category]}
                  </Badge>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-secondary-foreground group-hover:text-primary transition-colors">
                    <Link href={`/news/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {featuredPost.author}
                  </span>
                  <time className="text-muted-foreground">
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Posts */}
          <div className="flex flex-col gap-4">
            {otherPosts.map((post) => (
              <Card key={post.id} className="group">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-20 h-20 bg-secondary rounded-lg flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-secondary-foreground/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-2">
                        {categoryLabels[post.category]}
                      </Badge>
                      <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                        <Link href={`/news/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <time className="text-xs text-muted-foreground mt-2 block">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
