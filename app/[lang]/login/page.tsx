"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

// Ana mantığın olduğu bileşen (Bunu Suspense içine alacağız)
function LoginContent() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = params.lang as string;
  const next = searchParams.get("next") || "/";
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if player exists with this email and access code
      const { data: player, error } = await supabase
        .from("players")
        .select("id, name, is_captain")
        .eq("email", email.toLowerCase().trim())
        .eq("access_code", accessCode.trim())
        .maybeSingle();

      if (error) throw error;

      if (!player) {
        toast.error("Hatalı e-posta veya erişim kodu!");
        setIsLoading(false);
        return;
      }

      // Set a cookie for the "session"
      // In a real production app, this should be a JWT or similar signed token
      // For this team app, we'll store the player ID as a simple token
      document.cookie = `player_token=${player.id}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;

      toast.success(`Hoş geldin, ${player.name}!`);
      router.push(next);
      router.refresh();
    } catch (err: any) {
      toast.error("Giriş yapılırken bir hata oluştu: " + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-[family-name:var(--font-display)]">
            Discobolos Giriş
          </CardTitle>
          <CardDescription>
            Kaptanının sana verdiği e-posta ve erişim kodu ile giriş yap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessCode">Erişim Kodu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="****"
                  className="pl-10"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Giriş Yap"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-6">
              Giriş yapamıyor musun? E-postanı veya kodunu unutursan kaptanına danış.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Next.js'in beklediği asıl export
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
