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
import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { CardHeader } from "@/features/wrapped/components/card-header";
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
    <section className="glass-card border-l-4 border-l-orange-400/70 p-6">
      <CardHeader
        description="スター数の比較で主要リポジトリの存在感を可視化"
        icon={BarChart3}
        iconClassName="bg-orange-500/15 text-orange-300"
        title="リポジトリランキングチャート"
      />
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={toChartData(repositories)}>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "rgba(10, 14, 22, 0.92)",
                border: "1px solid rgba(251, 146, 60, 0.4)",
                borderRadius: "10px",
              }}
            />
            <Bar dataKey="stars" fill="#fb923c" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
