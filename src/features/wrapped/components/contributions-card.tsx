import { Activity } from "lucide-react";
import type { ContributionSummary } from "@/types/github";
import { CardHeader } from "@/features/wrapped/components/card-header";

import { formatNumber } from "../utils";

type ContributionsCardProps = {
  contributions: ContributionSummary;
};

export function ContributionsCard({ contributions }: ContributionsCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-violet-400/70 p-6">
      <CardHeader
        description={`直近 ${contributions.lookbackDays} 日の公開イベントを集計`}
        icon={Activity}
        iconClassName="bg-violet-500/15 text-violet-300"
        title="コントリビューション概要"
      />
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">総貢献ユニット</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.totalContributions)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Pushイベント</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.pushEvents)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">プルリクエストイベント</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.pullRequestEvents)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Issueイベント</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.issuesEvents)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
