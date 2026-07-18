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
export const ACHIEVEMENTS_MAX = 20;
