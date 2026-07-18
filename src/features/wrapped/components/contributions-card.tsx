import type { ContributionSummary } from "@/types/github";

import { formatNumber } from "../utils";

type ContributionsCardProps = {
  contributions: ContributionSummary;
};

export function ContributionsCard({ contributions }: ContributionsCardProps) {
  return (
    <section className="glass-card p-6">
      <h2 className="text-xl font-semibold">コントリビューション概要</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        直近 {contributions.lookbackDays} 日の公開イベントを集計
      </p>
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
