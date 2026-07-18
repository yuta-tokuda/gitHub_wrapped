import { ACHIEVEMENTS_MAX } from "./constants";
import type { Achievement, WrappedAnalysisInput } from "./types";

type Rule = {
  key: string;
  title: string;
  description: string;
  isUnlocked: (input: WrappedAnalysisInput) => boolean;
};

function hasLanguage(input: WrappedAnalysisInput, name: string): boolean {
  return input.metrics.languageStats.some(
    (language) => language.name.toLowerCase() === name.toLowerCase(),
  );
}

const ACHIEVEMENT_RULES: Rule[] = [
  {
    key: "first-repo",
    title: "はじめの一歩",
    description: "公開リポジトリを1つ以上保有。",
    isUnlocked: (input) => input.repositories.length >= 1,
  },
  {
    key: "repo-collector",
    title: "リポジトリコレクター",
    description: "公開リポジトリが20件以上。",
    isUnlocked: (input) => input.repositories.length >= 20,
  },
  {
    key: "star-gazer",
    title: "スターゲイザー",
    description: "総スター数が100以上。",
    isUnlocked: (input) => input.metrics.totalStars >= 100,
  },
  {
    key: "star-magnet",
    title: "スターマグネット",
    description: "総スター数が500以上。",
    isUnlocked: (input) => input.metrics.totalStars >= 500,
  },
  {
    key: "fork-catalyst",
    title: "フォークカタリスト",
    description: "総Fork数が100以上。",
    isUnlocked: (input) => input.metrics.totalForks >= 100,
  },
  {
    key: "crowd-followed",
    title: "フォロワー急上昇",
    description: "フォロワー100人以上。",
    isUnlocked: (input) => input.user.followers >= 100,
  },
  {
    key: "influencer",
    title: "開発インフルエンサー",
    description: "フォロワー500人以上。",
    isUnlocked: (input) => input.user.followers >= 500,
  },
  {
    key: "consistent-pusher",
    title: "継続プッシャー",
    description: "Push Eventが50件以上。",
    isUnlocked: (input) => input.contributions.pushEvents >= 50,
  },
  {
    key: "issue-fixer",
    title: "課題解決者",
    description: "Issues Eventが20件以上。",
    isUnlocked: (input) => input.contributions.issuesEvents >= 20,
  },
  {
    key: "pr-warrior",
    title: "PRウォーリアー",
    description: "Pull Request Eventが20件以上。",
    isUnlocked: (input) => input.contributions.pullRequestEvents >= 20,
  },
  {
    key: "active-dev",
    title: "常時デリバリー",
    description: "Contribution Unitsが150以上。",
    isUnlocked: (input) => input.contributions.totalContributions >= 150,
  },
  {
    key: "polyglot",
    title: "多言語エンジニア",
    description: "使用言語が5種類以上。",
    isUnlocked: (input) => input.metrics.languageStats.length >= 5,
  },
  {
    key: "frontend-soul",
    title: "フロントエンド魂",
    description: "TypeScriptまたはJavaScriptを利用。",
    isUnlocked: (input) =>
      hasLanguage(input, "TypeScript") || hasLanguage(input, "JavaScript"),
  },
  {
    key: "backend-core",
    title: "バックエンド中核",
    description: "GoまたはRustを利用。",
    isUnlocked: (input) => hasLanguage(input, "Go") || hasLanguage(input, "Rust"),
  },
  {
    key: "doc-hero",
    title: "ドキュメントヒーロー",
    description: "READMEやDocs関連の説明を含むリポジトリが3件以上。",
    isUnlocked: (input) =>
      input.repositories.filter((repository) => {
        const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
        return text.includes("readme") || text.includes("docs");
      }).length >= 3,
  },
  {
    key: "maintainer",
    title: "メンテナンス名人",
    description: "直近30日以内に更新されたリポジトリが10件以上。",
    isUnlocked: (input) =>
      input.repositories.filter((repository) => {
        const diffMs = Date.now() - new Date(repository.updatedAt).getTime();
        return diffMs <= 1000 * 60 * 60 * 24 * 30;
      }).length >= 10,
  },
  {
    key: "popular-repo",
    title: "人気プロジェクト",
    description: "単一リポジトリのスターが100以上。",
    isUnlocked: (input) =>
      input.repositories.some((repository) => repository.stargazersCount >= 100),
  },
  {
    key: "pinned-curator",
    title: "ピン留めキュレーター",
    description: "Pinned Repositoryを3件以上設定。",
    isUnlocked: (input) => input.pinnedRepositories.length >= 3,
  },
  {
    key: "long-runner",
    title: "ロングランナー",
    description: "GitHub利用歴が3年以上。",
    isUnlocked: (input) => {
      const accountAgeMs = Date.now() - new Date(input.user.createdAt).getTime();
      const years = accountAgeMs / (1000 * 60 * 60 * 24 * 365);
      return years >= 3;
    },
  },
  {
    key: "night-owl",
    title: "夜型コーダー",
    description: "更新時刻が深夜帯(0-5時)のリポジトリが2件以上。",
    isUnlocked: (input) =>
      input.repositories.filter((repository) => {
        const hour = new Date(repository.pushedAt).getHours();
        return hour >= 0 && hour <= 5;
      }).length >= 2,
  },
];

export function collectAchievements(input: WrappedAnalysisInput): Achievement[] {
  return ACHIEVEMENT_RULES.filter((rule) => rule.isUnlocked(input))
    .slice(0, ACHIEVEMENTS_MAX)
    .map((rule) => ({
      key: rule.key,
      title: rule.title,
      description: rule.description,
    }));
}
