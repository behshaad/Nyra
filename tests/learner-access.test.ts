import { describe, expect, it } from "vitest";
import { resolveLearnerAuthUserId } from "@/lib/auth/learner-access";
import { devAuthUserId } from "@/lib/learner/preferences";

describe("learner identity fallback", () => {
  it("always preserves an authenticated identity", () => {
    expect(resolveLearnerAuthUserId("user-1", "production")).toBe("user-1");
  });

  it("never exposes the development learner in production", () => {
    expect(resolveLearnerAuthUserId(null, "production")).toBeNull();
  });

  it("keeps the seeded learner available for local development", () => {
    expect(resolveLearnerAuthUserId(undefined, "development")).toBe(devAuthUserId);
  });
});
