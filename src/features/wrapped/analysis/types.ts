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

export type DeveloperDnaKey =
  | "builder"
  | "explorer"
  | "maintainer"
  | "collaborator"
  | "experimenter"
  | "teacher"
  | "creator"
  | "specialist"
  | "generalist"
  | "debugger";

export type DeveloperDna = {
  key: DeveloperDnaKey;
  label: string;
  score: number;
  formula: string;
  reason: string;
  description: string;
};

export type DeveloperDnaProfile = {
  dna: DeveloperDna[];
  dominantDna: DeveloperDna;
  topDnaKeys: DeveloperDnaKey[];
  balanceScore: number;
};

export type DeveloperPersonality = {
  key: string;
  title: string;
  description: string;
  matchedDna: DeveloperDnaKey[];
  reason: string;
};
