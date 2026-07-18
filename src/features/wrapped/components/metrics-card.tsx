import Link from "next/link";

import type { RepositoryMetrics } from "@/types/github";

import { formatNumber } from "../utils";

type MetricsCardProps = {
  metrics: RepositoryMetrics;
};

export function MetricsCard({ metrics }: MetricsCardProps) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">Repository Highlights</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Top Language</dt>
          <dd className="mt-1 text-lg font-semibold">
            {metrics.topLanguage ?? "データなし"}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Total Stars</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(metrics.totalStars)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">Total Forks</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(metrics.totalForks)}
          </dd>
        </div>
      </dl>
      <div className="mt-5 rounded-lg border px-4 py-4">
        <p className="text-xs text-muted-foreground">Top Repository</p>
        {metrics.topRepository ? (
          <>
            <h3 className="mt-1 text-lg font-semibold">{metrics.topRepository.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ★ {formatNumber(metrics.topRepository.stargazersCount)} / Fork{" "}
              {formatNumber(metrics.topRepository.forksCount)}
            </p>
            <Link
              className="mt-3 inline-flex text-sm underline underline-offset-4"
              href={metrics.topRepository.htmlUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              リポジトリを見る
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">公開リポジトリがありません。</p>
        )}
      </div>
    </section>
  );
}
