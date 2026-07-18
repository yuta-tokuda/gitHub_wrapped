import { describe, expect, it } from "vitest";

import { calculateDeveloperScore } from "./developer-score";
import { createWrappedFixture } from "./test-fixtures";

describe("calculateDeveloperScore", () => {
  it("returns score between 0 and 100", () => {
    const input = createWrappedFixture();
    const result = calculateDeveloperScore(input);

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });

  it("increases score for stronger profile", () => {
    const low = createWrappedFixture({
      user: {
        ...createWrappedFixture().user,
        followers: 1,
      },
      metrics: {
        ...createWrappedFixture().metrics,
        totalStars: 1,
      },
      contributions: {
        ...createWrappedFixture().contributions,
        totalContributions: 1,
      },
    });

    const high = createWrappedFixture();
    expect(calculateDeveloperScore(high).totalScore).toBeGreaterThan(
      calculateDeveloperScore(low).totalScore,
    );
  });
});
