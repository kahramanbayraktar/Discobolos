"use client";

import { Card } from "@/components/ui/card";
import { AttendanceBadge, BadgeType } from "./attendance-badge";

interface BadgeShowcaseProps {
  dict: any;
}

export function BadgeShowcase({ dict }: BadgeShowcaseProps) {
  const t = dict.attendance;
  
  const badgeDefinitions: { type: BadgeType; threshold: number }[] = [
    { type: "early_bird", threshold: 3 },
    { type: "reliable", threshold: 3 },
    { type: "chameleon", threshold: 3 },
    { type: "iron_man", threshold: 5 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {badgeDefinitions.map((badge) => {
        const info = badge.type === "early_bird" ? t.badges.early_bird :
                     badge.type === "chameleon" ? t.badges.chameleon :
                     badge.type === "iron_man" ? t.badges.iron_man :
                     t.badges.reliable;

        return (
          <Card key={badge.type} className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all group">
            <div className="flex flex-col items-center text-center gap-4">
              <AttendanceBadge 
                type={badge.type} 
                name={info.name} 
                description={info.description}
                className="w-[120px] h-[120px] group-hover:scale-110 transition-transform duration-500"
                size={120}
                showTooltip={false}
              />
              <div className="space-y-1">
                <h3 className="font-bold text-xl font-[family-name:var(--font-display)] tracking-tight">
                  {info.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  {info.description}
                </p>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-widest font-bold text-primary/60 bg-primary/5 py-1 px-3 rounded-full border border-primary/10">
                {t.target}: {badge.threshold} {t.times}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
