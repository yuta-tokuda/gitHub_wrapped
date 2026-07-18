import { Radar } from "lucide-react";
import type { SkillArea } from "@/features/wrapped/analysis/skill-profile";
import { CardHeader } from "@/features/wrapped/components/card-header";

type SkillProfileCardProps = {
  skills: SkillArea[];
};

export function SkillProfileCard({ skills }: SkillProfileCardProps) {
  return (
    <section className="glass-card border-l-4 border-l-teal-400/70 p-6">
      <CardHeader
        description="GitHubの公開データをもとに、業務での強みを4軸で可視化"
        icon={Radar}
        iconClassName="bg-teal-500/15 text-teal-300"
        title="スキルマップ（非エンジニア向け）"
      />
      <ul className="mt-5 space-y-4">
        {skills.map((skill) => (
          <li className="rounded-lg border p-4" key={skill.key}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{skill.label}</p>
              <p className="text-sm font-semibold">{skill.score} / 100</p>
            </div>
            <div
              aria-hidden
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${skill.score}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{skill.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
