import { Rocket } from "lucide-react";

import type { FuturePotentialInsight } from "@/features/wrapped/analysis/future-potential";
import { CardHeader } from "@/features/wrapped/components/card-header";

type FuturePotentialCardProps = {
  insight: FuturePotentialInsight;
};

export function FuturePotentialCard({ insight }: FuturePotentialCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-sky-400/70 p-6">
      <CardHeader
        description="現在の成果とDNA傾向から将来成長を推定"
        icon={Rocket}
        iconClassName="bg-sky-500/15 text-sky-300"
        title="将来ポテンシャル"
      />
      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm font-semibold">将来スコア: {insight.potentialScore} / 100</p>
        <p className="mt-1 text-sm font-medium text-sky-200">{insight.outlook}</p>
      </div>
      <article className="mt-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">成長ドライバー</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {insight.strengths.map((item) => (
            <li key={item}>・{item}</li>
          ))}
        </ul>
      </article>
      <article className="mt-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">次の課題</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {insight.nextChallenges.map((item) => (
            <li key={item}>・{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
