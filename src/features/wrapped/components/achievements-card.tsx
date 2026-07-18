import { Trophy } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import type { Achievement } from "@/features/wrapped/analysis/types";
import { CardHeader } from "@/features/wrapped/components/card-header";

type AchievementsCardProps = {
  achievements: Achievement[];
};

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  if (achievements.length === 0) {
    return (
      <EmptyState
        description="条件を満たすと実績バッジが表示されます。"
        title="Achievementはまだありません"
      />
    );
  }

  return (
    <section className="glass-card border-l-4 border-l-pink-400/70 p-6">
      <CardHeader
        description="開発傾向に応じて獲得したバッジ"
        icon={Trophy}
        iconClassName="bg-pink-500/15 text-pink-300"
        title="実績バッジ"
      />
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <li
            className="rounded-lg border border-pink-300/25 bg-pink-500/[0.04] px-4 py-3"
            key={achievement.key}
          >
            <p className="inline-flex rounded-full bg-pink-500/15 px-2.5 py-1 text-sm font-semibold text-pink-100">
              {achievement.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {achievement.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
