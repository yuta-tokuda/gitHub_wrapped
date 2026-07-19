import { SCORE_MAX, SCORE_THRESHOLDS, SCORE_WEIGHTS } from "./constants";
import type {
  DeveloperScoreBreakdown,
  DeveloperScoreResult,
  WrappedAnalysisInput,
} from "./types";

function toCappedScore(value: number, threshold: number, weight: number): number {
  return Math.min(weight, (value / threshold) * weight);
}

function calculateReadmeCoverage(repositories: WrappedAnalysisInput["repositories"]): number {
  if (repositories.length === 0) {
    return 0;
  }

  const withReadmeCount = repositories.filter(
    (repository) => repository.hasReadme === true,
  ).length;

  return withReadmeCount / repositories.length;
}

function getActiveDaysScore(repositories: WrappedAnalysisInput["repositories"]): number {
  if (repositories.length === 0) {
    return 0;
  }

  const now = new Date();
  const activeDays = repositories.filter((repository) => {
    const updatedAt = new Date(repository.updatedAt);
    const diffMs = now.getTime() - updatedAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= SCORE_THRESHOLDS.activityDays;
  }).length;

  const activityTarget = Math.min(
    SCORE_THRESHOLDS.recentActivityTargetMax,
    repositories.length,
  );

  return toCappedScore(
    activeDays,
    activityTarget,
    SCORE_WEIGHTS.recentActivity,
  );
}

export function calculateDeveloperScore(
  input: WrappedAnalysisInput,
): DeveloperScoreResult {
  const repositoriesCount = input.repositories.length;
  const readmeRatio = calculateReadmeCoverage(input.repositories);
  const languageCount = input.metrics.languageStats.length;

  // Why this formula:
  // - Repository/Stars/Followers/Contributions are weighted high because they reflect output + impact.
  // - Readme coverage rewards maintainability/documentation practices.
  // - Language diversity rewards versatility, but with a capped weight to avoid overvaluing breadth.
  // - Recent activity rewards continuity and prevents stale profiles from scoring too high.
  const breakdown: DeveloperScoreBreakdown = {
    repositories: toCappedScore(
      repositoriesCount,
      SCORE_THRESHOLDS.repositories,
      SCORE_WEIGHTS.repositories,
    ),
    stars: toCappedScore(
      input.metrics.totalStars,
      SCORE_THRESHOLDS.stars,
      SCORE_WEIGHTS.stars,
    ),
    followers: toCappedScore(
      input.user.followers,
      SCORE_THRESHOLDS.followers,
      SCORE_WEIGHTS.followers,
    ),
    contributions: toCappedScore(
      input.contributions.totalContributions,
      SCORE_THRESHOLDS.contributions,
      SCORE_WEIGHTS.contributions,
    ),
    readmeCoverage: readmeRatio * SCORE_WEIGHTS.readmeCoverage,
    languageDiversity: toCappedScore(
      languageCount,
      SCORE_THRESHOLDS.languageDiversity,
      SCORE_WEIGHTS.languageDiversity,
    ),
    recentActivity: getActiveDaysScore(input.repositories),
  };

  const totalScore = Math.round(
    Object.values(breakdown).reduce((acc, value) => acc + value, 0),
  );

  return {
    totalScore: Math.min(SCORE_MAX, totalScore),
    breakdown,
  };
}
