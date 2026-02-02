import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n-config";
import { ArrowRight, Heart, Users, Zap } from "lucide-react";
import Link from "next/link";

const features = {
  en: [
    {
      icon: Users,
      title: "All Skill Levels",
      description: "From complete beginners to experienced players",
    },
    {
      icon: Heart,
      title: "Spirit of the Game",
      description: "Fair play and respect are at our core",
    },
    {
      icon: Zap,
      title: "Competitive Play",
      description: "League matches and tournament opportunities",
    },
  ],
  tr: [
    {
      icon: Users,
      title: "Her Seviye",
      description: "Yeni başlayanlardan deneyimli oyunculara kadar",
    },
    {
      icon: Heart,
      title: "Oyunun Ruhu",
      description: "Adil oyun ve saygı temelimizdir",
    },
    {
      icon: Zap,
      title: "Rekabetçi Oyun",
      description: "Lig maçları ve turnuva fırsatları",
    },
  ]
};

export function CTASection({ dict, lang }: { dict: any, lang: Locale }) {
  const currentFeatures = features[lang] || features.tr;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:px-12 md:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl text-balance">
                {dict.title}
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 leading-relaxed">
                {dict.description}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                >
                  <Link href={`/${lang}/contact`}>
                    {dict.button}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href={`/${lang}/rules`}>{dict.learn_rules}</Link>
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {currentFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-primary-foreground/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mt-3 font-semibold text-primary-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/70">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
