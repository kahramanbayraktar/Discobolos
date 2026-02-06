import { AttendanceBadge } from "@/components/attendance/attendance-badge";
import { PlayerCardV2 } from "@/components/profile/player-card-v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPlayerById, supabase } from "@/lib/supabase";
import { PlayerStats } from "@/lib/types";
import { Award, Shield, Trophy } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PlayerProfilePageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({ params }: PlayerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayerById(id);

  if (!player) {
    return {
      title: "Player Not Found",
    };
  }

  return {
    title: `${player.name} #${player.number} | Halikarnassos Discobolos`,
    description: `Check out ${player.name}'s player profile, stats, and badges.`,
  };
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { lang, id } = await params;
  
  // 1. Fetch Player
  const player = await getPlayerById(id);
  
  if (!player) {
    notFound();
  }

  // 2. Fetch Attendance for Stats
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('player_id', player.id);

  // 3. Calculate Stats
  const playerAttendance = (attendance || []).filter(a => a.is_present);
  const totalPoints = playerAttendance.reduce((sum, a) => {
    let pts = 1;
    if (a.is_early) pts += 2;
    if (a.is_on_time) pts += 1;
    if (a.has_double_jersey) pts += 1;
    return sum + pts;
  }, 0);

  // Extend player with stats
  const playerStats: PlayerStats = {
    ...player,
    attendanceCount: playerAttendance.length,
    earlyArrivalCount: playerAttendance.filter(a => a.is_early).length,
    onTimeCount: playerAttendance.filter(a => a.is_on_time).length,
    doubleJerseyCount: playerAttendance.filter(a => a.has_double_jersey).length,
    totalPoints,
  };

  const getRankLabel = (points: number) => {
    if (points > 50) return "Legend";
    if (points > 30) return "Elite";
    if (points > 15) return "Veteran";
    return "Rookie";
  };

  return (
    <div className="py-12 md:py-20 container mx-auto px-4">
      {/* Back to Roster */}
      <div className="mb-8">
        <Link href={`/${lang}/roster`}>
          <Button variant="ghost" className="gap-2">
            ← {lang === 'tr' ? "Kadroya Dön" : "Back to Roster"}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Player Card */}
        <div className="lg:col-span-5 flex flex-col items-center gap-8">
          <div className="w-full max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <PlayerCardV2 
              player={playerStats} 
              config={player.cardConfig} 
              size="lg" 
              className="shadow-2xl mx-auto"
              isHoverable={false}
            />
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Shield className="w-6 h-6 text-primary mb-2 opacity-75" />
                <span className="text-2xl font-bold">{playerStats.attendanceCount}</span>
                <span className="text-xs uppercase text-muted-foreground font-bold">Attendance</span>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Trophy className="w-6 h-6 text-primary mb-2 opacity-75" />
                <span className="text-2xl font-bold">{playerStats.totalPoints}</span>
                <span className="text-xs uppercase text-muted-foreground font-bold">Total Points</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Details & Badges */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Bio / Fun Fact */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)]">
              {player.name}
            </h1>
            <div className="flex flex-wrap gap-3">
              <Badge className="text-lg py-1 px-4">{player.position}</Badge>
              <Badge variant="outline" className="text-lg py-1 px-4 border-primary/20 bg-primary/5">
                {getRankLabel(totalPoints)}
              </Badge>
              <Badge variant="secondary" className="text-lg py-1 px-4">
                Joined {player.yearJoined}
              </Badge>
            </div>
            
            <div className="mt-8 p-6 bg-muted/30 rounded-2xl border-l-4 border-primary/40 italic text-lg text-muted-foreground">
              "{player.funFact || 'Ready to play!'}"
            </div>
          </div>

          {/* Badge Showcase */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
                {lang === 'tr' ? "Rozet Koleksiyonu" : "Badge Collection"}
              </h2>
            </div>
            
            <Card className="border-none bg-gradient-to-br from-muted/50 to-transparent">
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
                  {playerStats.earlyArrivalCount >= 3 && (
                    <AttendanceBadge type="early_bird" name="Erken Gelme" description="Şafak operasyonları uzmanı!" className="h-24 w-24" />
                  )}
                  {playerStats.doubleJerseyCount >= 3 && (
                    <AttendanceBadge type="chameleon" name="Çift Tişört" description="Moda ve hazırlık bir arada." className="h-24 w-24" />
                  )}
                  {playerStats.attendanceCount >= 5 && (
                    <AttendanceBadge type="iron_man" name="Katılım" description="Bu sahada yağmur çamur dinlemedi." className="h-24 w-24" />
                  )}
                  {playerStats.onTimeCount >= 3 && (
                    <AttendanceBadge type="reliable" name="Dakiklik" description="Saniyesi saniyesine sahadaydı." className="h-24 w-24" />
                  )}
                  {playerStats.attendanceCount < 1 && (
                    <p className="text-muted-foreground italic w-full text-center py-8">
                      {lang === 'tr' ? "Henüz rozet kazanılmamış." : "No badges earned yet."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
