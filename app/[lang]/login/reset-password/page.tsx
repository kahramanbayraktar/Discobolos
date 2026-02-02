"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const supabase = createClient();

  const content = lang === 'tr' ? {
    title: "Yeni Şifre",
    description: "Lütfen yeni şifreni aşağıya gir.",
    newPasswordLabel: "Yeni Şifre",
    confirmPasswordLabel: "Yeni Şifre Tekrar",
    updateButton: "Şifreyi Güncelle",
    successMessage: "Şifren başarıyla güncellendi! Giriş yapabilirsin.",
    mismatchError: "Şifreler eşleşmiyor.",
  } : {
    title: "New Password",
    description: "Enter your new password below.",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    updateButton: "Update Password",
    successMessage: "Password updated successfully! You can now login.",
    mismatchError: "Passwords do not match.",
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(content.mismatchError);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success(content.successMessage);
      router.push(`/${lang}/login`);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-[family-name:var(--font-display)]">
            {content.title}
          </CardTitle>
          <CardDescription>
            {content.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{content.newPasswordLabel}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{content.confirmPasswordLabel}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : content.updateButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
