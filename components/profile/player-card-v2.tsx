"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Player, PlayerCardConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Shield, Zap } from "lucide-react";

interface PlayerCardV2Props {
  player: Player & {
    attendanceCount?: number;
    totalPoints?: number;
  };
  config?: PlayerCardConfig | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isHoverable?: boolean;
}

const THEME_STYLES = {
  classic: {
    border: "border-primary/20",
    bg: "bg-card/95",
    text: "text-card-foreground",
    accent: "text-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
    gradient: "from-primary/5 to-transparent",
  },
  neon: {
    border: "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    bg: "bg-zinc-950/95",
    text: "text-slate-200",
    accent: "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]",
    badge: "bg-cyan-950/50 text-cyan-400 border-cyan-500/30",
    gradient: "from-cyan-500/10 to-purple-500/10",
  },
  gold: {
    border: "border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
    bg: "bg-amber-950/90",
    text: "text-amber-100",
    accent: "text-yellow-400 font-serif",
    badge: "bg-yellow-900/30 text-yellow-300 border-yellow-500/30",
    gradient: "from-yellow-500/10 to-amber-600/10",
  },
  minimal: {
    border: "border-border",
    bg: "bg-background",
    text: "text-foreground",
    accent: "text-foreground",
    badge: "bg-muted text-muted-foreground border-border",
    gradient: "from-transparent to-transparent",
  },
};

const PATTERNS = {
  dots: "radial-gradient(circle, currentColor 1px, transparent 1px)",
  lines: "repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 10px)",
  waves: "repeating-radial-gradient(circle at 0 0, transparent 0, transparent 10px, currentColor 10px, currentColor 11px)",
  solid: "none",
};

export function PlayerCardV2({ 
  player, 
  config, 
  className, 
  size = 'md',
  isHoverable = true 
}: PlayerCardV2Props) {
  // Use config or fallbacks
  const theme = config?.theme || 'classic';
  const pattern = config?.bgPattern || 'dots';
  const customColor = config?.primaryColor;
  
  const styles = THEME_STYLES[theme];
  
  // Dynamic size classes
  const sizeClasses = {
    sm: "w-48 text-xs",
    md: "w-64 text-sm",
    lg: "w-full max-w-sm text-base",
  };

  const avatarSizes = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        styles.border,
        styles.bg,
        styles.text,
        isHoverable && "hover:-translate-y-1 hover:shadow-xl",
        sizeClasses[size],
        className
      )}
      style={customColor ? {
        // We don't override --primary because it expects HSL usually.
        // Instead we apply custom color to specific elements.
      } : undefined}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: PATTERNS[pattern],
          backgroundSize: pattern === 'dots' ? '20px 20px' : undefined,
          color: customColor || 'currentColor'
        }} 
      />
      
      {/* Gradient Overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none", styles.gradient)} />

      {/* Content */}
      <div className="relative p-6 flex flex-col items-center text-center z-10">
        
        {/* Header Badges (Position & Number) */}
        <div className="w-full flex justify-between items-center mb-4">
          <Badge 
            variant="outline" 
            className={cn("font-bold", !customColor && styles.badge)}
            style={customColor ? { 
              borderColor: customColor, 
              color: customColor,
              backgroundColor: `${customColor}20` // Simple hex opacity
            } : undefined}
          >
            {player.position}
          </Badge>
          <span 
            className={cn("text-xl font-black opacity-80", !customColor && styles.accent)}
            style={customColor ? { color: customColor } : undefined}
          >
            #{player.number}
          </span>
        </div>

        {/* Avatar */}
        <div className={cn("relative mb-4 group", avatarSizes[size])}>
          <div 
            className={cn(
              "absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity", 
              !customColor && styles.accent.replace("text-", "bg-")
            )} 
            style={customColor ? { backgroundColor: customColor } : undefined}
          />
          <Avatar className={cn("w-full h-full border-2", styles.border)}>
            <AvatarImage src={player.image} alt={player.name} className="object-cover" />
            <AvatarFallback className={cn("text-2xl font-bold", styles.bg)}>
              {player.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <h3 className={cn("font-bold truncate w-full", size === 'lg' ? "text-2xl" : "text-lg")}>
          {player.name}
        </h3>
        
        {player.nickname && (
          <p className="text-muted-foreground italic text-sm mb-2">"{player.nickname}"</p>
        )}

        {/* Mini Stats (if available) */}
        {(player.attendanceCount !== undefined || player.totalPoints !== undefined) && (
          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            <div 
              className={cn("p-2 rounded-lg text-center flex flex-col items-center", !customColor && styles.badge)}
              style={customColor ? { 
                borderColor: `${customColor}40`, 
                borderWidth: '1px',
                color: customColor,
                backgroundColor: `${customColor}10`
              } : undefined}
            >
              <Shield className="w-4 h-4 mb-1 opacity-70" />
              <span className="font-bold">{player.attendanceCount || 0}</span>
              <span className="text-[10px] uppercase opacity-70">Attend</span>
            </div>
            <div 
              className={cn("p-2 rounded-lg text-center flex flex-col items-center", !customColor && styles.badge)}
              style={customColor ? { 
                borderColor: `${customColor}40`, 
                borderWidth: '1px',
                color: customColor,
                backgroundColor: `${customColor}10`
              } : undefined}
            >
              <Zap className="w-4 h-4 mb-1 opacity-70" />
              <span className="font-bold">{player.totalPoints || 0}</span>
              <span className="text-[10px] uppercase opacity-70">Points</span>
            </div>
          </div>
        )}

        {/* Footer / Fun Fact */}
        {size === 'lg' && player.funFact && (
          <div className="mt-6 pt-4 border-t border-dashed border-border w-full text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Fun Fact</p>
            <p className="text-sm italic opacity-80">{player.funFact}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
