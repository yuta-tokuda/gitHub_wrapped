import { Sparkles } from "lucide-react";

import type { MvpDiagnostic } from "@/features/wrapped/analysis/types";
import { CardHeader } from "@/features/wrapped/components/card-header";

type MvpDiagnosticsCardProps = {
  diagnostics: MvpDiagnostic[];
};

export function MvpDiagnosticsCard({ diagnostics }: MvpDiagnosticsCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-fuchsia-400/70 p-6">
      <CardHeader
        description="あなたの開発スタイルを20の切り口で見える化"
        icon={Sparkles}
        iconClassName="bg-fuchsia-500/15 text-fuchsia-300"
        title="開発スタイル診断 20"
      />
      <ul className="mt-5 grid gap-3 lg:grid-cols-2">
        {diagnostics.map((item) => (
          <li
            className="rounded-lg border border-fuchsia-300/20 bg-fuchsia-500/[0.03] p-4"
            key={item.key}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="rounded-full bg-fuchsia-500/15 px-2.5 py-1 text-xs font-semibold text-fuchsia-100">
                {item.score} / 100
              </p>
            </div>
            <p className="mt-2 text-sm font-medium text-fuchsia-100">判定: {item.diagnosis}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.analysisResult}
            </p>
            <div className="mt-2 rounded-md border border-fuchsia-300/20 bg-fuchsia-500/8 px-2.5 py-2">
              <p className="text-xs font-semibold text-fuchsia-100">分析結果</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.valueLabel}</p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                {item.evidence.map((evidenceItem) => (
                  <li key={evidenceItem}>・{evidenceItem}</li>
                ))}
              </ul>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">算出式: {item.formula}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
