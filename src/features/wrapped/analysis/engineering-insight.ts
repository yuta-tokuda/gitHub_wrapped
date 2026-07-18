import type { DeveloperScoreResult, WrappedAnalysisInput } from "./types";

export type EngineeringInsight = {
  profileSummary: string;
  workStyle: string;
  collaborationStyle: string;
  growthSignal: string;
  suggestedAssignments: string[];
  interviewQuestions: string[];
};

function getRepositoryDensity(input: WrappedAnalysisInput): "high" | "medium" | "low" {
  if (input.repositories.length >= 20) {
    return "high";
  }

  if (input.repositories.length >= 8) {
    return "medium";
  }

  return "low";
}

function buildProfileSummary(
  input: WrappedAnalysisInput,
  score: DeveloperScoreResult,
): string {
  if (score.totalScore >= 80) {
    return "公開実績と継続活動の両面で強く、即戦力として期待できるタイプです。";
  }

  if (score.totalScore >= 60) {
    return "得意領域が明確で、役割を合わせると高い成果を出しやすいタイプです。";
  }

  if (input.contributions.totalContributions >= 80) {
    return "活動量が高く、経験の積み上げによる伸びが見込めるタイプです。";
  }

  return "基礎を拡張中で、育成と実践機会の提供で成長が期待できるタイプです。";
}

function buildWorkStyle(input: WrappedAnalysisInput): string {
  const density = getRepositoryDensity(input);

  if (density === "high") {
    return "複数のリポジトリを並行して扱える、マルチタスク型の開発スタイルです。";
  }

  if (density === "medium") {
    return "一定数のプロジェクトを継続的に改善する、バランス型の開発スタイルです。";
  }

  return "少数のプロジェクトに集中して品質を高める、深掘り型のスタイルです。";
}

function buildCollaborationStyle(input: WrappedAnalysisInput): string {
  const interactionScore =
    input.contributions.pullRequestEvents + input.contributions.issuesEvents;

  if (interactionScore >= 40) {
    return "レビュー・議論への参加が多く、チーム連携を牽引しやすい傾向です。";
  }

  if (interactionScore >= 15) {
    return "必要な場面でコミュニケーションしながら開発を進める協調型です。";
  }

  return "実装中心で成果を出す傾向があり、設計意図の言語化を確認すると安心です。";
}

function buildGrowthSignal(
  input: WrappedAnalysisInput,
  score: DeveloperScoreResult,
): string {
  if (score.breakdown.recentActivity >= 7) {
    return "直近の更新頻度が高く、短期的にもアウトプット増加が期待できます。";
  }

  if (input.metrics.languageStats.length >= 4) {
    return "技術の守備範囲が広く、新しい領域へのキャッチアップが速い傾向です。";
  }

  return "主要領域の実務深度を上げるフェーズで、継続改善により伸びる見込みがあります。";
}

function buildSuggestedAssignments(input: WrappedAnalysisInput): string[] {
  const roles: string[] = [];

  if (input.metrics.languageStats.some((item) => item.name === "TypeScript")) {
    roles.push("Webフロントエンド機能開発");
  }
  if (input.metrics.totalForks >= 20) {
    roles.push("既存プロダクト改善・保守運用");
  }
  if (input.contributions.totalContributions >= 100) {
    roles.push("短いサイクルでの機能追加プロジェクト");
  }

  if (roles.length === 0) {
    roles.push("小規模機能の改善タスク");
  }

  return roles.slice(0, 3);
}

function buildInterviewQuestions(input: WrappedAnalysisInput): string[] {
  const questions = [
    "最近最も改善効果が大きかった実装は何ですか？背景と結果を教えてください。",
    "チーム開発で意見が分かれたとき、どのように合意形成していますか？",
    "今後1年で伸ばしたい技術領域と、そのための具体的な行動計画はありますか？",
  ];

  if (input.metrics.languageStats.length <= 2) {
    questions[2] = "現在の得意領域を活かしつつ、次に広げたい技術領域は何ですか？";
  }

  return questions;
}

export function buildEngineeringInsight(
  input: WrappedAnalysisInput,
  score: DeveloperScoreResult,
): EngineeringInsight {
  return {
    profileSummary: buildProfileSummary(input, score),
    workStyle: buildWorkStyle(input),
    collaborationStyle: buildCollaborationStyle(input),
    growthSignal: buildGrowthSignal(input, score),
    suggestedAssignments: buildSuggestedAssignments(input),
    interviewQuestions: buildInterviewQuestions(input),
  };
}
