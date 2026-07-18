import { Languages } from "lucide-react";

import type { LanguageDiversityInsight } from "@/features/wrapped/analysis/language-diversity";
import { CardHeader } from "@/features/wrapped/components/card-header";

type LanguageDiversityCardProps = {
  insight: LanguageDiversityInsight;
};

export function LanguageDiversityCard({ insight }: LanguageDiversityCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-cyan-400/70 p-6">
      <CardHeader
        description="言語の幅と偏りから技術ポートフォリオを評価"
        icon={Languages}
        iconClassName="bg-cyan-500/15 text-cyan-300"
        title="言語多様性"
      />
      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm font-semibold">多様性スコア: {insight.diversityScore} / 100</p>
        <p className="mt-1 text-sm text-muted-foreground">{insight.summary}</p>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {insight.strengths.map((item) => (
          <li className="rounded-md border px-3 py-2 text-sm" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
