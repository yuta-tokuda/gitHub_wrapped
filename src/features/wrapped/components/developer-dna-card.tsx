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
        {profile.dna.map((item, index) => (
          <li
            className="rounded-lg border border-emerald-300/20 bg-emerald-500/[0.04] p-4"
            key={item.key}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {index < 3 ? (
                  <span className="rounded-full border border-emerald-300/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-100">
                    TOP {index + 1}
                  </span>
                ) : null}
                <p className="text-sm font-semibold">{item.label}</p>
              </div>
              <p className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-sm font-semibold text-emerald-100">
                {item.score} / 100
              </p>
            </div>
            <div
              aria-hidden
              className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-emerald-900/30"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <p className="mt-2 rounded-md border border-emerald-300/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-100">
              算出式: {item.formula}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground/90">理由:</span> {item.reason}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground/90">説明:</span> {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
