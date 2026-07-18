import type { DeveloperScoreResult } from "./types";
import type { DeveloperDnaProfile } from "./types";
import type { GrowthCurveInsight } from "./growth-curve";

export type FuturePotentialInsight = {
  potentialScore: number;
  outlook: string;
  strengths: string[];
  nextChallenges: string[];
};

const MAX_SCORE = 100;

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_SCORE, Math.round(value)));
}

function getOutlook(score: number): string {
  if (score >= 80) {
    return "高い成長ポテンシャル";
  }
  if (score >= 60) {
    return "着実な成長ポテンシャル";
  }
  return "伸びしろ主導のポテンシャル";
}

export function buildFuturePotentialInsight(
  dnaProfile: DeveloperDnaProfile,
  score: DeveloperScoreResult,
  growthCurve: GrowthCurveInsight,
): FuturePotentialInsight {
  const topDnaAverage =
    dnaProfile.dna.slice(0, 3).reduce((acc, item) => acc + item.score, 0) / 3;
  const potentialScore = clamp(
    score.totalScore * 0.35 + growthCurve.growthScore * 0.35 + topDnaAverage * 0.3,
  );

  return {
    potentialScore,
    outlook: getOutlook(potentialScore),
    strengths: [
      `上位DNA平均: ${Math.round(topDnaAverage)}`,
      `成長モメンタム: ${growthCurve.momentumLabel}`,
      `現在の総合スコア: ${score.totalScore}`,
    ],
    nextChallenges: [
      "高スコアDNAを実務成果へ接続する具体テーマを固定する",
      "公開リポジトリで設計背景と学びを言語化して再現性を上げる",
      "3か月単位で更新目標を置き、成長曲線の傾きを維持する",
    ],
  };
}
