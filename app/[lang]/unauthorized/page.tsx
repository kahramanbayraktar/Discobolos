import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Home, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function UnauthorizedPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <Card className="w-full max-w-md border-destructive/20 bg-card/50 backdrop-blur-sm text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-destructive/10">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-[family-name:var(--font-display)] text-destructive">
            {dict.unauthorized.title}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {dict.unauthorized.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2">
            <p className="font-medium">{dict.unauthorized.not_registered}</p>
            <p className="text-muted-foreground">
              {dict.unauthorized.contact_captain}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button asChild variant="default" className="w-full">
              <Link href={`/${lang}`} className="gap-2">
                <Home className="h-4 w-4" />
                {dict.unauthorized.back_home}
              </Link>
            </Button>
            
            <LogoutButton variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              {dict.unauthorized.logout}
            </LogoutButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
