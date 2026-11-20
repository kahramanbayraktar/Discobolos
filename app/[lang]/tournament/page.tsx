import type { Metadata } from "next";
import { TournamentBudgetCalculator } from "@/components/tournament/tournament-budget-calculator";

export const metadata: Metadata = {
  title: "Turnuva Bütçe Planlayıcı | Discobolos",
  description:
    "Discobolos Kırklareli Ultimate Frisbee turnuvası için kişi başı minimum, seçili ve konforlu maliyet simülatörü.",
};

export default function TournamentPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-sm font-medium text-primary mb-2">
            Discobolos Organizasyon Planlayıcı
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            Kırklareli Turnuva Bütçesi
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
            Bodrum çıkışlı 1 gecelik turnuva planı için kişi başı minimum ve konforlu harcama aralıklarını canlı olarak simüle edin.
          </p>
        </div>

        <TournamentBudgetCalculator />
      </div>
    </div>
  );
}
