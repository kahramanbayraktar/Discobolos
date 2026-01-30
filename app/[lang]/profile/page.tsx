"use client";

import { AttendanceBadge } from "@/components/attendance/attendance-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { PlayerStats } from "@/lib/types";
import { Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ProfilePageProps {
  params: Promise<{ lang: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchPlayerData = async (targetLang: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/${targetLang}/login?next=/${targetLang}/profile`);
      return;
    }
    setUser(user);

    // Fetch player stats
    const { data: players } = await supabase.from('players').select('*');
    const { data: attendance } = await supabase.from('attendance').select('*');

    if (players) {
      const matchedPlayer = players.find(p => p.email?.toLowerCase() === user.email?.toLowerCase());
      if (matchedPlayer) {
        // Calculate stats (simplified here for client side)
        const playerAttendance = (attendance || []).filter(a => a.player_id === matchedPlayer.id && a.is_present);
        const totalPoints = playerAttendance.reduce((sum, a) => {
          let pts = 1;
          if (a.is_early) pts += 2;
          if (a.is_on_time) pts += 1;
          if (a.has_double_jersey) pts += 1;
          return sum + pts;
        }, 0);

        setPlayer({
          id: matchedPlayer.id,
          name: matchedPlayer.name,
          nickname: matchedPlayer.nickname,
          number: matchedPlayer.number,
          position: matchedPlayer.position,
          image: matchedPlayer.image,
          funFact: matchedPlayer.fun_fact,
          yearJoined: matchedPlayer.year_joined,
          isCaptain: matchedPlayer.is_captain,
          email: matchedPlayer.email,
          attendanceCount: playerAttendance.length,
          earlyArrivalCount: playerAttendance.filter(a => a.is_early).length,
          onTimeCount: playerAttendance.filter(a => a.is_on_time).length,
          doubleJerseyCount: playerAttendance.filter(a => a.has_double_jersey).length,
          totalPoints,
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    params.then(p => {
      setLang(p.lang);
      fetchPlayerData(p.lang);
    });
  }, [params]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !player) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Dosya boyutu 2MB'dan küçük olmalı.");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${player.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-uploads') // Using existing bucket for now or user can create 'avatars'
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-uploads')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('players')
        .update({ image: publicUrl })
        .eq('id', player.id);

      if (updateError) throw updateError;

      toast.success("Profil fotoğrafı güncellendi!");
      setPlayer(prev => prev ? { ...prev, image: publicUrl } : null);
    } catch (error: any) {
      console.error(error);
      toast.error("Yükleme başarısız: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-1/3 border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center relative">
            <div className="flex justify-center mb-4 group relative mx-auto w-32 h-32">
              <Avatar className="h-32 w-32 border-4 border-primary/10 transition-all group-hover:opacity-75">
                <AvatarImage src={player?.image} alt={player?.name} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary/5 text-primary">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <CardTitle className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {player?.name || user?.email?.split('@')[0]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {player ? (
              <>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-muted-foreground">Numara:</span>
                  <span className="font-bold text-lg">#{player.number}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-muted-foreground">Pozisyon:</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-none">{player.position}</Badge>
                </div>
                <div className="pt-4 border-t border-primary/10 italic text-sm text-center text-muted-foreground">
                  "{player.funFact}"
                </div>
              </>
            ) : (
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                Email adresin henüz bir oyuncu profili ile eşleşmemiş. Kaptanına haber ver!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats & Badges */}
        <div className="flex-1 space-y-6 w-full">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sezon Başarıların
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Katılım", value: player?.attendanceCount || 0 },
              { label: "Puan", value: player?.totalPoints || 0 },
              { label: "Sıralama", value: player?.rank ? `#${player.rank}` : "-" },
              { label: "Rozetler", value: player ? (player.earlyArrivalCount >= 3 ? 1 : 0) + (player.doubleJerseyCount >= 3 ? 1 : 0) + (player.attendanceCount >= 5 ? 1 : 0) + (player.onTimeCount >= 3 ? 1 : 0) : 0 },
            ].map((stat, i) => (
              <Card key={i} className="text-center border-none bg-primary/5 shadow-none hover:bg-primary/10 transition-colors">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                Kazandığın Rozetler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {player ? (
                  <>
                    {player.earlyArrivalCount >= 3 && (
                      <AttendanceBadge type="early_bird" name="Erkenci Kuş" description="Şafak operasyonları uzmanı!" className="h-16 w-16" />
                    )}
                    {player.doubleJerseyCount >= 3 && (
                      <AttendanceBadge type="chameleon" name="Bukalemun" description="Moda ve hazırlık bir arada." className="h-16 w-16" />
                    )}
                    {player.attendanceCount >= 5 && (
                      <AttendanceBadge type="iron_man" name="Demirbaş" description="Bu sahada yağmur çamur dinlemedi." className="h-16 w-16" />
                    )}
                    {player.onTimeCount >= 3 && (
                      <AttendanceBadge type="reliable" name="Güvenilir" description="Saniyesi saniyesine sahadaydı." className="h-16 w-16" />
                    )}
                    {(player.attendanceCount || 0) < 1 && (
                      <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-xl w-full border border-dashed border-primary/20">
                        Henüz bir rozetin yok. İlk antrenmanınla birlikte koleksiyonun burada başlayacak! 🥏
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Profilin eşleştiğinde rozetlerin burada görünecek.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
