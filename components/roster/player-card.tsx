import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Player } from "@/lib/types";
import { Star } from "lucide-react";
import Image from "next/image";

interface PlayerCardProps {
  player: Player;
}

const positionColors: Record<Player["position"], string> = {
  Handler: "bg-primary/10 text-primary border-primary/20",
  Cutter: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  Hybrid: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export function PlayerCard({ player }: PlayerCardProps) {
  const playerPlaceholders = [
    "/images/avatars/player-1.png",
    "/images/avatars/player-2.png",
    "/images/avatars/player-3.png",
    "/images/avatars/player-4.png",
    "/images/avatars/player-5.png",
    "/images/avatars/player-female-1.png",
    "/images/avatars/player-female-2.png",
    "/images/avatars/player-female-3.png",
  ];

  // Deterministically select a placeholder based on player's name or number
  const placeholderIndex = (player.number || player.name.length) % playerPlaceholders.length;
  const placeholderImage = playerPlaceholders[placeholderIndex];

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
          <Image
            src={player.image || placeholderImage}
            alt={player.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Number Overlay */}
          <div className="absolute top-3 right-3">
            <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-secondary-foreground/10">
              #{player.number}
            </span>
          </div>

          {/* Captain Badge */}
          {player.isCaptain && (
            <div className="absolute top-3 left-3">
              <Badge className="gap-1 bg-accent text-accent-foreground">
                <Star className="h-3 w-3" />
                Captain
              </Badge>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-secondary to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-lg group-hover:text-primary transition-colors">
                {player.name}
                {player.nickname && (
                  <span className="block text-primary text-sm font-medium italic">
                    "{player.nickname}"
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Since {player.yearJoined}
              </p>
            </div>
            <Badge variant="outline" className={positionColors[player.position]}>
              {player.position}
            </Badge>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              "{player.funFact}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
