import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Star } from "lucide-react";
import type { Player } from "@/lib/types";

interface PlayerCardProps {
  player: Player;
}

const positionColors: Record<Player["position"], string> = {
  Handler: "bg-primary/10 text-primary border-primary/20",
  Cutter: "bg-accent/10 text-accent-foreground border-accent/20",
  Hybrid: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Image/Avatar Area */}
        <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="h-20 w-20 text-secondary-foreground/20" />
          </div>
          
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
