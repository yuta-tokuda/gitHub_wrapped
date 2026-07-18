import { SCORE_WEIGHTS } from "@/features/wrapped/analysis/constants";
import type { DeveloperScoreResult } from "@/features/wrapped/analysis/types";

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

export function DeveloperScoreCard({ score }: DeveloperScoreCardProps) {
  const entries = Object.entries(score.breakdown) as Array<
    [keyof DeveloperScoreResult["breakdown"], number]
  >;

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">開発者スコア</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        リポジトリ・スター・フォロワー・貢献度などから算出した総合評価
      </p>
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
              {value.toFixed(1)} / {SCORE_MAX_BY_KEY[key]}
            </dd>
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
