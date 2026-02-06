"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Player, PlayerCardConfig } from "@/lib/types";
import { Loader2, Palette, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PlayerCardV2 } from "./player-card-v2";

interface CardEditorProps {
  player: Player & {
    attendanceCount?: number;
    totalPoints?: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: PlayerCardConfig) => void;
  lang: string;
}

const DEFAULT_CONFIG: PlayerCardConfig = {
  theme: 'classic',
  bgPattern: 'dots',
  primaryColor: 'hsl(var(--primary))',
};

const THEMES = [
  { id: 'classic', name: 'Classic' },
  { id: 'neon', name: 'Cyber Neon' },
  { id: 'gold', name: 'Golden Legend' },
  { id: 'minimal', name: 'Minimalist' },
];

const PATTERNS = [
  { id: 'dots', name: 'Dots' },
  { id: 'lines', name: 'Diagonal Lines' },
  { id: 'waves', name: 'Waves' },
  { id: 'solid', name: 'Solid' },
];

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Cyan', value: '#06b6d4' },
];

export function CardEditor({ player, open, onOpenChange, onSave, lang }: CardEditorProps) {
  const router = useRouter();
  const [config, setConfig] = useState<PlayerCardConfig>(player.cardConfig || DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({ card_config: config })
        .eq('id', player.id);

      if (error) throw error;

      onSave(config);
      toast.success(lang === 'tr' ? "Kart tasarımı kaydedildi!" : "Card design saved!");
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      toast.error("Error saving card: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof PlayerCardConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // AI: Generate Bio (Hype Man)
  const handleGenerateBio = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-bio", {
        method: "POST",
        body: JSON.stringify({ player }),
      });
      const data = await res.json();
      
      if (data.bios && data.bios.length > 0) {
        const newBio = data.bios[0];
        
        // Update database directly implementation for bio
        const { error } = await supabase
          .from('players')
          .update({ fun_fact: newBio })
          .eq('id', player.id);

        if (error) throw error;
        
        toast.success(lang === 'tr' ? "Yeni biyografi hazır!" : "New bio generated!");
        router.refresh();
      } else {
        throw new Error("No bio generated");
      }
    } catch (e) {
      toast.error(lang === 'tr' ? "AI yanıt vermedi, tekrar dene." : "AI failed, try again.");
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // AI: Generate Avatar (Avatar Studio)
  const handleGenerateAvatar = async () => {
    if (!avatarPrompt.trim()) {
      toast.error(lang === 'tr' ? "Lütfen bir açıklama gir." : "Please enter a description.");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-avatar", {
        method: "POST",
        body: JSON.stringify({ 
          prompt: avatarPrompt,
          style: config.theme
        }),
      });
      const data = await res.json();

      if (data.url) {
        // Update DB with new avatar URL
        const { error } = await supabase
          .from('players')
          .update({ image: data.url })
          .eq('id', player.id);

        if (error) throw error;

        toast.success(lang === 'tr' ? "Avatar başarıyla yenilendi!" : "Avatar updated successfully!");
        
        // Refresh to show new image
        router.refresh(); 
        
        // Optional: Close dialog or switch to verified state? 
        // For now, let user see the update in the preview below/left
      } else {
         toast.error(lang === 'tr' ? "Avatar oluşturulamadı." : "Failed to generate avatar.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error generating avatar");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lang === 'tr' ? "Oyuncu Kartını Tasarla" : "Customize Player Card"}
          </DialogTitle>
          <DialogDescription>
            {lang === 'tr' 
              ? "Kartının görünümünü özelleştir ve tarzını sahaya yansıt." 
              : "Customize your card's look and show your style on the field."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
          {/* Preview Section */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start p-6 bg-muted/30 rounded-xl border border-dashed border-primary/20 sticky top-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-4 tracking-widest">
              {lang === 'tr' ? "Önizleme" : "Preview"}
            </p>
            <div className="transform scale-100 origin-top">
              <PlayerCardV2 
                player={player} 
                config={config} 
                size="lg" 
                className="shadow-2xl scale-95 md:scale-100"
                isHoverable={false}
              />
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-7 space-y-6">
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {lang === 'tr' ? "Stil" : "Style"}
                </TabsTrigger>
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {lang === 'tr' ? "Renkler" : "Colors"}
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Wand2 className="w-4 h-4" />
                  AI Studio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="style" className="space-y-6 pt-2">
                <div className="space-y-3">
                  <Label>{lang === 'tr' ? "Tema" : "Theme"}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {THEMES.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => updateConfig('theme', theme.id)}
                        className={`
                          cursor-pointer p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-1
                          ${config.theme === theme.id 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-border bg-background hover:bg-muted/50'}
                        `}
                      >
                        <span className="font-semibold text-sm">{theme.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {theme.id === 'classic' && "Timeless"}
                          {theme.id === 'neon' && "Cyberpunk"}
                          {theme.id === 'gold' && "Prestige"}
                          {theme.id === 'minimal' && "Clean"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{lang === 'tr' ? "Arka Plan Deseni" : "Background Pattern"}</Label>
                  <Select 
                    value={config.bgPattern} 
                    onValueChange={(val) => updateConfig('bgPattern', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PATTERNS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-6 pt-2">
                <div className="space-y-3">
                  <Label>{lang === 'tr' ? "Vurgu Rengi" : "Accent Color"}</Label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateConfig('primaryColor', color.value)}
                        className={`
                          w-10 h-10 rounded-full border-2 transition-transform hover:scale-110
                          ${config.primaryColor === color.value ? 'border-primary ring-2 ring-offset-2 ring-primary/50' : 'border-transparent'}
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* AI STUDIO TAB */}
              <TabsContent value="ai" className="space-y-6 pt-2">
                {/* Hype Man Section */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Sparkles className="w-4 h-4" />
                        AI Hype Man
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === 'tr' 
                          ? "İstatistiklerine göre havalı bir 'Fun Fact' yazdır." 
                          : "Generate a hype bio based on your stats."}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerateBio} 
                    disabled={aiLoading}
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {lang === 'tr' ? "Biyografi Oluştur" : "Auto-Write Bio"}
                  </Button>
                </div>

                {/* Avatar Studio Section */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 space-y-4">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Palette className="w-4 h-4" />
                      Avatar Studio <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full ml-2">Beta</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === 'tr' 
                        ? "Takım stiline uygun profil resmi oluştur." 
                        : "Generate a profile picture in team style."}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {lang === 'tr' ? "Görünümünü Tarif Et" : "Describe Your Look"}
                    </Label>
                    <Textarea 
                      value={avatarPrompt}
                      onChange={(e) => setAvatarPrompt(e.target.value)}
                      placeholder={lang === 'tr' ? "Örn: Güneş gözlüklü, uzun saçlı..." : "E.g. Wearing a visor and sunglasses..."}
                      className="resize-none h-20 text-sm bg-background/50"
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateAvatar}
                    disabled={aiLoading || !avatarPrompt}
                    size="sm"
                    variant="outline"
                    className="w-full border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    {lang === 'tr' ? "Avatar Oluştur" : "Generate Avatar"}
                  </Button>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {lang === 'tr' ? "Kapat" : "Close"}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {lang === 'tr' ? "Kaydet" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
