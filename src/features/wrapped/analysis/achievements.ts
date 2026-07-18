import { ACHIEVEMENTS_MAX } from "./constants";
import type { Achievement, WrappedAnalysisInput } from "./types";

type Rule = {
  key: string;
  title: string;
  description: string;
  isUnlocked: (input: WrappedAnalysisInput) => boolean;
};

const DAYS = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
} as const;

const THRESHOLDS = {
  repositoriesMedium: 20,
  repositoriesLarge: 40,
  starsMedium: 100,
  starsHigh: 500,
  starsHuge: 1000,
  forksMedium: 100,
  forksHigh: 300,
  followersMedium: 100,
  followersHigh: 500,
  contributionsMedium: 150,
  contributionsHigh: 260,
  pushEventsMedium: 50,
  pushEventsHigh: 90,
  issueEventsMedium: 20,
  issueEventsHigh: 40,
  pullRequestEventsMedium: 20,
  pullRequestEventsHigh: 45,
  languageWide: 5,
  languageVeryWide: 8,
  pinnedMedium: 3,
  pinnedHigh: 5,
} as const;

function hasLanguage(input: WrappedAnalysisInput, name: string): boolean {
  return input.metrics.languageStats.some(
    (language) => language.name.toLowerCase() === name.toLowerCase(),
  );
}

function hasAnyLanguage(input: WrappedAnalysisInput, names: string[]): boolean {
  return names.some((name) => hasLanguage(input, name));
}

function countRecentlyUpdatedRepositories(
  input: WrappedAnalysisInput,
  days: number,
): number {
  return input.repositories.filter((repository) => {
    const diffMs = Date.now() - new Date(repository.updatedAt).getTime();
    return diffMs <= 1000 * 60 * 60 * 24 * days;
  }).length;
}

function countNightRepositories(input: WrappedAnalysisInput): number {
  return input.repositories.filter((repository) => {
    const hour = new Date(repository.pushedAt).getHours();
    return hour >= 0 && hour <= 5;
  }).length;
}

function countWeekendRepositories(input: WrappedAnalysisInput): number {
  return input.repositories.filter((repository) => {
    const day = new Date(repository.pushedAt).getDay();
    return day === 0 || day === 6;
  }).length;
}

function countReadmeRepositories(input: WrappedAnalysisInput): number {
  return input.repositories.filter((repository) => {
    const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
    return (
      text.includes("readme") ||
      text.includes("docs") ||
      text.includes("guide") ||
      text.includes("wiki")
    );
  }).length;
}

function countRecentRepositories(input: WrappedAnalysisInput, days: number): number {
  return input.repositories.filter((repository) => {
    const diffMs = Date.now() - new Date(repository.createdAt).getTime();
    return diffMs <= 1000 * 60 * 60 * 24 * days;
  }).length;
}

function getUniqueTopicCount(input: WrappedAnalysisInput): number {
  return new Set(
    input.repositories.flatMap((repository) =>
      repository.topics.map((topic) => topic.toLowerCase()),
    ),
  ).size;
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
    isUnlocked: (input) => input.repositories.length >= THRESHOLDS.repositoriesMedium,
  },
  {
    key: "mega-builder",
    title: "メガビルダー",
    description: "公開リポジトリが40件以上。",
    isUnlocked: (input) => input.repositories.length >= THRESHOLDS.repositoriesLarge,
  },
  {
    key: "star-gazer",
    title: "スターゲイザー",
    description: "総スター数が100以上。",
    isUnlocked: (input) => input.metrics.totalStars >= THRESHOLDS.starsMedium,
  },
  {
    key: "star-magnet",
    title: "スターマグネット",
    description: "総スター数が500以上。",
    isUnlocked: (input) => input.metrics.totalStars >= THRESHOLDS.starsHigh,
  },
  {
    key: "constellation-owner",
    title: "スターコンステレーション",
    description: "総スター数が1000以上。",
    isUnlocked: (input) => input.metrics.totalStars >= THRESHOLDS.starsHuge,
  },
  {
    key: "fork-catalyst",
    title: "フォークカタリスト",
    description: "総Fork数が100以上。",
    isUnlocked: (input) => input.metrics.totalForks >= THRESHOLDS.forksMedium,
  },
  {
    key: "fork-network",
    title: "フォークネットワーク",
    description: "総Fork数が300以上。",
    isUnlocked: (input) => input.metrics.totalForks >= THRESHOLDS.forksHigh,
  },
  {
    key: "crowd-followed",
    title: "フォロワー急上昇",
    description: "フォロワー100人以上。",
    isUnlocked: (input) => input.user.followers >= THRESHOLDS.followersMedium,
  },
  {
    key: "influencer",
    title: "開発インフルエンサー",
    description: "フォロワー500人以上。",
    isUnlocked: (input) => input.user.followers >= THRESHOLDS.followersHigh,
  },
  {
    key: "consistent-pusher",
    title: "継続プッシャー",
    description: "プッシュイベントが50件以上。",
    isUnlocked: (input) => input.contributions.pushEvents >= THRESHOLDS.pushEventsMedium,
  },
  {
    key: "ship-it",
    title: "出荷職人",
    description: "プッシュイベントが90件以上。",
    isUnlocked: (input) => input.contributions.pushEvents >= THRESHOLDS.pushEventsHigh,
  },
  {
    key: "issue-fixer",
    title: "課題解決者",
    description: "Issueイベントが20件以上。",
    isUnlocked: (input) => input.contributions.issuesEvents >= THRESHOLDS.issueEventsMedium,
  },
  {
    key: "bug-hunter",
    title: "バグハンター",
    description: "Issueイベントが40件以上。",
    isUnlocked: (input) => input.contributions.issuesEvents >= THRESHOLDS.issueEventsHigh,
  },
  {
    key: "pr-warrior",
    title: "PRウォーリアー",
    description: "プルリクエストイベントが20件以上。",
    isUnlocked: (input) =>
      input.contributions.pullRequestEvents >= THRESHOLDS.pullRequestEventsMedium,
  },
  {
    key: "review-captain",
    title: "レビューキャプテン",
    description: "プルリクエストイベントが45件以上。",
    isUnlocked: (input) =>
      input.contributions.pullRequestEvents >= THRESHOLDS.pullRequestEventsHigh,
  },
  {
    key: "active-dev",
    title: "常時デリバリー",
    description: "コントリビューション指標が150以上。",
    isUnlocked: (input) =>
      input.contributions.totalContributions >= THRESHOLDS.contributionsMedium,
  },
  {
    key: "consistency-master",
    title: "継続性マスター",
    description: "コントリビューション指標が260以上。",
    isUnlocked: (input) =>
      input.contributions.totalContributions >= THRESHOLDS.contributionsHigh,
  },
  {
    key: "polyglot",
    title: "多言語エンジニア",
    description: "使用言語が5種類以上。",
    isUnlocked: (input) => input.metrics.languageStats.length >= THRESHOLDS.languageWide,
  },
  {
    key: "language-diver",
    title: "言語ダイバー",
    description: "使用言語が8種類以上。",
    isUnlocked: (input) =>
      input.metrics.languageStats.length >= THRESHOLDS.languageVeryWide,
  },
  {
    key: "frontend-soul",
    title: "フロントエンド魂",
    description: "TypeScriptまたはJavaScriptを利用。",
    isUnlocked: (input) => hasAnyLanguage(input, ["TypeScript", "JavaScript"]),
  },
  {
    key: "backend-core",
    title: "バックエンド中核",
    description: "GoまたはRustを利用。",
    isUnlocked: (input) => hasAnyLanguage(input, ["Go", "Rust"]),
  },
  {
    key: "data-curious",
    title: "データ探究者",
    description: "PythonまたはRを利用。",
    isUnlocked: (input) => hasAnyLanguage(input, ["Python", "R"]),
  },
  {
    key: "mobile-crafter",
    title: "モバイルクラフター",
    description: "KotlinまたはSwiftを利用。",
    isUnlocked: (input) => hasAnyLanguage(input, ["Kotlin", "Swift"]),
  },
  {
    key: "doc-hero",
    title: "ドキュメントヒーロー",
    description: "READMEやドキュメント関連の説明を含むリポジトリが3件以上。",
    isUnlocked: (input) => countReadmeRepositories(input) >= 3,
  },
  {
    key: "readme-lover",
    title: "READMEラバー",
    description: "READMEやドキュメント関連の説明を含むリポジトリが6件以上。",
    isUnlocked: (input) => countReadmeRepositories(input) >= 6,
  },
  {
    key: "maintainer",
    title: "メンテナンス名人",
    description: "直近30日以内に更新されたリポジトリが10件以上。",
    isUnlocked: (input) => countRecentlyUpdatedRepositories(input, DAYS.month) >= 10,
  },
  {
    key: "sprint-runner",
    title: "スプリントランナー",
    description: "直近7日以内に更新されたリポジトリが3件以上。",
    isUnlocked: (input) => countRecentlyUpdatedRepositories(input, DAYS.week) >= 3,
  },
  {
    key: "long-cycle-maintainer",
    title: "長期メンテナー",
    description: "直近90日以内に更新されたリポジトリが15件以上。",
    isUnlocked: (input) => countRecentlyUpdatedRepositories(input, DAYS.quarter) >= 15,
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
    description: "ピン留めリポジトリを3件以上設定。",
    isUnlocked: (input) => input.pinnedRepositories.length >= THRESHOLDS.pinnedMedium,
  },
  {
    key: "showcase-master",
    title: "ショーケースマスター",
    description: "ピン留めリポジトリを5件以上設定。",
    isUnlocked: (input) => input.pinnedRepositories.length >= THRESHOLDS.pinnedHigh,
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
    key: "veteran",
    title: "ベテラン",
    description: "GitHub利用歴が6年以上。",
    isUnlocked: (input) => {
      const accountAgeMs = Date.now() - new Date(input.user.createdAt).getTime();
      const years = accountAgeMs / (1000 * 60 * 60 * 24 * DAYS.year);
      return years >= 6;
    },
  },
  {
    key: "night-owl",
    title: "夜型コーダー",
    description: "更新時刻が深夜帯(0-5時)のリポジトリが2件以上。",
    isUnlocked: (input) => countNightRepositories(input) >= 2,
  },
  {
    key: "weekend-warrior",
    title: "週末ウォーリアー",
    description: "週末更新が2件以上。",
    isUnlocked: (input) => countWeekendRepositories(input) >= 2,
  },
  {
    key: "fast-starter",
    title: "ファストスターター",
    description: "直近90日で新規リポジトリを3件以上作成。",
    isUnlocked: (input) => countRecentRepositories(input, DAYS.quarter) >= 3,
  },
  {
    key: "curious-mind",
    title: "好奇心の探究者",
    description: "トピックタグが8種類以上。",
    isUnlocked: (input) => getUniqueTopicCount(input) >= 8,
  },
  {
    key: "domain-explorer",
    title: "ドメインエクスプローラー",
    description: "トピックタグが15種類以上。",
    isUnlocked: (input) => getUniqueTopicCount(input) >= 15,
  },
  {
    key: "builder",
    title: "ビルダー",
    description: "公開リポジトリが12件以上かつ直近90日更新が8件以上。",
    isUnlocked: (input) =>
      input.repositories.length >= 12 &&
      countRecentlyUpdatedRepositories(input, DAYS.quarter) >= 8,
  },
  {
    key: "debugger",
    title: "デバッガー",
    description: "IssueとPRの合計イベントが45件以上。",
    isUnlocked: (input) =>
      input.contributions.issuesEvents + input.contributions.pullRequestEvents >= 45,
  },
  {
    key: "teacher",
    title: "ティーチャー",
    description: "README系リポジトリ3件以上かつIssueイベント20件以上。",
    isUnlocked: (input) =>
      countReadmeRepositories(input) >= 3 &&
      input.contributions.issuesEvents >= THRESHOLDS.issueEventsMedium,
  },
  {
    key: "specialist",
    title: "スペシャリスト",
    description: "トップ言語比率が70%以上。",
    isUnlocked: (input) => (input.metrics.languageStats[0]?.ratio ?? 0) >= 70,
  },
  {
    key: "generalist",
    title: "ジェネラリスト",
    description: "使用言語5種以上かつトップ言語比率が45%未満。",
    isUnlocked: (input) =>
      input.metrics.languageStats.length >= THRESHOLDS.languageWide &&
      (input.metrics.languageStats[0]?.ratio ?? 100) < 45,
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
