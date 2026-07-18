import { describe, expect, it } from "vitest";

import { buildPublicDataInsight } from "./public-data-insight";
import { createWrappedFixture } from "./test-fixtures";

describe("buildPublicDataInsight", () => {
  it("returns bounded coverage score and notes", () => {
    const result = buildPublicDataInsight(createWrappedFixture());

    expect(result.coverageScore).toBeGreaterThanOrEqual(0);
    expect(result.coverageScore).toBeLessThanOrEqual(100);
    expect(result.missingAreas.length).toBeGreaterThan(0);
    expect(result.fairnessNotes.length).toBeGreaterThan(0);
  });
});
