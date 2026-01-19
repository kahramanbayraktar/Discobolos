import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowLeft, Share2 } from "lucide-react";
import { newsPosts } from "@/lib/data";
import type { NewsPost } from "@/lib/types";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

const categoryLabels: Record<NewsPost["category"], string> = {
  "match-report": "Match Report",
  announcement: "Announcement",
  feature: "Feature",
};

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = newsPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export async function generateStaticParams() {
  return newsPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const post = newsPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = newsPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <article className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/news">
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <Badge className="mb-4">{categoryLabels[post.category]}</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-balance">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-muted-foreground">
              <span>{post.author}</span>
              <span>·</span>
              <time>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          </header>

          {/* Featured Image Placeholder */}
          <div className="aspect-video bg-secondary rounded-xl mb-8 flex items-center justify-center">
            <Newspaper className="h-20 w-20 text-secondary-foreground/20" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground">{post.excerpt}</p>
            <p>{post.content}</p>

            {/* Placeholder content for demo */}
            <p>
              The atmosphere at the field was electric as both teams took their
              positions. After months of preparation, this was the moment
              everyone had been waiting for. The Spirit of the Game was on full
              display, with both teams showing exceptional sportsmanship
              throughout the match.
            </p>
            <p>
              Our handlers executed the plays with precision, while the cutters
              made brilliant runs that left the defense scrambling. The
              communication on the field was outstanding, a testament to the
              hours of practice and team bonding we've invested this season.
            </p>
            <h2>Key Moments</h2>
            <p>
              The turning point came in the second half when our defensive line
              forced three consecutive turnovers. The energy shift was palpable,
              and the team rode that momentum to victory.
            </p>
            <p>
              Special recognition goes to our captains who led by example,
              demonstrating both athletic excellence and unwavering commitment
              to fair play. Their leadership on and off the field continues to
              inspire every member of Disc Dynasty.
            </p>
          </div>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Share this article</p>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
                Related Articles
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/news/${relatedPost.slug}`}
                    className="group block p-4 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <Badge variant="outline" className="mb-2">
                      {categoryLabels[relatedPost.category]}
                    </Badge>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
