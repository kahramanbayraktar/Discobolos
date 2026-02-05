import { AttendanceLeaderboard } from "@/components/attendance/attendance-leaderboard";
import { BadgeShowcase } from "@/components/attendance/badge-showcase";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getPlayerStats } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.attendance.title} | Discobolos`,
    description: dict.attendance.description,
  };
}

export default async function AttendancePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const stats = await getPlayerStats();
  const t = dict.attendance;

  return (
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {t.badge}
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-6xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
          {t.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t.description}
        </p>
      </div>

      {/* Badge Showcase */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 italic">
          <span className="w-8 h-1 bg-primary rounded-full" />
          {t.showcase_title}
        </h2>
        <BadgeShowcase dict={dict} />
      </div>

      {/* Leaderboard */}
      <AttendanceLeaderboard stats={stats} dict={dict} />

      {/* Footer Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-muted/30 border border-primary/10 backdrop-blur-sm">
          <h3 className="font-bold mb-2">{t.info.scoring_title}</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• {t.info.scoring_presence}: 1 {t.info.scoring_unit}</li>
            <li>• {t.info.scoring_early}: +2 {t.info.scoring_unit}</li>
            <li>• {t.info.scoring_on_time}: +1 {t.info.scoring_unit}</li>
            <li>• {t.info.scoring_double_jersey}: +1 {t.info.scoring_unit}</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-muted/30 border border-accent/10 backdrop-blur-sm">
          <h3 className="font-bold mb-2">{t.info.why_title}</h3>
          <p className="text-sm text-muted-foreground">
            {t.info.why_description}
          </p>
        </div>
      </div>
    </div>
  );
}
