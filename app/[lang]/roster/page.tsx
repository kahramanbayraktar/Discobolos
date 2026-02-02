import { PlayerCard } from "@/components/roster/player-card";
import { Badge } from "@/components/ui/badge";
import { getPlayers } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Roster",
  description:
    "Meet the players of Halikarnassos Discobolos - handlers, cutters, and hybrids who make up our Ultimate Frisbee family.",
};

export default async function RosterPage() {
  const players = await getPlayers();
  
  const captains = players.filter((p) => p.isCaptain);
  const others = players.filter((p) => !p.isCaptain);

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Meet the Team</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
            Our Roster
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            From seasoned veterans to rising stars, our roster is filled with
            talented athletes who share a passion for Ultimate and the Spirit of
            the Game.
          </p>
        </div>

        {/* Position Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Handler
            </Badge>
            <span className="text-sm text-muted-foreground">Primary throwers</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              Cutter
            </Badge>
            <span className="text-sm text-muted-foreground">Deep threats & receivers</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
              Hybrid
            </Badge>
            <span className="text-sm text-muted-foreground">Versatile players</span>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl bg-muted/30">
            <p className="text-muted-foreground">No players are currently listed in the roster.</p>
          </div>
        ) : (
          <>
            {/* Captains Section */}
            {captains.length > 0 && (
              <section className="mb-12">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="h-1 w-8 bg-accent rounded" />
                  Team Captains
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {captains.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </section>
            )}

            {/* All Players */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="h-1 w-8 bg-primary rounded" />
                Full Roster
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {others.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </section>

            {/* Stats */}
            <section className="mt-16 grid gap-6 md:grid-cols-4">
              <div className="text-center p-6 rounded-xl bg-muted">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
                  {players.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Active Players</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
                  {players.filter((p) => p.position === "Handler").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Handlers</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
                  {players.filter((p) => p.position === "Cutter").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Cutters</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
                  {players.filter((p) => p.position === "Hybrid").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Hybrids</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
