import { BriefcaseBusiness } from "lucide-react";
import type { RecruiterSummary } from "@/features/wrapped/analysis/recruiter-summary";
import { CardHeader } from "@/features/wrapped/components/card-header";

type RecruiterSummaryCardProps = {
  summary: RecruiterSummary;
};

export function RecruiterSummaryCard({ summary }: RecruiterSummaryCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-sky-400/70 p-6">
      <CardHeader
        icon={BriefcaseBusiness}
        iconClassName="bg-sky-500/15 text-sky-300"
        title="採用担当者向けサマリー"
      />
      <p className="mt-2 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
        {summary.headline}
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">強み</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {summary.strengths.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">確認ポイント</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {summary.watchPoints.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">推奨ポジション</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {summary.recommendedRoles.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
