import type { WrappedAnalysisInput } from "./types";

export type LanguageDiversityInsight = {
  diversityScore: number;
  uniqueLanguages: number;
  topLanguageShare: number;
  balanceLabel: string;
  summary: string;
  strengths: string[];
};

const MAX_SCORE = 100;
const TOP_LANGUAGE_HEAVY_THRESHOLD = 65;

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_SCORE, Math.round(value)));
}

function getBalanceLabel(topLanguageShare: number): string {
  if (topLanguageShare >= TOP_LANGUAGE_HEAVY_THRESHOLD) {
    return "集中型";
  }

  if (topLanguageShare >= 40) {
    return "バランス型";
  }

  return "分散型";
}

function buildSummary(uniqueLanguages: number, topLanguageShare: number): string {
  if (uniqueLanguages >= 6 && topLanguageShare < 45) {
    return "複数言語をバランス良く使っており、技術選択の柔軟性が高いです。";
  }

  if (topLanguageShare >= TOP_LANGUAGE_HEAVY_THRESHOLD) {
    return "主要言語への集中が強く、特定領域の深掘りに向いた構成です。";
  }

  return "主要言語を軸にしつつ、周辺技術へも適度に展開している構成です。";
}

export function buildLanguageDiversityInsight(
  input: WrappedAnalysisInput,
): LanguageDiversityInsight {
  const uniqueLanguages = input.metrics.languageStats.length;
  const topLanguageShare = input.metrics.languageStats[0]?.ratio ?? 0;
  const diversitySignal = Math.min(1, uniqueLanguages / 8);
  const distributionSignal = 1 - Math.min(1, topLanguageShare / 100);
  const diversityScore = clamp(diversitySignal * 60 + distributionSignal * 40);

  return {
    diversityScore,
    uniqueLanguages,
    topLanguageShare,
    balanceLabel: getBalanceLabel(topLanguageShare),
    summary: buildSummary(uniqueLanguages, topLanguageShare),
    strengths: [
      `使用言語数: ${uniqueLanguages}`,
      `主要言語比率: ${topLanguageShare.toFixed(1)}%`,
      `構成バランス: ${getBalanceLabel(topLanguageShare)}`,
    ],
  };
}
