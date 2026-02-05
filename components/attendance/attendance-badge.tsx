"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type BadgeType = "early_bird" | "chameleon" | "iron_man" | "reliable";

interface AttendanceBadgeProps {
  type: BadgeType;
  name: string;
  description: string;
  className?: string;
  size?: number;
  showTooltip?: boolean;
}

const badgeImages = {
  early_bird: "/images/badges/eos.png",
  chameleon: "/images/badges/proteus.png",
  iron_man: "/images/badges/hestia.png",
  reliable: "/images/badges/kairos.png",
};

export function AttendanceBadge({ type, name, description, className, size = 40, showTooltip = true }: AttendanceBadgeProps) {
  const BadgeContent = (
    <div className={cn(
      "relative transition-transform hover:scale-110",
      showTooltip && "cursor-help",
      className
    )}
    style={{ width: size, height: size }}
    >
      <Image
        src={badgeImages[type]}
        alt={name}
        fill
        className="object-contain drop-shadow-md"
        sizes={`${size}px`}
      />
    </div>
  );

  if (!showTooltip) {
    return BadgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          {BadgeContent}
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1 p-3 bg-card/95 backdrop-blur border-primary/20">
          <p className="font-bold text-sm text-primary">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
