import type { DeveloperType } from "@/features/wrapped/analysis/types";

type DeveloperTypeCardProps = {
  developerType: DeveloperType;
};

export function DeveloperTypeCard({ developerType }: DeveloperTypeCardProps) {
  return (
    <section className="glass-card p-6">
      <h2 className="text-xl font-semibold">開発者タイプ</h2>
      <p className="mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        {developerType.label}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{developerType.description}</p>
    </section>
  );
}
