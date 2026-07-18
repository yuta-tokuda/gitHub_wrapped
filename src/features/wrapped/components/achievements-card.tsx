import { EmptyState } from "@/components/common/empty-state";
import type { Achievement } from "@/features/wrapped/analysis/types";

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
    <section className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold">実績バッジ</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        開発傾向に応じて獲得したバッジ
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <li className="rounded-lg border px-4 py-3" key={achievement.key}>
            <p className="text-sm font-semibold">{achievement.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {achievement.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
