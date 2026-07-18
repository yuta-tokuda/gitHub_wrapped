import type { WrappedAnalysisInput } from "./types";

export type PublicDataInsight = {
  coverageScore: number;
  confidenceLabel: string;
  summary: string;
  missingAreas: string[];
  fairnessNotes: string[];
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function estimateCoverageScore(input: WrappedAnalysisInput): number {
  const repoSignal = Math.min(45, input.repositories.length * 2);
  const starSignal = Math.min(25, input.metrics.totalStars / 8);
  const contribSignal = Math.min(30, input.contributions.totalContributions / 5);
  return clamp(repoSignal + starSignal + contribSignal);
}

function getConfidenceLabel(score: number): string {
  if (score >= 70) {
    return "公開データの反映度: 高め";
  }

  if (score >= 45) {
    return "公開データの反映度: 中程度";
  }

  return "公開データの反映度: 低め";
}

function buildSummary(score: number): string {
  if (score >= 70) {
    return "公開活動だけでも傾向を比較的捉えやすいプロフィールです。";
  }

  if (score >= 45) {
    return "公開活動から一部傾向は読み取れますが、実務実績の補足があると精度が上がります。";
  }

  return "公開データが少ないため、実務での成果や役割を合わせて評価するのがおすすめです。";
}

export function buildPublicDataInsight(
  input: WrappedAnalysisInput,
): PublicDataInsight {
  const coverageScore = estimateCoverageScore(input);

  return {
    coverageScore,
    confidenceLabel: getConfidenceLabel(coverageScore),
    summary: buildSummary(coverageScore),
    missingAreas: [
      "Private Repositoryでの開発履歴",
      "社内レビュー・設計議論・運用改善の実績",
      "業務上の役割（リード/実装/運用）の比重",
    ],
    fairnessNotes: [
      "本レポートは公開GitHubデータを基にした参考指標です。",
      "公開活動が少ない場合、実力を過小評価する可能性があります。",
    ],
  };
}
