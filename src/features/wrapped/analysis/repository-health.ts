import { DAYS } from "./constants";
import type { WrappedAnalysisInput } from "./types";

export type RepositoryHealthInsight = {
  healthScore: number;
  activeRepositoryRatio: number;
  staleRepositoryCount: number;
  archivedRepositoryCount: number;
  readmeCoverage: number;
  summary: string;
  actionItems: string[];
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MAX_SCORE = 100;

function clamp(value: number): number {
  return Math.max(0, Math.min(MAX_SCORE, Math.round(value)));
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function buildSummary(score: number): string {
  if (score >= 75) {
    return "更新・保守・文書化のバランスが良く、リポジトリ健全性は高い状態です。";
  }

  if (score >= 50) {
    return "健全性は中程度です。古いリポジトリの棚卸しとREADME更新で改善余地があります。";
  }

  return "健全性は改善余地が大きい状態です。更新停止資産の整理と保守ルール化が有効です。";
}

export function buildRepositoryHealthInsight(
  input: WrappedAnalysisInput,
): RepositoryHealthInsight {
  const now = Date.now();
  const repositories = input.repositories;
  const totalRepositories = repositories.length;
  const activeRepositoryCount = repositories.filter((repository) => {
    const updatedDays = (now - new Date(repository.updatedAt).getTime()) / MS_PER_DAY;
    return updatedDays <= DAYS.quarter;
  }).length;
  const staleRepositoryCount = repositories.filter((repository) => {
    const updatedDays = (now - new Date(repository.updatedAt).getTime()) / MS_PER_DAY;
    return updatedDays > DAYS.year;
  }).length;
  const archivedRepositoryCount = repositories.filter((repository) => repository.archived).length;
  const readmeRepositoryCount = repositories.filter((repository) => {
    const text = `${repository.name} ${repository.description ?? ""}`.toLowerCase();
    return text.includes("readme") || text.includes("docs") || text.includes("guide");
  }).length;

  const activeRepositoryRatio = ratio(activeRepositoryCount, totalRepositories);
  const readmeCoverage = ratio(readmeRepositoryCount, totalRepositories);
  const staleRepositoryRatio = ratio(staleRepositoryCount, totalRepositories);
  const archivedRepositoryRatio = ratio(archivedRepositoryCount, totalRepositories);
  const healthScore = clamp(
    activeRepositoryRatio * 45 +
      readmeCoverage * 30 +
      (1 - staleRepositoryRatio) * 15 +
      (1 - archivedRepositoryRatio) * 10,
  );

  return {
    healthScore,
    activeRepositoryRatio,
    staleRepositoryCount,
    archivedRepositoryCount,
    readmeCoverage,
    summary: buildSummary(healthScore),
    actionItems: [
      "90日以上更新がないリポジトリを優先的に棚卸しする",
      "READMEの更新ポリシーを決めて差分を小さく保つ",
      "アーカイブ判定基準を明文化し、保守対象を明確化する",
    ],
  };
}
