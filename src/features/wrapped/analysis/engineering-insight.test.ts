import { describe, expect, it } from "vitest";

import { calculateDeveloperScore } from "./developer-score";
import { buildEngineeringInsight } from "./engineering-insight";
import { createWrappedFixture } from "./test-fixtures";

describe("buildEngineeringInsight", () => {
  it("builds non-empty insight fields", () => {
    const input = createWrappedFixture();
    const score = calculateDeveloperScore(input);
    const insight = buildEngineeringInsight(input, score);

    expect(insight.profileSummary.length).toBeGreaterThan(0);
    expect(insight.workStyle.length).toBeGreaterThan(0);
    expect(insight.collaborationStyle.length).toBeGreaterThan(0);
    expect(insight.growthSignal.length).toBeGreaterThan(0);
    expect(insight.suggestedAssignments.length).toBeGreaterThan(0);
    expect(insight.interviewQuestions.length).toBe(3);
  });
});
