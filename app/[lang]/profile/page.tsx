"use client";

import { AttendanceBadge } from "@/components/attendance/attendance-badge";
import { CardEditor } from "@/components/profile/card-editor";
import { PlayerCardV2 } from "@/components/profile/player-card-v2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { PlayerStats } from "@/lib/types";
import { getCookie } from "@/lib/utils";

import { Award, Edit, Loader2, Palette, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfilePageProps {
  params: Promise<{ lang: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editFunFact, setEditFunFact] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchPlayerData = async (targetLang: string) => {
    const playerToken = getCookie('player_token');
    
    if (!playerToken) {
      router.push(`/${targetLang}/login?next=/${targetLang}/profile`);
      return;
    }

    // Fetch player data directly by ID
    const { data: matchedPlayer, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerToken)
      .maybeSingle();

    if (playerError || !matchedPlayer) {
      // If token is invalid, log out
      document.cookie = "player_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push(`/${targetLang}/login`);
      return;
    }

    // Fetch attendance for stats
    const { data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .eq('player_id', matchedPlayer.id);

    // Calculate stats
    const playerAttendance = (attendance || []).filter(a => a.is_present);
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
      cardConfig: matchedPlayer.card_config,
    });
    
    setEditName(matchedPlayer.name);
    setEditNickname(matchedPlayer.nickname || "");
    setEditFunFact(matchedPlayer.fun_fact || "");
    
    setLoading(false);
  };

  useEffect(() => {
    params.then(p => {
      setLang(p.lang);
      fetchPlayerData(p.lang);
    });
  }, [params]);

  const handleSaveProfile = async () => {
    if (!player) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({
          name: editName,
          nickname: editNickname,
          fun_fact: editFunFact
        })
        .eq('id', player.id);

      if (error) throw error;

      toast.success(lang === 'tr' ? "Profil güncellendi!" : "Profile updated!");
      setPlayer(prev => prev ? { 
        ...prev, 
        name: editName, 
        nickname: editNickname, 
        funFact: editFunFact 
      } : null);
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setIsSaving(false);
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
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Profile Card Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center gap-6">
          <div className="relative group">
            <PlayerCardV2 
              player={player!} 
              config={player?.cardConfig} 
              size="lg" 
              className="shadow-2xl"
            />
            {/* Hover Edit Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl pointer-events-none">
              <Button 
                variant="secondary" 
                size="sm" 
                className="pointer-events-auto flex gap-2 shadow-lg"
                onClick={() => setIsCardEditorOpen(true)}
              >
                <Edit className="w-4 h-4" />
                {lang === 'tr' ? "Kartı Düzenle" : "Customize Card"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 gap-2" 
              variant="outline"
              onClick={() => setIsCardEditorOpen(true)}
            >
              <Palette className="w-4 h-4" />
              {lang === 'tr' ? "Kartı Özelleştir" : "Customize"}
            </Button>
            <Button 
              className="flex-1 gap-2" 
              variant="outline"
              onClick={() => {
                 navigator.clipboard.writeText(`${window.location.origin}/${lang}/roster/${player?.id}`);
                 toast.success(lang === 'tr' ? "Profil linki kopyalandı!" : "Profile link copied!");
              }}
            >
              <Share2 className="w-4 h-4" />
              {lang === 'tr' ? "Paylaş" : "Share"}
            </Button>
          </div>

          {player && (
            <CardEditor 
              player={player} 
              open={isCardEditorOpen} 
              onOpenChange={setIsCardEditorOpen}
              lang={lang}
              onSave={(newConfig) => setPlayer(prev => prev ? { ...prev, cardConfig: newConfig } : null)}
            />
          )}

          {/* Quick Stats Summary */}
           <Card className="w-full bg-primary/5 border-none shadow-none">
            <CardContent className="p-4 flex justify-between text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{player?.attendanceCount}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Attendance</p>
              </div>
              <div>
                <div className="h-full w-px bg-primary/20" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{player?.totalPoints}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Points</p>
              </div>
              <div>
                <div className="h-full w-px bg-primary/20" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">#{player?.rank || "-"}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Rank</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details & Badges Section */}
        <div className="flex-1 space-y-8 w-full">
          
          {/* Editable Info */}
          <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                {lang === 'tr' ? "Oyuncu Bilgileri" : "Player Info"}
              </CardTitle>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {lang === 'tr' ? "Düzenle" : "Edit"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        {lang === 'tr' ? "İsim" : "Name"}
                      </label>
                      <input 
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase">
                        {lang === 'tr' ? "Lakap" : "Nickname"}
                      </label>
                      <input 
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        placeholder="e.g. The Flash"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      {lang === 'tr' ? "Eğlenceli Bilgi" : "Fun Fact"}
                    </label>
                    <textarea 
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                      value={editFunFact}
                      onChange={(e) => setEditFunFact(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      {lang === 'tr' ? "İptal" : "Cancel"}
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {lang === 'tr' ? "Kaydet" : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      {lang === 'tr' ? "E-posta" : "Email"}
                    </p>
                    <p>{player?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      {lang === 'tr' ? "Katılım Yılı" : "Joined"}
                    </p>
                    <p>{player?.yearJoined}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      {lang === 'tr' ? "Eğlenceli Bilgi" : "Fun Fact"}
                    </p>
                    <p className="italic text-muted-foreground">
                      "{player?.funFact || (lang === 'tr' ? "Henüz bilgi yok." : "No info yet.")}"
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges Section */}
          <div className="space-y-4">
             <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              {lang === 'tr' ? "Koleksiyon" : "Collection"}
            </h2>
            
            <Card className="border-primary/10 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm">
               <CardContent className="p-6">
                <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                  {player ? (
                    <>
                      {player.earlyArrivalCount >= 3 && (
                        <AttendanceBadge type="early_bird" name="Erken Gelme" description="Şafak operasyonları uzmanı!" className="h-20 w-20" />
                      )}
                      {player.doubleJerseyCount >= 3 && (
                        <AttendanceBadge type="chameleon" name="Çift Tişört" description="Moda ve hazırlık bir arada." className="h-20 w-20" />
                      )}
                      {player.attendanceCount >= 5 && (
                        <AttendanceBadge type="iron_man" name="Katılım" description="Bu sahada yağmur çamur dinlemedi." className="h-20 w-20" />
                      )}
                      {player.onTimeCount >= 3 && (
                        <AttendanceBadge type="reliable" name="Dakiklik" description="Saniyesi saniyesine sahadaydı." className="h-20 w-20" />
                      )}
                      {(player.attendanceCount || 0) < 1 && (
                        <div className="flex flex-col items-center justify-center p-8 w-full text-center border-2 border-dashed border-muted rounded-xl">
                          <p className="text-muted-foreground italic mb-2">
                            {lang === 'tr' ? "Henüz bir rozetin yok." : "No badges yet."}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'tr' ? "Antrenmanlara katılarak rozet kazanabilirsin!" : "Join practices to earn badges!"}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Yükleniyor...</p>
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


