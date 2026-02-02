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

export const metadata: Metadata = {
  title: "Rules & Spirit of the Game",
  description:
    "Learn the basic rules of Ultimate Frisbee and understand the Spirit of the Game philosophy that makes our sport unique.",
};

const basicRules = [
  {
    icon: Target,
    title: "The Field",
    description:
      "Ultimate is played on a rectangular field with end zones at each end. Similar in size to a football field, but with 25-yard end zones.",
  },
  {
    icon: Users,
    title: "The Teams",
    description:
      "Two teams of 7 players each. Substitutions can be made between points or during an injury timeout.",
  },
  {
    icon: Disc,
    title: "Movement",
    description:
      "The disc may be moved in any direction by passing. Players cannot run while holding the disc - they must stop and establish a pivot foot.",
  },
  {
    icon: Clock,
    title: "The Stall",
    description:
      "The player with the disc has 10 seconds to throw. The defender guarding them counts the stall out loud.",
  },
  {
    icon: Flag,
    title: "Scoring",
    description:
      "A goal is scored when a player catches the disc in the end zone they are attacking. Each goal is worth one point.",
  },
  {
    icon: Shield,
    title: "Turnovers",
    description:
      "When a pass is incomplete, intercepted, knocked down, or caught out of bounds, the other team takes possession.",
  },
];

const spiritPrinciples = [
  {
    title: "Know the Rules",
    description:
      "A competent player is responsible for knowing and following the rules. There are no referees - players make their own calls.",
  },
  {
    title: "Avoid Body Contact",
    description:
      "Ultimate is a non-contact sport. Physical contact should be avoided at all times.",
  },
  {
    title: "Be Fair-Minded",
    description:
      "Players should be truthful and abide by the rules even when doing so disadvantages their team.",
  },
  {
    title: "Be Respectful",
    description:
      "Treat opponents, teammates, spectators, and officials with respect. Never taunt, intimidate, or demean others.",
  },
  {
    title: "Win with Grace, Lose with Dignity",
    description:
      "Celebrate success humbly and accept defeat graciously. The Spirit of the Game is more important than any scoreboard.",
  },
];

export default function RulesPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2">
            Learn the Game
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            Rules & Spirit of the Game
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Ultimate Frisbee is a self-refereed sport that combines athleticism
            with integrity. Understanding both the rules and the Spirit is
            essential to playing.
          </p>
        </div>

        {/* What is Ultimate Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">Introduction</Badge>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-4">
                  What is Ultimate Frisbee?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ultimate is a fast-paced, non-contact team sport played with a
                  flying disc. It combines elements of soccer, football, and
                  basketball, requiring speed, agility, and precise throwing
                  skills.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What makes Ultimate truly unique is that it's self-officiated.
                  Players are responsible for their own foul calls and line
                  calls. This honor system, known as "Spirit of the Game," is
                  the foundation of our sport.
                </p>
              </div>
              <div className="bg-secondary rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Disc className="h-20 w-20 text-primary mx-auto mb-4" />
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-secondary-foreground">
                    Self-Refereed
                  </p>
                  <p className="text-secondary-foreground/70">
                    No referees. Just respect.
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
              Basic Rules
            </h2>
            <p className="text-muted-foreground mt-2">
              The fundamentals you need to know to play
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
                Core Philosophy
              </Badge>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
                Spirit of the Game
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                The Spirit of the Game places the responsibility for fair play
                on every player. It's what sets Ultimate apart from other
                sports.
              </p>
            </div>

            {/* Spirit Quote */}
            <blockquote className="relative p-8 mb-10 rounded-2xl bg-primary text-primary-foreground">
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-balance">
                "Ultimate relies upon a Spirit of the Game that places the
                responsibility for fair play on every player. Highly competitive
                play is encouraged, but should never sacrifice mutual respect,
                adherence to the rules, or the joy of play."
              </p>
              <footer className="mt-4 text-primary-foreground/80">
                — World Flying Disc Federation (WFDF)
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
                Ready to Play?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Join Halikarnassos Discobolos and experience the Spirit of the Game
                firsthand. We welcome players of all skill levels!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Sign up for a practice
                <ArrowRight className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
