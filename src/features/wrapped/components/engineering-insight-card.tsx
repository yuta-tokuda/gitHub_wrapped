import { Lightbulb } from "lucide-react";
import type { EngineeringInsight } from "@/features/wrapped/analysis/engineering-insight";
import { CardHeader } from "@/features/wrapped/components/card-header";

type EngineeringInsightCardProps = {
  insight: EngineeringInsight;
};

export function EngineeringInsightCard({ insight }: EngineeringInsightCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-indigo-400/70 p-6">
      <CardHeader
        icon={Lightbulb}
        iconClassName="bg-indigo-500/15 text-indigo-300"
        title="エンジニア人物像レポート"
      />
      <p className="mt-2 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
        {insight.profileSummary}
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">開発スタイル</h3>
          <p className="mt-2 text-sm text-muted-foreground">{insight.workStyle}</p>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">チームでの動き方</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {insight.collaborationStyle}
          </p>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">成長シグナル</h3>
          <p className="mt-2 text-sm text-muted-foreground">{insight.growthSignal}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">相性のよい業務</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {insight.suggestedAssignments.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">面談で確認したい質問</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {insight.interviewQuestions.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
