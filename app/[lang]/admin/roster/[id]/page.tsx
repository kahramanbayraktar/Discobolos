import { LogoutButton } from "@/components/auth/logout-button";
import { PlayerForm } from "@/components/roster/player-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getPlayerById } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/login`);
  }

  const player = await getPlayerById(id);
  if (!player) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
            Admin: Edit Player
          </h1>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update {player.name}</CardTitle>
            <CardDescription>
              Modify the info for jersey number #{player.number}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlayerForm initialData={player} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
