import { DAYS } from "./constants";
import type { WrappedAnalysisInput } from "./types";

export type GrowthCurveInsight = {
  growthScore: number;
  momentumLabel: string;
  recentRepositoryCount: number;
  matureRepositoryCount: number;
  recentContributionShare: number;
  summary: string;
};

const MAX_SCORE = 100;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_SCORE, Math.round(value)));
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function getMomentumLabel(score: number): string {
  if (score >= 75) {
    return "加速フェーズ";
  }
  if (score >= 50) {
    return "安定成長フェーズ";
  }
  return "基盤形成フェーズ";
}

function buildSummary(score: number): string {
  if (score >= 75) {
    return "新規開発と更新活動の両方が強く、直近の成長速度は高いです。";
  }
  if (score >= 50) {
    return "既存資産の改善を維持しつつ、段階的に成長している状態です。";
  }
  return "成長余地は大きく、短期アウトプットの増加で曲線を上向きにできます。";
}

export function buildGrowthCurveInsight(input: WrappedAnalysisInput): GrowthCurveInsight {
  const now = Date.now();
  const repositories = input.repositories;
  const recentRepositoryCount = repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    return ageDays <= DAYS.year;
  }).length;
  const matureRepositoryCount = repositories.filter((repository) => {
    const ageDays = (now - new Date(repository.createdAt).getTime()) / MS_PER_DAY;
    return ageDays > DAYS.year;
  }).length;
  const recentActiveCount = repositories.filter((repository) => {
    const updatedDays = (now - new Date(repository.updatedAt).getTime()) / MS_PER_DAY;
    return updatedDays <= DAYS.quarter;
  }).length;
  const recentContributionShare = ratio(recentActiveCount, Math.max(repositories.length, 1));
  const growthScore = clamp(
    Math.min(1, recentContributionShare / 0.65) * 45 +
      Math.min(1, ratio(recentRepositoryCount, Math.max(repositories.length, 1)) / 0.5) * 30 +
      Math.min(1, input.contributions.totalContributions / 180) * 25,
  );

  return {
    growthScore,
    momentumLabel: getMomentumLabel(growthScore),
    recentRepositoryCount,
    matureRepositoryCount,
    recentContributionShare,
    summary: buildSummary(growthScore),
  };
}
