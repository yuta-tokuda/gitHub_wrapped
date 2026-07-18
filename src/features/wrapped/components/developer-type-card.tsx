import { Fingerprint } from "lucide-react";
import type { DeveloperType } from "@/features/wrapped/analysis/types";
import { CardHeader } from "@/features/wrapped/components/card-header";

type DeveloperTypeCardProps = {
  developerType: DeveloperType;
};

export function DeveloperTypeCard({ developerType }: DeveloperTypeCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-fuchsia-400/70 p-6">
      <CardHeader
        icon={Fingerprint}
        iconClassName="bg-fuchsia-500/15 text-fuchsia-300"
        title="開発者タイプ"
      />
      <p className="mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        {developerType.label}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{developerType.description}</p>
    </section>
  );
}
