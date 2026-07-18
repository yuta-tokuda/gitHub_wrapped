import { TrendingUp } from "lucide-react";

import type { GrowthCurveInsight } from "@/features/wrapped/analysis/growth-curve";
import { CardHeader } from "@/features/wrapped/components/card-header";

type GrowthCurveCardProps = {
  insight: GrowthCurveInsight;
};

export function GrowthCurveCard({ insight }: GrowthCurveCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-indigo-400/70 p-6">
      <CardHeader
        description="直近活動量と新規開発比率から成長カーブを推定"
        icon={TrendingUp}
        iconClassName="bg-indigo-500/15 text-indigo-300"
        title="成長カーブ"
      />
      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm font-semibold">成長スコア: {insight.growthScore} / 100</p>
        <p className="mt-1 text-sm font-medium text-indigo-200">{insight.momentumLabel}</p>
        <p className="mt-1 text-sm text-muted-foreground">{insight.summary}</p>
      </div>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <li className="rounded-md border px-3 py-2">新規リポジトリ: {insight.recentRepositoryCount}</li>
        <li className="rounded-md border px-3 py-2">長期運用リポジトリ: {insight.matureRepositoryCount}</li>
        <li className="rounded-md border px-3 py-2">
          直近活動率: {(insight.recentContributionShare * 100).toFixed(1)}%
        </li>
      </ul>
    </section>
  );
}
