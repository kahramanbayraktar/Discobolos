import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n-config";
import { ArrowRight, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection({ dict, lang, playerCount = 0 }: { dict: any, lang: Locale, playerCount?: number }) {
  return (
    <section className="relative overflow-hidden bg-secondary min-h-[90vh] flex items-center">
      {/* Diagonal geometric pattern inspired by jersey */}
      <div className="absolute inset-0">
        {/* Cream/beige top section */}
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-[#f5e6c8]" />
        
        {/* Orange diagonal stripe */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,35 100,25 100,55 0,65"
            className="fill-primary"
          />
          <polygon
            points="0,55 100,45 100,65 0,75"
            className="fill-accent"
          />
        </svg>
        
        {/* Dark slate bottom section */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-secondary" />
      </div>

      <div className="container relative mx-auto px-4 pt-0 pb-30 md:py-28 lg:py-36 z-10">
        <div className="grid gap-0 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Animated Logo with Organic Rings */}
          <div className="relative flex order-first lg:order-last items-center justify-center pt-0 pb-0 lg:py-0 -mt-25 ml-35 lg:-mt-10">
            <div className="relative w-[280px] h-[280px] lg:w-[400px] lg:h-[480px] flex items-center justify-center">
              {/* Outer irregular ring 1 - Peach (Outermost) */}
              <div 
                className="absolute w-[260px] h-[260px] lg:w-[380px] lg:h-[380px] rounded-full border-2 animate-spin-slow opacity-60"
                style={{ 
                  borderColor: '#f7a17c',
                  borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
                  animationDuration: '25s'
                }}
              />
              
              {/* Outer irregular ring 2 - Charcoal */}
              <div 
                className="absolute w-[230px] h-[230px] lg:w-[340px] lg:h-[340px] rounded-full border-2 animate-spin-reverse opacity-40"
                style={{ 
                  borderColor: '#31393c',
                  borderRadius: '45% 55% 40% 60% / 55% 45% 55% 45%',
                  animationDuration: '20s'
                }}
              />
              
              {/* Middle irregular ring 1 - Teal */}
              <div 
                className="absolute w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] rounded-full border-[3px] animate-spin-slow opacity-70"
                style={{ 
                  borderColor: '#6b97aa',
                  borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
                  animationDuration: '15s'
                }}
              />
              
              {/* Middle irregular ring 2 - Orange */}
              <div 
                className="absolute w-[170px] h-[170px] lg:w-[260px] lg:h-[260px] rounded-full border-2 animate-spin-reverse opacity-50"
                style={{ 
                  borderColor: '#ef6b25',
                  borderRadius: '50% 50% 45% 55% / 55% 50% 50% 45%',
                  animationDuration: '12s'
                }}
              />
              
              {/* Inner irregular ring 1 - Peach */}
              <div 
                className="absolute w-[140px] h-[140px] lg:w-[220px] lg:h-[220px] rounded-full border-[3px] animate-spin-slow"
                style={{ 
                  borderColor: '#f7a17c',
                  borderRadius: '45% 55% 55% 45% / 50% 45% 55% 50%',
                  animationDuration: '10s'
                }}
              />
              
              {/* Inner irregular ring 2 - Charcoal (Innermost) */}
              <div 
                className="absolute w-[110px] h-[110px] lg:w-[180px] lg:h-[180px] rounded-full border-2 animate-spin-reverse"
                style={{ 
                  borderColor: '#31393c',
                  borderRadius: '55% 45% 45% 55% / 45% 55% 45% 55%',
                  animationDuration: '8s'
                }}
              />
              
              {/* Pulsing glow effect behind logo */}
              <div className="absolute w-[120px] h-[120px] lg:w-[160px] lg:h-[160px] rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-2xl animate-pulse" />
              
              {/* Logo container with subtle shadow */}
              <div className="relative z-10 w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] rounded-full bg-secondary/90 shadow-2xl flex items-center justify-center backdrop-blur-sm border-2 border-primary/20">
                <Image
                  src="/images/logo.png"
                  alt="Discobolos Logo"
                  width={70}
                  height={70}
                  className="object-contain drop-shadow-lg lg:w-[100px] lg:h-[100px]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 flex-1 order-last lg:order-first -mt-20 lg:-mt-10 relative z-20">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground shadow-lg w-fit">
                <Trophy className="h-4 w-4 text-primary" />
                {dict.badge}
              </p>
              
              <div className="space-y-2">
                <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-secondary sm:text-5xl lg:text-6xl text-balance">
                  {dict.title_part1}
                  <br />
                  <span className="text-accent">{dict.title_part2}</span>
                </h1>
                <p className="text-lg text-secondary/80 max-w-xl leading-relaxed">
                  {dict.description}
                </p>
              </div>
            </div>

            <div className="space-y-10 pt-4">
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  <Link href={`/${lang}/contact`}>
                    {dict.cta_join}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-secondary/90 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary shadow-lg"
                >
                  <Link href={`/${lang}/events`}>{dict.cta_schedule}</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4 bg-secondary/90 rounded-xl p-6 shadow-lg">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                    2024
                  </p>
                  <p className="text-sm text-secondary-foreground/70">
                    {dict.stats.established}
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                    {playerCount > 0 ? playerCount : "0"}
                  </p>
                  <p className="text-sm text-secondary-foreground/70">
                    {dict.stats.active_players}
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                    32
                  </p>
                  <p className="text-sm text-secondary-foreground/70">
                    {dict.stats.meetups}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom diagonal transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L1440 40V120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
