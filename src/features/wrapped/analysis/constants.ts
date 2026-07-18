export const SCORE_MAX = 100;

export const SCORE_WEIGHTS = {
  repositories: 15,
  stars: 20,
  followers: 15,
  contributions: 20,
  readmeCoverage: 10,
  languageDiversity: 10,
  recentActivity: 10,
} as const;

export const SCORE_THRESHOLDS = {
  repositories: 30,
  stars: 500,
  followers: 300,
  contributions: 200,
  languageDiversity: 8,
  activityDays: 30,
} as const;

export const TOP_REPOSITORIES_LIMIT = 5;
export const ACHIEVEMENTS_MAX = 40;

export const DAYS = {
  week: 7,
  month: 30,
  quarter: 90,
  halfYear: 180,
  year: 365,
} as const;

export const DNA_THRESHOLDS = {
  repositoriesHigh: 24,
  repositoriesMedium: 12,
  contributionHigh: 220,
  contributionMedium: 100,
  languageDiversityHigh: 7,
  languageDiversityMedium: 4,
  activeRepositoryRatioHigh: 0.65,
  activeRepositoryRatioMedium: 0.35,
  readmeCoverageHigh: 0.6,
  followersHigh: 300,
  followersMedium: 120,
  topicDiversityHigh: 16,
} as const;
