"use client";

import { PlayerCardV2 } from "@/components/profile/player-card-v2";
import type { Player } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  return (
    <Link href={`/${lang}/roster/${player.id}`} className="block group">
      <PlayerCardV2 
        player={player} 
        config={player.cardConfig}
        className="h-full w-full transition-all duration-300 group-hover:scale-[1.02]"
        isHoverable={true}
      />
    </Link>
  );
}
