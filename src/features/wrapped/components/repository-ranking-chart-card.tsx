"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "@/components/common/empty-state";
import type { GitHubRepository } from "@/types/github";

type RepositoryRankingChartCardProps = {
  repositories: GitHubRepository[];
};

type ChartRow = {
  name: string;
  stars: number;
};

function toChartData(repositories: GitHubRepository[]): ChartRow[] {
  return repositories.map((repository) => ({
    name: repository.name,
    stars: repository.stargazersCount,
  }));
}

export function RepositoryRankingChartCard({
  repositories,
}: RepositoryRankingChartCardProps) {
  if (repositories.length === 0) {
    return (
      <EmptyState
        description="公開リポジトリが無いためランキングチャートを表示できません。"
        title="リポジトリランキングチャート"
      />
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">リポジトリランキングチャート</h2>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={toChartData(repositories)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="stars" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
