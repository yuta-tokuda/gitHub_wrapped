import type { WrappedGitHubData } from "@/types/github";

export function createWrappedFixture(
  overrides?: Partial<WrappedGitHubData>,
): WrappedGitHubData {
  const base: WrappedGitHubData = {
    user: {
      login: "demo-user",
      name: "Demo User",
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
      bio: "Demo bio",
      followers: 120,
      following: 30,
      publicRepos: 12,
      createdAt: "2020-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      htmlUrl: "https://github.com/demo-user",
    },
    repositories: [
      {
        id: 1,
        name: "web-docs",
        fullName: "demo-user/web-docs",
        description: "readme and docs",
        htmlUrl: "https://github.com/demo-user/web-docs",
        stargazersCount: 200,
        forksCount: 30,
        language: "TypeScript",
        topics: ["web"],
        archived: false,
        fork: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
        pushedAt: new Date().toISOString(),
        hasReadme: true,
      },
    ],
    pinnedRepositories: [],
    metrics: {
      totalStars: 200,
      totalForks: 30,
      topRepository: null,
      topLanguage: "TypeScript",
      languageStats: [
        { name: "TypeScript", count: 5, ratio: 50 },
        { name: "Go", count: 2, ratio: 20 },
      ],
    },
    contributions: {
      totalContributions: 160,
      pushEvents: 60,
      pullRequestEvents: 24,
      issuesEvents: 22,
      sampledEvents: 100,
    },
  };

  return {
    ...base,
    ...overrides,
  };
}
