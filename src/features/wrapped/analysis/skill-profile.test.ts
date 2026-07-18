import { describe, expect, it } from "vitest";

import { buildSkillProfile } from "./skill-profile";
import { createWrappedFixture } from "./test-fixtures";

describe("buildSkillProfile", () => {
  it("returns 4 skill areas with bounded score", () => {
    const result = buildSkillProfile(createWrappedFixture());

    expect(result).toHaveLength(4);
    result.forEach((area) => {
      expect(area.score).toBeGreaterThanOrEqual(0);
      expect(area.score).toBeLessThanOrEqual(100);
    });
  });
});
