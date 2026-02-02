"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, ChevronLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const params = useParams();
  const lang = params.lang as string;
  const supabase = createClient();

  // Simple translation helper since we are in a client component
  // In a real app, we might pass these from the page or use a context
  const content = lang === 'tr' ? {
    title: "Şifremi Unuttum",
    description: "E-posta adresini gir, sana şifreni sıfırlaman için bir bağlantı gönderelim.",
    emailLabel: "E-posta Adresi",
    sendLink: "Sıfırlama Bağlantısı Gönder",
    backToLogin: "Giriş Sayfasına Dön",
    successTitle: "E-postanı Kontrol Et",
    successDescription: `Şifre sıfırlama bağlantısını ${email} adresine gönderdik.`,
  } : {
    title: "Reset Password",
    description: "Enter your email and we'll send you a link to reset your password.",
    emailLabel: "Email Address",
    sendLink: "Send Reset Link",
    backToLogin: "Back to Login",
    successTitle: "Check your email",
    successDescription: `We've sent a password reset link to ${email}.`,
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${lang}/login/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      setIsSubmitted(true);
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-sm text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-primary animate-in zoom-in duration-300" />
            </div>
            <CardTitle className="text-2xl font-bold">{content.successTitle}</CardTitle>
            <CardDescription className="text-base mt-2">
              {content.successDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${lang}/login`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {content.backToLogin}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{content.emailLabel}</Label>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : content.sendLink}
            </Button>
            
            <div className="text-center mt-4">
              <Link
                href={`/${lang}/login`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                {content.backToLogin}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
