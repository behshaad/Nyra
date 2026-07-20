import { describe, expect, it } from "vitest";
import { sanitizeAuditValue } from "@/lib/admin/audit-log";

describe("admin audit sanitization", () => {
  it("removes secrets, credentials, tokens, and learner answers recursively", () => {
    expect(
      sanitizeAuditValue({
        title: "Updated Skill",
        password: "unsafe",
        nested: {
          authorization: "Bearer unsafe",
          submittedAnswer: "private learner answer",
          status: "PUBLISHED"
        }
      })
    ).toEqual({
      title: "Updated Skill",
      nested: {
        status: "PUBLISHED"
      }
    });
  });

  it("bounds large values before persistence", () => {
    const sanitized = sanitizeAuditValue({ content: "x".repeat(2_100) }) as {
      content: string;
    };

    expect(sanitized.content.length).toBe(2_001);
    expect(sanitized.content.endsWith("…")).toBe(true);
  });
});
