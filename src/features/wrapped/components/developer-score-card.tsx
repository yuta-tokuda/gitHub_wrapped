import type { DeveloperScoreResult } from "@/features/wrapped/analysis/types";

type DeveloperScoreCardProps = {
  score: DeveloperScoreResult;
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

export function DeveloperScoreCard({ score }: DeveloperScoreCardProps) {
  return (
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">Developer Score</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Repository・Stars・Followers・Contributionなどから算出した総合評価
      </p>
      <p className={`mt-6 text-6xl font-bold ${toScoreColor(score.totalScore)}`}>
        {score.totalScore}
        <span className="ml-2 text-base text-muted-foreground">/ 100</span>
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {Object.entries(score.breakdown).map(([key, value]) => (
          <div className="rounded-lg border px-4 py-3" key={key}>
            <dt className="text-xs text-muted-foreground">{key}</dt>
            <dd className="mt-1 text-lg font-semibold">{value.toFixed(1)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
