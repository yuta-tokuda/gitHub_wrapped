import { describe, expect, it } from "vitest";

import { collectAchievements } from "./achievements";
import { createWrappedFixture } from "./test-fixtures";

describe("collectAchievements", () => {
  it("returns unlocked achievements for active profile", () => {
    const input = createWrappedFixture();
    const result = collectAchievements(input);

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((item) => item.key === "active-dev")).toBe(true);
  });

  it("limits achievements to 20", () => {
    const input = createWrappedFixture({
      repositories: Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        name: `repo-${index}`,
        fullName: `demo/repo-${index}`,
        description: "readme docs",
        htmlUrl: `https://github.com/demo/repo-${index}`,
        stargazersCount: 120,
        forksCount: 40,
        language: index % 2 === 0 ? "TypeScript" : "Go",
        topics: [],
        archived: false,
        fork: false,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
        pushedAt: new Date().toISOString(),
      })),
      pinnedRepositories: Array.from({ length: 4 }, (_, index) => ({
        id: `pin-${index}`,
        name: `pin-${index}`,
        fullName: `demo/pin-${index}`,
        description: "featured",
        htmlUrl: `https://github.com/demo/pin-${index}`,
        stargazersCount: 160,
        forksCount: 20,
        language: "TypeScript",
        topics: [],
        archived: false,
        fork: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
        pushedAt: new Date().toISOString(),
      })),
    });

    const result = collectAchievements(input);
    expect(result.length).toBeLessThanOrEqual(20);
  });
});
