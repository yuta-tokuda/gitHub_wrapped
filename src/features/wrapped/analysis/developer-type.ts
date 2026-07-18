import type { WrappedAnalysisInput } from "./types";
import type { DeveloperType } from "./types";

function includesLanguage(
  languages: WrappedAnalysisInput["metrics"]["languageStats"],
  targets: string[],
): boolean {
  const set = new Set(languages.map((language) => language.name.toLowerCase()));
  return targets.some((target) => set.has(target.toLowerCase()));
}

function getTypeByLanguage(input: WrappedAnalysisInput): DeveloperType | null {
  const { languageStats } = input.metrics;

  if (includesLanguage(languageStats, ["TypeScript", "JavaScript", "CSS", "HTML"])) {
    return {
      key: "frontend-engineer",
      label: "フロントエンドエンジニア",
      description: "UI技術を主軸に、体験価値を重視して開発するタイプ。",
    };
  }

  if (includesLanguage(languageStats, ["Go", "Rust", "Java", "Kotlin"])) {
    return {
      key: "backend-engineer",
      label: "バックエンドエンジニア",
      description: "信頼性とスケーラビリティを重視するサーバー志向タイプ。",
    };
  }

  return null;
}

function getTypeByRepository(input: WrappedAnalysisInput): DeveloperType | null {
  const hasManyStars = input.metrics.totalStars >= 200;
  const hasManyForks = input.metrics.totalForks >= 50;

  if (hasManyStars || hasManyForks) {
    return {
      key: "oss-lover",
      label: "OSSラバー",
      description: "コミュニティへの公開と改善サイクルを楽しむオープンソース型。",
    };
  }

  if (input.metrics.languageStats.length >= 4) {
    return {
      key: "fullstack",
      label: "フルスタック",
      description: "複数領域を横断して価値を届けるフルスタック型。",
    };
  }

  return null;
}

function getTypeByActivity(input: WrappedAnalysisInput): DeveloperType | null {
  if (input.contributions.totalContributions >= 120) {
    return {
      key: "consistent-builder",
      label: "継続型ビルダー",
      description: "継続的なコミットで着実に成果を積み上げるタイプ。",
    };
  }

  if (input.repositories.length > 0 && input.user.publicRepos <= 5) {
    return {
      key: "craft-focused",
      label: "クラフト重視",
      description: "少数精鋭で品質にこだわるクラフト志向タイプ。",
    };
  }

  return null;
}

export function analyzeDeveloperType(input: WrappedAnalysisInput): DeveloperType {
  return (
    getTypeByRepository(input) ??
    getTypeByLanguage(input) ??
    getTypeByActivity(input) ?? {
      key: "steady-explorer",
      label: "堅実な探求者",
      description: "幅広い技術を探索しながら堅実に学習を続けるタイプ。",
    }
  );
}
