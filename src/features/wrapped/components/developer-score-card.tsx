import { Gauge } from "lucide-react";
import { SCORE_WEIGHTS } from "@/features/wrapped/analysis/constants";
import type { DeveloperScoreResult } from "@/features/wrapped/analysis/types";
import { CardHeader } from "@/features/wrapped/components/card-header";

type DeveloperScoreCardProps = {
  score: DeveloperScoreResult;
};

const SCORE_LABELS: Record<string, string> = {
  repositories: "リポジトリ数",
  stars: "スター",
  followers: "フォロワー",
  contributions: "貢献度",
  readmeCoverage: "README充実度",
  languageDiversity: "言語多様性",
  recentActivity: "更新頻度",
};

const SCORE_ACTION_HINTS: Record<keyof DeveloperScoreResult["breakdown"], string> = {
  repositories:
    "小さくても完了したリポジトリを増やすと上がりやすいです。",
  stars:
    "README整備・成果共有・OSS公開でスター獲得につながります。",
  followers:
    "継続的な発信とコントリビューションでフォローされやすくなります。",
  contributions:
    "Push・PR・Issue対応を増やすと上がります（公開イベント最大100件で集計）。",
  readmeCoverage:
    "READMEやDocsを各リポジトリに用意すると改善しやすいです。",
  languageDiversity:
    "普段使わない言語でも実装して公開すると伸びやすいです。",
  recentActivity:
    "手持ちリポジトリを定期更新すると上がります（個人開発向け基準）。",
};

const SCORE_MAX_BY_KEY: Record<keyof DeveloperScoreResult["breakdown"], number> = {
  repositories: SCORE_WEIGHTS.repositories,
  stars: SCORE_WEIGHTS.stars,
  followers: SCORE_WEIGHTS.followers,
  contributions: SCORE_WEIGHTS.contributions,
  readmeCoverage: SCORE_WEIGHTS.readmeCoverage,
  languageDiversity: SCORE_WEIGHTS.languageDiversity,
  recentActivity: SCORE_WEIGHTS.recentActivity,
};

function toScoreColor(totalScore: number): string {
  if (totalScore >= 80) {
    return "text-emerald-500";
  }

  if (totalScore >= 60) {
    return "text-amber-500";
  }

  return "text-sky-500";
}

function toProgressRate(key: keyof DeveloperScoreResult["breakdown"], value: number): number {
  const max = SCORE_MAX_BY_KEY[key];
  return Math.max(0, Math.min(100, (value / max) * 100));
}

function formatScoreValue(value: number): string {
  const rounded = Number(value.toFixed(1));
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function DeveloperScoreCard({ score }: DeveloperScoreCardProps) {
  const entries = Object.entries(score.breakdown) as Array<
    [keyof DeveloperScoreResult["breakdown"], number]
  >;

  return (
    <section className="glass-card border-l-4 border-l-amber-400/70 p-6">
      <CardHeader
        description="リポジトリ・スター・フォロワー・貢献度などから算出した総合評価"
        icon={Gauge}
        iconClassName="bg-amber-500/15 text-amber-300"
        title="開発者スコア"
      />
      <p className={`mt-6 text-6xl font-bold ${toScoreColor(score.totalScore)}`}>
        {score.totalScore}
        <span className="ml-2 text-base text-muted-foreground">/ 100</span>
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div className="rounded-lg border px-4 py-3" key={key}>
            <dt className="text-xs text-muted-foreground">
              {SCORE_LABELS[key] ?? key}
            </dt>
            <dd className="mt-1 text-lg font-semibold">
              {formatScoreValue(value)} / {SCORE_MAX_BY_KEY[key]}
            </dd>
            <p className="mt-1 text-xs text-muted-foreground">
              {SCORE_ACTION_HINTS[key]}
            </p>
            <div
              aria-hidden
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${toProgressRate(key, value)}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
