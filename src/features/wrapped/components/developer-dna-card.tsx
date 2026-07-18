import { Dna } from "lucide-react";

import type { DeveloperDnaProfile } from "@/features/wrapped/analysis/types";
import { CardHeader } from "@/features/wrapped/components/card-header";

type DeveloperDnaCardProps = {
  profile: DeveloperDnaProfile;
};

export function DeveloperDnaCard({ profile }: DeveloperDnaCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-emerald-400/70 p-6">
      <CardHeader
        description="10種類の開発DNAを0〜100で算出"
        icon={Dna}
        iconClassName="bg-emerald-500/15 text-emerald-300"
        title="開発者DNA"
      />
      <p className="mt-4 text-sm text-muted-foreground">
        最も強いDNA:{" "}
        <span className="font-semibold text-foreground">{profile.dominantDna.label}</span>
      </p>
      <ul className="mt-4 grid gap-3 lg:grid-cols-2">
        {profile.dna.map((item) => (
          <li className="rounded-lg border p-4" key={item.key}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-sm font-semibold">{item.score} / 100</p>
            </div>
            <div aria-hidden className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">式: {item.formula}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.reason}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
