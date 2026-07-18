"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartLucide } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { CardHeader } from "@/features/wrapped/components/card-header";
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
    <section className="glass-card border-l-4 border-l-lime-400/70 p-6">
      <CardHeader
        description="使用言語の比率と件数を視覚的に確認できます"
        icon={PieChartLucide}
        iconClassName="bg-lime-500/15 text-lime-300"
        title="言語比率チャート"
      />
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
            <Tooltip
              contentStyle={{
                background: "rgba(10, 14, 22, 0.92)",
                border: "1px solid rgba(132, 204, 22, 0.4)",
                borderRadius: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {languageStats.map((item, index) => (
          <li
            className="flex items-center justify-between rounded-md border border-lime-300/25 bg-lime-500/[0.04] px-3 py-2 text-sm"
            key={item.name}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="font-medium">{item.name}</span>
            </div>
            <span className="text-muted-foreground">
              {item.count}件 ({item.ratio}%)
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
