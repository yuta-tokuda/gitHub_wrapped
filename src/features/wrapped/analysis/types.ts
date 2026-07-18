import type { WrappedGitHubData } from "@/types/github";

export type WrappedAnalysisInput = WrappedGitHubData;

export type DeveloperScoreBreakdown = {
  repositories: number;
  stars: number;
  followers: number;
  contributions: number;
  readmeCoverage: number;
  languageDiversity: number;
  recentActivity: number;
};

export type DeveloperScoreResult = {
  totalScore: number;
  breakdown: DeveloperScoreBreakdown;
};

export type DeveloperType = {
  key: string;
  label: string;
  description: string;
};

export type Achievement = {
  key: string;
  title: string;
  description: string;
};
