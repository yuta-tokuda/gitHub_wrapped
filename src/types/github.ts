export type GitHubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
};

export type GitHubRepository = {
  id: number | string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stargazersCount: number;
  forksCount: number;
  language: string | null;
  topics: string[];
  archived: boolean;
  fork: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
};

export type LanguageStat = {
  name: string;
  count: number;
  ratio: number;
};

export type RepositoryMetrics = {
  totalStars: number;
  totalForks: number;
  topRepository: GitHubRepository | null;
  topLanguage: string | null;
  languageStats: LanguageStat[];
};

export type ContributionSummary = {
  totalContributions: number;
  pushEvents: number;
  pullRequestEvents: number;
  issuesEvents: number;
  lookbackDays: number;
};

export type WrappedGitHubData = {
  user: GitHubUser;
  repositories: GitHubRepository[];
  pinnedRepositories: GitHubRepository[];
  metrics: RepositoryMetrics;
  contributions: ContributionSummary;
};
