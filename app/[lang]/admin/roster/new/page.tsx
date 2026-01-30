import { LogoutButton } from "@/components/auth/logout-button";
import { PlayerForm } from "@/components/roster/player-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminNewPlayerPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: Add New Player
        </h1>
        <LogoutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Details</CardTitle>
          <CardDescription>
            Enter the information of the new player to add them to the roster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerForm />
        </CardContent>
      </Card>
    </div>
  );
}
