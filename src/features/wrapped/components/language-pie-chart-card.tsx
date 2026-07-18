"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { EmptyState } from "@/components/common/empty-state";
import type { LanguageStat } from "@/types/github";

type LanguagePieChartCardProps = {
  languageStats: LanguageStat[];
};

const CHART_COLORS = [
  "#22c55e",
  "#0ea5e9",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#e879f9",
  "#84cc16",
];

export function LanguagePieChartCard({ languageStats }: LanguagePieChartCardProps) {
  if (languageStats.length === 0) {
    return (
      <EmptyState
        description="Language情報がないためチャートを描画できません。"
        title="言語比率チャート"
      />
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">言語比率チャート</h2>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={languageStats}
              dataKey="count"
              innerRadius={56}
              nameKey="name"
              outerRadius={96}
            >
              {languageStats.map((item, index) => (
                <Cell
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  key={item.name}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
