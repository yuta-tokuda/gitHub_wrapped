import { FolderSearch } from "lucide-react";

import type { RepositoryInsights } from "@/features/wrapped/analysis/repository-insights";
import { CardHeader } from "@/features/wrapped/components/card-header";

type RepositoryInsightsCardProps = {
  insight: RepositoryInsights;
};

export function RepositoryInsightsCard({ insight }: RepositoryInsightsCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-amber-400/70 p-6">
      <CardHeader
        description="主要リポジトリの公開シグナルを要約"
        icon={FolderSearch}
        iconClassName="bg-amber-500/15 text-amber-300"
        title="リポジトリインサイト"
      />
      <p className="mt-4 text-sm text-muted-foreground">{insight.summary}</p>
      <ul className="mt-4 grid gap-3 lg:grid-cols-3">
        {insight.highlights.map((item) => (
          <li className="rounded-lg border p-4" key={item.key}>
            <p className="text-sm font-semibold">{item.repositoryName}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {item.language} / ⭐ {item.stars} / Fork {item.forks}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
