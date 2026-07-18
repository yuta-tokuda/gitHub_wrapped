import { describe, expect, it } from "vitest";

import { buildDeveloperDnaProfile } from "./developer-dna";
import { createWrappedFixture } from "./test-fixtures";

describe("buildDeveloperDnaProfile", () => {
  it("calculates all 10 DNA scores in range", () => {
    const result = buildDeveloperDnaProfile(createWrappedFixture());

    expect(result.dna).toHaveLength(10);
    for (const item of result.dna) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(item.formula.length).toBeGreaterThan(0);
      expect(item.reason.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    }
  });

  it("returns dominant and top DNA keys", () => {
    const result = buildDeveloperDnaProfile(createWrappedFixture());

    expect(result.dominantDna).toBeDefined();
    expect(result.topDnaKeys).toHaveLength(3);
    expect(result.balanceScore).toBeGreaterThanOrEqual(0);
    expect(result.balanceScore).toBeLessThanOrEqual(100);
  });
});
