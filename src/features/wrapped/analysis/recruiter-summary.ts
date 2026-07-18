import type { DeveloperScoreResult, DeveloperType, WrappedAnalysisInput } from "./types";

export type RecruiterSummary = {
  headline: string;
  strengths: string[];
  watchPoints: string[];
  recommendedRoles: string[];
};

function buildHeadline(score: number, typeLabel: string): string {
  if (score >= 80) {
    return `即戦力候補。${typeLabel}として高い成果が期待できます。`;
  }

  if (score >= 60) {
    return `育成込みで有望。${typeLabel}としてポテンシャルが高いです。`;
  }

  return `基礎を拡張中。${typeLabel}として伸びしろが大きい候補です。`;
}

function pickStrengths(
  input: WrappedAnalysisInput,
  score: DeveloperScoreResult,
): string[] {
  const strengths: string[] = [];

  if (input.metrics.totalStars >= 100) {
    strengths.push("公開成果物への外部評価（Stars）が高い");
  }
  if (input.contributions.totalContributions >= 100) {
    strengths.push("直近の開発活動量が多く、継続性がある");
  }
  if (input.metrics.languageStats.length >= 4) {
    strengths.push("複数言語での実装経験があり、横断的に対応できる");
  }
  if (score.breakdown.readmeCoverage >= 7) {
    strengths.push("README/Docs志向があり、保守性への配慮がある");
  }

  if (strengths.length === 0) {
    // Why this fallback:
    // 公開データが少ない候補者でも、採用サマリーの「強み」欄が空になると
    // 読み手が判断しづらいため、最低1つは観測可能なポジティブ要素を返す。
    if (input.repositories.length >= 1) {
      strengths.push("公開リポジトリを継続して運用しており、開発の再現性がある");
    } else if (input.contributions.totalContributions > 0) {
      strengths.push("公開活動があり、学習・実装の継続姿勢が確認できる");
    } else {
      strengths.push("公開プロフィール情報が整備されており、発信意識がある");
    }
  }

  return strengths.slice(0, 3);
}

function pickWatchPoints(input: WrappedAnalysisInput): string[] {
  const watchPoints: string[] = [];

  if (input.metrics.totalStars < 30) {
    watchPoints.push("対外公開実績（Stars）は今後の積み上げ余地あり");
  }
  if (input.contributions.totalContributions < 30) {
    watchPoints.push("直近活動量は少なめ。稼働フェーズの確認が必要");
  }
  if (input.metrics.languageStats.length <= 1) {
    watchPoints.push("技術スタックが限定的なため、担当領域の明確化が必要");
  }

  if (watchPoints.length === 0) {
    watchPoints.push("大きな懸念は見られず、面談では志向性の深掘りが中心");
  }

  return watchPoints.slice(0, 2);
}

function mapRoles(type: DeveloperType): string[] {
  const byType: Record<string, string[]> = {
    "frontend-engineer": ["フロントエンドエンジニア", "UIエンジニア"],
    "backend-engineer": ["バックエンドエンジニア", "プラットフォームエンジニア"],
    "oss-lover": ["OSSエンジニア", "Developer Experienceエンジニア"],
    fullstack: ["フルスタックエンジニア", "プロダクトエンジニア"],
    "consistent-builder": ["プロダクトエンジニア", "フルサイクルエンジニア"],
  };

  return byType[type.key] ?? ["ソフトウェアエンジニア", "Webエンジニア"];
}

export function buildRecruiterSummary(
  input: WrappedAnalysisInput,
  score: DeveloperScoreResult,
  developerType: DeveloperType,
): RecruiterSummary {
  return {
    headline: buildHeadline(score.totalScore, developerType.label),
    strengths: pickStrengths(input, score),
    watchPoints: pickWatchPoints(input),
    recommendedRoles: mapRoles(developerType),
  };
}
