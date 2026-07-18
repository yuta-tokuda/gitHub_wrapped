import { ShieldAlert } from "lucide-react";

import type { PublicDataInsight } from "@/features/wrapped/analysis/public-data-insight";
import { CardHeader } from "@/features/wrapped/components/card-header";

type PublicDataInsightCardProps = {
  insight: PublicDataInsight;
};

export function PublicDataInsightCard({ insight }: PublicDataInsightCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-rose-400/70 p-6">
      <CardHeader
        description="公開データのみで分析しているため、結果の見え方を補足します"
        icon={ShieldAlert}
        iconClassName="bg-rose-500/15 text-rose-300"
        title="分析の見え方（重要）"
      />

      <div className="mt-4 rounded-md border border-rose-300/30 bg-rose-500/10 px-3 py-2">
        <p className="text-sm font-medium text-rose-200">{insight.confidenceLabel}</p>
        <p className="mt-1 text-sm text-rose-100">{insight.summary}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">この分析で反映しにくい情報</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {insight.missingAreas.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">読み取り時の注意</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {insight.fairnessNotes.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
