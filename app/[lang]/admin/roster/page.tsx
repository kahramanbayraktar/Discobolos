import { LogoutButton } from "@/components/auth/logout-button";
import { DeletePlayerButton } from "@/components/roster/delete-player-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getPlayers } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { Edit, Plus, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminRosterListPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/login`);

  const players = await getPlayers();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Admin: Roster Management
        </h1>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href={`/${lang}/admin/roster/new`} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Player
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Roster</CardTitle>
          <CardDescription>
            Manage the players appearing on the public roster page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No players found. Add your first teammate!
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-bold">{player.number}</TableCell>
                    <TableCell className="font-medium">
                      {player.name}
                      {player.nickname && (
                        <span className="block text-xs text-muted-foreground italic">
                          "{player.nickname}"
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>
                      {player.isCaptain ? (
                        <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full font-bold">
                          Captain
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Player</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/${lang}/admin/roster/${player.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeletePlayerButton playerId={player.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
