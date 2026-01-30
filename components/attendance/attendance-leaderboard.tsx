"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlayerStats } from "@/lib/types";
import { motion } from "framer-motion";
import { AttendanceBadge, BadgeType } from "./attendance-badge";

interface AttendanceLeaderboardProps {
  stats: PlayerStats[];
  dict: any;
}

export function AttendanceLeaderboard({ stats, dict }: AttendanceLeaderboardProps) {
  const t = dict.attendance;

  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[80px] text-center font-bold">{t.table.rank}</TableHead>
            <TableHead className="min-w-[200px]">{t.table.player}</TableHead>
            <TableHead className="text-center hidden md:table-cell">{t.table.presence}</TableHead>
            <TableHead className="text-center">{t.table.badges}</TableHead>
            <TableHead className="text-right font-bold">{t.table.points}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((player, index) => {
            const badges: { type: BadgeType; name: string; desc: string }[] = [];
            
            if (player.earlyArrivalCount >= 3) {
              badges.push({ type: "early_bird", name: t.badges.early_bird.name, desc: t.badges.early_bird.description });
            }
            if (player.doubleJerseyCount >= 3) {
              badges.push({ type: "chameleon", name: t.badges.chameleon.name, desc: t.badges.chameleon.description });
            }
            if (player.attendanceCount >= 5) {
              badges.push({ type: "iron_man", name: t.badges.iron_man.name, desc: t.badges.iron_man.description });
            }
            if (player.onTimeCount >= 3) {
              badges.push({ type: "reliable", name: t.badges.reliable.name, desc: t.badges.reliable.description });
            }

            return (
              <motion.tr
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-center font-bold">
                  {index + 1 === 1 && "🥇"}
                  {index + 1 === 2 && "🥈"}
                  {index + 1 === 3 && "🥉"}
                  {index + 1 > 3 && index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                      <AvatarImage src={player.image} alt={player.name} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold leading-none">{player.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">#{player.number} • {player.position}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-bold">{player.attendanceCount}</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${Math.min(100, (player.attendanceCount / 10) * 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5">
                    {badges.length > 0 ? (
                      badges.map((badge, bIndex) => (
                        <AttendanceBadge 
                          key={bIndex}
                          type={badge.type}
                          name={badge.name}
                          description={badge.desc}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No badges yet</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono font-bold text-sm bg-primary/10 text-primary border-primary/20">
                    {player.totalPoints}
                  </Badge>
                </TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
