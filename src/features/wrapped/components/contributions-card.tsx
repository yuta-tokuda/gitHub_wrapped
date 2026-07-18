import type { ContributionSummary } from "@/types/github";

import { formatNumber } from "../utils";

type ContributionsCardProps = {
  contributions: ContributionSummary;
};

export function ContributionsCard({ contributions }: ContributionsCardProps) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">Contribution Snapshot</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        直近 {contributions.lookbackDays} 日の公開イベントを集計
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Total Contribution Units</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.totalContributions)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Push Events</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.pushEvents)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Pull Request Events</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.pullRequestEvents)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Issues Events</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(contributions.issuesEvents)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
