import { Activity } from "lucide-react";

import type { RepositoryHealthInsight } from "@/features/wrapped/analysis/repository-health";
import { CardHeader } from "@/features/wrapped/components/card-header";

type RepositoryHealthCardProps = {
  insight: RepositoryHealthInsight;
};

export function RepositoryHealthCard({ insight }: RepositoryHealthCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-green-400/70 p-6">
      <CardHeader
        description="更新頻度・陳腐化・文書化から健全性を算出"
        icon={Activity}
        iconClassName="bg-green-500/15 text-green-300"
        title="リポジトリ健全性"
      />
      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm font-semibold">健全性スコア: {insight.healthScore} / 100</p>
        <p className="mt-1 text-sm text-muted-foreground">{insight.summary}</p>
      </div>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <li className="rounded-md border px-3 py-2">
          稼働率: {(insight.activeRepositoryRatio * 100).toFixed(1)}%
        </li>
        <li className="rounded-md border px-3 py-2">
          長期未更新リポジトリ: {insight.staleRepositoryCount}
        </li>
        <li className="rounded-md border px-3 py-2">
          アーカイブ済み: {insight.archivedRepositoryCount}
        </li>
        <li className="rounded-md border px-3 py-2">
          READMEカバー率: {(insight.readmeCoverage * 100).toFixed(1)}%
        </li>
      </ul>
      <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
        {insight.actionItems.map((item) => (
          <li key={item}>・{item}</li>
        ))}
      </ul>
    </section>
  );
}
