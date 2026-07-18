import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges class names and resolves conflicting tailwind classes", () => {
    const result = cn("px-2", "py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });
});
