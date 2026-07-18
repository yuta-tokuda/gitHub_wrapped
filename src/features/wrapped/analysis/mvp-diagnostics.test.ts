import { describe, expect, it } from "vitest";

import { buildMvpDiagnostics } from "./mvp-diagnostics";
import { createWrappedFixture } from "./test-fixtures";

describe("buildMvpDiagnostics", () => {
  it("returns 20 diagnostics with score bounds", () => {
    const diagnostics = buildMvpDiagnostics(createWrappedFixture());

    expect(diagnostics).toHaveLength(20);
    for (const item of diagnostics) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.formula.length).toBeGreaterThan(0);
      expect(item.shareText.length).toBeGreaterThan(0);
    }
  });
});
