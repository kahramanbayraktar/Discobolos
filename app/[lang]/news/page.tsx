import { NewsCard } from "@/components/news/news-card";
import { newsPosts } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Latest news, match reports, and announcements from Halikarnassos Discobolos Ultimate Frisbee team.",
};

export default function NewsPage() {
  const [featuredPost, ...otherPosts] = newsPosts;

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Latest Updates</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            News & Stories
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Match reports, team announcements, and stories from the Halikarnassos Discobolos
            community.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-10">
            <NewsCard post={featuredPost} featured />
          </div>
        )}

        {/* Other Posts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More placeholder */}
        {newsPosts.length > 10 && (
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">
              Showing {newsPosts.length} of {newsPosts.length} articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
