import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getServerPlayer } from "@/lib/supabase/server";
import { Calendar, Image as ImageIcon, Newspaper, Settings, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const player = await getServerPlayer();
  if (!player || !player.isCaptain) redirect(`/${lang}/login`);

  const menuItems = [
    {
      title: "Events",
      description: "Manage practice sessions, matches and social events",
      icon: Calendar,
      href: `/${lang}/admin/events`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Roster",
      description: "Manage team players, positions and fun facts",
      icon: Users,
      href: `/${lang}/admin/roster`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "News",
      description: "Post updates, match reports and announcements",
      icon: Newspaper,
      href: `/${lang}/admin/news`,
      disabled: true,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Gallery",
      description: "Upload photos and manage match albums",
      icon: ImageIcon,
      href: `/${lang}/admin/gallery`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Settings",
      description: "Website configuration and admin users",
      icon: Settings,
      href: `/${lang}/admin/settings`,
      disabled: true,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {player.name}. Manage your platform here.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link 
            key={item.title} 
            href={item.disabled ? "#" : item.href}
            className={`group block transition-all ${item.disabled ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1"}`}
          >
            <Card className="h-full border-2 border-transparent group-hover:border-primary/20 transition-colors bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {item.title}
                  {item.disabled && (
                    <span className="ml-2 text-[10px] items-center py-0.5 px-2 rounded-full font-semibold uppercase bg-muted text-muted-foreground align-middle">
                      Soon
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-base leading-snug">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
