import { DAYS } from "./constants";
import type { WrappedAnalysisInput } from "./types";

export type RepositoryInsightItem = {
  key: string;
  repositoryName: string;
  summary: string;
  stars: number;
  forks: number;
  language: string;
};

export type RepositoryInsights = {
  highlights: RepositoryInsightItem[];
  summary: string;
};

const HIGHLIGHT_LIMIT = 3;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function buildRepositorySummary(
  stars: number,
  forks: number,
  updatedAt: string,
  isFork: boolean,
): string {
  const updatedDays = (Date.now() - new Date(updatedAt).getTime()) / MS_PER_DAY;
  const freshness =
    updatedDays <= DAYS.month
      ? "直近更新"
      : updatedDays <= DAYS.quarter
        ? "四半期内更新"
        : "更新間隔長め";

  if (stars >= 100 && forks >= 20) {
    return `高評価かつ拡散力がある主要資産（${freshness}）`;
  }
  if (isFork) {
    return `外部資産を取り込み改善する実験基盤（${freshness}）`;
  }
  return `継続的に育成されるオリジナル資産（${freshness}）`;
}

export function buildRepositoryInsights(input: WrappedAnalysisInput): RepositoryInsights {
  const highlights = input.repositories
    .slice()
    .sort((a, b) => b.stargazersCount - a.stargazersCount || b.forksCount - a.forksCount)
    .slice(0, HIGHLIGHT_LIMIT)
    .map((repository) => ({
      key: String(repository.id),
      repositoryName: repository.name,
      summary: buildRepositorySummary(
        repository.stargazersCount,
        repository.forksCount,
        repository.updatedAt,
        repository.fork,
      ),
      stars: repository.stargazersCount,
      forks: repository.forksCount,
      language: repository.language ?? "不明",
    }));

  const summary =
    highlights.length > 0
      ? "スター/フォーク/更新時期を組み合わせ、公開資産としての強みを抽出しました。"
      : "分析対象の公開リポジトリが不足しているため、ハイライトを生成できませんでした。";

  return {
    highlights,
    summary,
  };
}
