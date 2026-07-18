import Link from "next/link";
import { Sparkles } from "lucide-react";

import type { RepositoryMetrics } from "@/types/github";
import { CardHeader } from "@/features/wrapped/components/card-header";

import { formatNumber } from "../utils";

type MetricsCardProps = {
  metrics: RepositoryMetrics;
};

export function MetricsCard({ metrics }: MetricsCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-cyan-400/70 p-6">
      <CardHeader
        icon={Sparkles}
        iconClassName="bg-cyan-500/15 text-cyan-300"
        title="リポジトリ概要"
      />
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">主要言語</dt>
          <dd className="mt-1 text-lg font-semibold">
            {metrics.topLanguage ?? "データなし"}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">総スター数</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(metrics.totalStars)}
          </dd>
        </div>
        <div className="rounded-lg border px-4 py-3">
          <dt className="text-xs text-muted-foreground">総フォーク数</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(metrics.totalForks)}
          </dd>
        </div>
      </dl>
      <div className="mt-5 rounded-lg border px-4 py-4">
        <p className="text-xs text-muted-foreground">注目リポジトリ</p>
        {metrics.topRepository ? (
          <>
            <h3 className="mt-1 text-lg font-semibold">{metrics.topRepository.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ★ {formatNumber(metrics.topRepository.stargazersCount)} / フォーク{" "}
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
