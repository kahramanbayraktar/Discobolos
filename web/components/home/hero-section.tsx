import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";

export function HeroSection() {
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

      {/* Discus thrower silhouette */}
      <div className="absolute right-0 bottom-0 w-[40%] h-[70%] opacity-20 pointer-events-none">
        <svg
          viewBox="0 0 200 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Athletic figure throwing disc */}
          <circle cx="100" cy="40" r="20" className="fill-foreground" />
          <path
            d="M60 280l30-80 15-40 50-20 35-50-15-10-35 45-45 10-10 25-40 100 15 20z"
            className="fill-foreground"
          />
          <circle cx="165" cy="95" r="25" className="stroke-foreground stroke-4 fill-none" />
          <circle cx="165" cy="95" r="10" className="fill-foreground" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36 z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground shadow-lg">
                <Trophy className="h-4 w-4 text-primary" />
                Spirit of the Game Champions
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-secondary sm:text-5xl lg:text-6xl text-balance">
                Play with Spirit.
                <br />
                <span className="text-accent">Throw with Passion.</span>
              </h1>
              <p className="text-lg text-secondary/80 max-w-xl leading-relaxed">
                Discobolos is an Ultimate Frisbee community inspired by the
                ancient spirit of athletics. We're united by our love for the
                game and the timeless values of fair play and competition.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                <Link href="/contact">
                  Join Our Team
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-secondary/90 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary shadow-lg"
              >
                <Link href="/events">View Schedule</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4 bg-secondary/90 rounded-xl p-6 shadow-lg">
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                  77
                </p>
                <p className="text-sm text-secondary-foreground/70">
                  Team Number
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                  45+
                </p>
                <p className="text-sm text-secondary-foreground/70">
                  Active Players
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary">
                  12
                </p>
                <p className="text-sm text-secondary-foreground/70">
                  Championships
                </p>
              </div>
            </div>
          </div>

          {/* Jersey Image */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-[400px] h-[480px]">
              <Image
                src="/images/jersey-main.jpg"
                alt="Discobolos team jersey featuring the iconic discus thrower design"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
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
