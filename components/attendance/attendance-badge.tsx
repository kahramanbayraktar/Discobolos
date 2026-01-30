"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Bird, Shield, UserCheck, Zap } from "lucide-react";

export type BadgeType = "early_bird" | "chameleon" | "iron_man" | "reliable";

interface AttendanceBadgeProps {
  type: BadgeType;
  name: string;
  description: string;
  className?: string;
}

const icons = {
  early_bird: <Bird className="w-4 h-4" />,
  chameleon: <Zap className="w-4 h-4 text-emerald-500" />,
  iron_man: <Shield className="w-4 h-4 text-orange-500" />,
  reliable: <UserCheck className="w-4 h-4 text-blue-500" />,
};

const bgColors = {
  early_bird: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  chameleon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  iron_man: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  reliable: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

export function AttendanceBadge({ type, name, description, className }: AttendanceBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center justify-center p-2 rounded-full border transition-transform hover:scale-110 cursor-help",
            bgColors[type],
            className
          )}>
            {icons[type]}
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-1 p-3">
          <p className="font-bold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
