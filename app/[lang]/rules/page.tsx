import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight,
    Clock,
    Disc,
    Flag,
    Heart,
    Shield,
    Target,
    Trophy,
    Users
} from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.rules_page.meta.title,
    description: dict.rules_page.meta.description,
  };
}

export default async function RulesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const rp = dict.rules_page;

  const basicRules = [
    {
      icon: Target,
      title: rp.basic_rules.rules.field.title,
      description: rp.basic_rules.rules.field.description,
    },
    {
      icon: Users,
      title: rp.basic_rules.rules.teams.title,
      description: rp.basic_rules.rules.teams.description,
    },
    {
      icon: Disc,
      title: rp.basic_rules.rules.movement.title,
      description: rp.basic_rules.rules.movement.description,
    },
    {
      icon: Clock,
      title: rp.basic_rules.rules.stall.title,
      description: rp.basic_rules.rules.stall.description,
    },
    {
      icon: Flag,
      title: rp.basic_rules.rules.scoring.title,
      description: rp.basic_rules.rules.scoring.description,
    },
    {
      icon: Shield,
      title: rp.basic_rules.rules.turnovers.title,
      description: rp.basic_rules.rules.turnovers.description,
    },
  ];

  const spiritPrinciples = [
    {
      title: rp.spirit.principles.know_rules.title,
      description: rp.spirit.principles.know_rules.description,
    },
    {
      title: rp.spirit.principles.no_contact.title,
      description: rp.spirit.principles.no_contact.description,
    },
    {
      title: rp.spirit.principles.fair_minded.title,
      description: rp.spirit.principles.fair_minded.description,
    },
    {
      title: rp.spirit.principles.respectful.title,
      description: rp.spirit.principles.respectful.description,
    },
    {
      title: rp.spirit.principles.grace_dignity.title,
      description: rp.spirit.principles.grace_dignity.description,
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2">
            {rp.header.badge}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            {rp.header.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {rp.header.description}
          </p>
        </div>

        {/* What is Ultimate Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">{rp.intro.badge}</Badge>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-4">
                  {rp.intro.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {rp.intro.p1}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {rp.intro.p2}
                </p>
              </div>
              <div className="bg-secondary rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Disc className="h-20 w-20 text-primary mx-auto mb-4" />
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-secondary-foreground">
                    {rp.intro.callout_title}
                  </p>
                  <p className="text-secondary-foreground/70">
                    {rp.intro.callout_desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Rules Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
              {rp.basic_rules.title}
            </h2>
            <p className="text-muted-foreground mt-2">
              {rp.basic_rules.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {basicRules.map((rule) => (
              <Card key={rule.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <rule.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{rule.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {rule.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Spirit of the Game Section */}
        <section id="spirit" className="scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 gap-2">
                <Heart className="h-3 w-3" />
                {rp.spirit.badge}
              </Badge>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
                {rp.spirit.title}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {rp.spirit.subtitle}
              </p>
            </div>

            {/* Spirit Quote */}
            <blockquote className="relative p-8 mb-10 rounded-2xl bg-primary text-primary-foreground">
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-balance">
                {rp.spirit.quote}
              </p>
              <footer className="mt-4 text-primary-foreground/80">
                {rp.spirit.quote_author}
              </footer>
            </blockquote>

            {/* Spirit Principles */}
            <div className="space-y-4">
              {spiritPrinciples.map((principle, index) => (
                <div
                  key={principle.title}
                  className="flex gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-20">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
                {rp.cta.title}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {rp.cta.description}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                {rp.cta.button}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
