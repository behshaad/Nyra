import { describe, expect, it } from "vitest";
import { resolvePracticeProgressAuthUserId } from "@/lib/practice/journey";

describe("Practice Journey preview isolation", () => {
  it("does not resolve learner progress for clean previews", () => {
    expect(
      resolvePracticeProgressAuthUserId({
        authUserId: "admin-user",
        progressMode: "clean"
      })
    ).toBeUndefined();
  });
});
