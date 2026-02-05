"use client";

import { AttendanceBadge } from "@/components/attendance/attendance-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { PlayerStats } from "@/lib/types";
import { getCookie } from "@/lib/utils";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const AVATARS = [
  "/images/avatars/player-1.png",
  "/images/avatars/player-2.png",
  "/images/avatars/player-3.png",
  "/images/avatars/player-4.png",
  "/images/avatars/player-5.png",
  "/images/avatars/player-cyberpunk.png",
  "/images/avatars/player-graffiti.png",
  "/images/avatars/player-female-1.png",
  "/images/avatars/player-female-2.png",
  "/images/avatars/player-female-3.png",
  "/images/avatars/player-cosmic.png",
  "/images/avatars/player-vaporwave.png",
];

interface ProfilePageProps {
  params: Promise<{ lang: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lang, setLang] = useState<string>("");
const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editFunFact, setEditFunFact] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
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
      setPlayer((prev: PlayerStats | null) => prev ? { ...prev, image: publicUrl } : null);
    } catch (error: any) {
      console.error(error);
      toast.error("Yükleme başarısız: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectAvatar = async (url: string) => {
    if (!player) return;
    
    setUploading(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({ image: url })
        .eq('id', player.id);

      if (error) throw error;

      toast.success(lang === 'tr' ? "Profil fotoğrafı seçildi!" : "Avatar selected!");
      setPlayer((prev: PlayerStats | null) => prev ? { ...prev, image: url } : null);
      setIsAvatarPickerOpen(false);
    } catch (error: any) {
      toast.error("Hata: " + error.message);
    } finally {
      setUploading(false);
    }
  };

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
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-1/3 border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center relative">
            <div className="flex justify-center mb-4 group relative mx-auto w-32 h-32">
              <Avatar className="h-32 w-32 border-4 border-primary/10 transition-all group-hover:opacity-75">
                <AvatarImage src={player?.image} alt={player?.name} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary/5 text-primary">
                  {player?.email?.[0]?.toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => setIsAvatarPickerOpen(true)}
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

              <Dialog open={isAvatarPickerOpen} onOpenChange={setIsAvatarPickerOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{lang === 'tr' ? "Profil Fotoğrafını Değiştir" : "Change Profile Picture"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                    {/* Upload Option */}
                    <button
                      onClick={() => {
                        setIsAvatarPickerOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl hover:bg-primary/5 transition-colors gap-2"
                    >
                      <Camera className="w-8 h-8 text-primary/40" />
                      <span className="text-xs font-medium">{lang === 'tr' ? "Fotoğraf Yükle" : "Upload Photo"}</span>
                    </button>

                    {/* Pre-generated Avatars */}
                    {AVATARS.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectAvatar(url)}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                      >
                        <Image
                          src={url}
                          alt={`Avatar ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardTitle className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {player?.name || 'Oyuncu'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{player?.email}</p>
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
                
                {isEditing ? (
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">İsim</label>
                      <input 
                        className="w-full bg-background border border-primary/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Lakap</label>
                      <input 
                        className="w-full bg-background border border-primary/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        placeholder="Örn: The Flash"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground">Eğlenceli Bilgi</label>
                      <textarea 
                        className="w-full bg-background border border-primary/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
                        value={editFunFact}
                        onChange={(e) => setEditFunFact(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'tr' ? "Kaydet" : "Save")}
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1" onClick={() => {
                        setIsEditing(false);
                        setEditName(player.name);
                        setEditNickname(player.nickname || "");
                        setEditFunFact(player.funFact || "");
                      }}>
                        {lang === 'tr' ? "İptal" : "Cancel"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="pt-4 border-t border-primary/10 italic text-sm text-center text-muted-foreground">
                      "{player.funFact}"
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 text-xs h-8 border-primary/20 hover:bg-primary/5"
                      onClick={() => setIsEditing(true)}
                    >
                      {lang === 'tr' ? "Profili Düzenle" : "Edit Profile"}
                    </Button>
                  </>
                )}
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
                      <AttendanceBadge type="early_bird" name="Erken Gelme" description="Şafak operasyonları uzmanı!" className="h-16 w-16" />
                    )}
                    {player.doubleJerseyCount >= 3 && (
                      <AttendanceBadge type="chameleon" name="Çift Tişört" description="Moda ve hazırlık bir arada." className="h-16 w-16" />
                    )}
                    {player.attendanceCount >= 5 && (
                      <AttendanceBadge type="iron_man" name="Katılım" description="Bu sahada yağmur çamur dinlemedi." className="h-16 w-16" />
                    )}
                    {player.onTimeCount >= 3 && (
                      <AttendanceBadge type="reliable" name="Dakiklik" description="Saniyesi saniyesine sahadaydı." className="h-16 w-16" />
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
