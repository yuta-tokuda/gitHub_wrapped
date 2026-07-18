import type { WrappedAnalysisInput } from "./types";

export type SkillArea = {
  key: string;
  label: string;
  score: number;
  reason: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function includesAnyLanguage(
  input: WrappedAnalysisInput,
  targets: string[],
): boolean {
  const set = new Set(input.metrics.languageStats.map((item) => item.name.toLowerCase()));
  return targets.some((target) => set.has(target.toLowerCase()));
}

function createWebArea(input: WrappedAnalysisInput): SkillArea {
  const hasWebStack = includesAnyLanguage(input, ["TypeScript", "JavaScript", "HTML", "CSS"]);
  const score = clampScore(
    input.metrics.languageStats.length * 12 +
      (hasWebStack ? 40 : 10) +
      Math.min(30, input.metrics.totalStars / 8),
  );

  return {
    key: "web",
    label: "Web開発力",
    score,
    reason: "主要言語と公開成果物の評価から、Web開発の実践力を推定",
  };
}

function createBackendArea(input: WrappedAnalysisInput): SkillArea {
  const hasBackendStack = includesAnyLanguage(input, ["Go", "Rust", "Java", "Kotlin", "Python"]);
  const score = clampScore(
    (hasBackendStack ? 55 : 25) +
      Math.min(25, input.metrics.totalForks / 2) +
      Math.min(20, input.repositories.length),
  );

  return {
    key: "backend",
    label: "バックエンド適性",
    score,
    reason: "言語傾向・リポジトリ規模・Fork状況からサーバー領域への適性を推定",
  };
}

function createCollaborationArea(input: WrappedAnalysisInput): SkillArea {
  const score = clampScore(
    Math.min(40, input.user.followers / 8) +
      Math.min(30, input.contributions.pullRequestEvents * 1.2) +
      Math.min(30, input.contributions.issuesEvents * 1.5),
  );

  return {
    key: "collaboration",
    label: "協働・レビュー力",
    score,
    reason: "フォロワー、PR、Issue活動からチーム開発での協働度を推定",
  };
}

function createOwnershipArea(input: WrappedAnalysisInput): SkillArea {
  const activeRepositoryCount = input.repositories.filter((repository) => {
    const diffMs = Date.now() - new Date(repository.updatedAt).getTime();
    return diffMs <= 1000 * 60 * 60 * 24 * 30;
  }).length;

  const score = clampScore(
    Math.min(45, input.contributions.totalContributions / 4) +
      Math.min(35, activeRepositoryCount * 3) +
      Math.min(20, input.metrics.totalStars / 20),
  );

  return {
    key: "ownership",
    label: "継続的な推進力",
    score,
    reason: "直近の更新頻度と活動量から、継続して成果を出す力を推定",
  };
}

export function buildSkillProfile(input: WrappedAnalysisInput): SkillArea[] {
  return [
    createWebArea(input),
    createBackendArea(input),
    createCollaborationArea(input),
    createOwnershipArea(input),
  ];
}
