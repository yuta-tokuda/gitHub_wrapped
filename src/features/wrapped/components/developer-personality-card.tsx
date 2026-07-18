import { Sparkles } from "lucide-react";

import type { DeveloperPersonality } from "@/features/wrapped/analysis/types";
import { CardHeader } from "@/features/wrapped/components/card-header";

type DeveloperPersonalityCardProps = {
  personality: DeveloperPersonality;
};

const DNA_LABELS: Record<string, string> = {
  builder: "ビルダー",
  explorer: "エクスプローラー",
  maintainer: "メンテナー",
  collaborator: "コラボレーター",
  experimenter: "実験者",
  teacher: "ティーチャー",
  creator: "クリエイター",
  specialist: "スペシャリスト",
  generalist: "ジェネラリスト",
  debugger: "デバッガー",
};

export function DeveloperPersonalityCard({
  personality,
}: DeveloperPersonalityCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-violet-400/70 p-6">
      <CardHeader
        description="複数DNAの組み合わせで肩書きを推定"
        icon={Sparkles}
        iconClassName="bg-violet-500/15 text-violet-300"
        title="開発者パーソナリティ"
      />
      <p className="mt-5 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-sm font-semibold text-violet-100">
        {personality.title}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">{personality.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">判定理由: {personality.reason}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        参照DNA: {personality.matchedDna.map((key) => DNA_LABELS[key] ?? key).join(" / ")}
      </p>
    </section>
  );
}
