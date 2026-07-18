import { describe, expect, it } from "vitest";

import { buildDeveloperDnaProfile } from "./developer-dna";
import {
  analyzeDeveloperPersonality,
  DEVELOPER_PERSONALITY_VARIANTS,
} from "./developer-personality";
import { createWrappedFixture } from "./test-fixtures";

describe("analyzeDeveloperPersonality", () => {
  it("has 30+ personality variants", () => {
    expect(DEVELOPER_PERSONALITY_VARIANTS).toBeGreaterThanOrEqual(30);
  });

  it("generates personality by combined dna", () => {
    const profile = buildDeveloperDnaProfile(
      createWrappedFixture({
        repositories: Array.from({ length: 26 }, (_, index) => ({
          id: index + 1,
          name: `repo-${index}`,
          fullName: `demo/repo-${index}`,
          description: "readme docs",
          htmlUrl: `https://github.com/demo/repo-${index}`,
          stargazersCount: 50,
          forksCount: 10,
          language: index % 2 === 0 ? "TypeScript" : "Go",
          topics: ["web", "infra"],
          archived: false,
          fork: false,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: new Date().toISOString(),
          pushedAt: new Date().toISOString(),
        })),
      }),
    );

    const result = analyzeDeveloperPersonality(profile);

    expect(result.title.length).toBeGreaterThan(0);
    expect(result.matchedDna.length).toBeGreaterThanOrEqual(2);
    expect(result.reason.length).toBeGreaterThan(0);
  });
});
