import { describe, expect, it } from "vitest";

import { analyzeDeveloperType } from "./developer-type";
import { createWrappedFixture } from "./test-fixtures";

describe("analyzeDeveloperType", () => {
  it("returns OSS Lover when stars are high", () => {
    const input = createWrappedFixture({
      metrics: {
        ...createWrappedFixture().metrics,
        totalStars: 600,
      },
    });

    const result = analyzeDeveloperType(input);
    expect(result.key).toBe("oss-lover");
  });

  it("returns frontend engineer for frontend-centric languages", () => {
    const input = createWrappedFixture({
      metrics: {
        ...createWrappedFixture().metrics,
        totalStars: 10,
        languageStats: [{ name: "TypeScript", count: 10, ratio: 100 }],
      },
    });

    const result = analyzeDeveloperType(input);
    expect(result.key).toBe("frontend-engineer");
  });
});
