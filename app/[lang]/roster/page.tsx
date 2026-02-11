import { PlayerCard } from "@/components/roster/player-card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getPlayerStats } from "@/lib/supabase";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.roster_page.title,
    description: dict.roster_page.description,
  };
}

export const dynamic = "force-dynamic";

export default async function RosterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const players = await getPlayerStats(); // getPlayerStats returns sorted by points desc
  
  const t = dict.roster_page;
  const captains = players.filter((p) => p.isCaptain);
  const others = players.filter((p) => !p.isCaptain);

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2 italic">
            {t.badge}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-6xl italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Position Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-primary/10">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {t.legend.handler}
            </Badge>
            <span className="text-sm text-muted-foreground">{t.legend.handler_desc}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-primary/10">
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              {t.legend.cutter}
            </Badge>
            <span className="text-sm text-muted-foreground">{t.legend.cutter_desc}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-primary/10">
            <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
              {t.legend.hybrid}
            </Badge>
            <span className="text-sm text-muted-foreground">{t.legend.hybrid_desc}</span>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl bg-muted/30 backdrop-blur-sm">
            <p className="text-muted-foreground">{t.empty}</p>
          </div>
        ) : (
          <>
            {/* Captains Section */}
            {captains.length > 0 && (
              <section className="mb-16">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-8 flex items-center gap-4 italic px-2">
                  <span className="h-1 w-12 bg-accent rounded-full" />
                  {t.captains}
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {captains.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </section>
            )}

            {/* All Players */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-8 flex items-center gap-4 italic px-2">
                <span className="h-1 w-12 bg-primary rounded-full" />
                {t.full_roster}
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {others.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </section>

            {/* Stats Sidebar/Bottom */}
            <section className="mt-24 grid gap-6 grid-cols-2 md:grid-cols-4">
              <div className="text-center p-8 rounded-2xl bg-muted/30 border border-primary/5 backdrop-blur-sm group hover:border-primary/20 transition-all">
                <p className="font-[family-name:var(--font-display)] text-5xl font-black text-primary group-hover:scale-110 transition-transform">
                  {players.length}
                </p>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-2">{t.stats.active}</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-muted/30 border border-primary/5 backdrop-blur-sm group hover:border-primary/20 transition-all">
                <p className="font-[family-name:var(--font-display)] text-5xl font-black text-primary group-hover:scale-110 transition-transform">
                  {players.filter((p) => p.position === "Handler").length}
                </p>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-2">{t.stats.handlers}</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-muted/30 border border-primary/5 backdrop-blur-sm group hover:border-primary/20 transition-all">
                <p className="font-[family-name:var(--font-display)] text-5xl font-black text-primary group-hover:scale-110 transition-transform">
                  {players.filter((p) => p.position === "Cutter").length}
                </p>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-2">{t.stats.cutters}</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-muted/30 border border-primary/5 backdrop-blur-sm group hover:border-primary/20 transition-all">
                <p className="font-[family-name:var(--font-display)] text-5xl font-black text-primary group-hover:scale-110 transition-transform">
                  {players.filter((p) => p.position === "Hybrid").length}
                </p>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mt-2">{t.stats.hybrids}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
