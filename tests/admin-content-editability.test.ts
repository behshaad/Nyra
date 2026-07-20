import { describe, expect, it } from "vitest";
import { canEditDraftContent } from "@/lib/admin/content-editability";

describe("admin content editability", () => {
  it("allows a Draft item inside a Draft aggregate", () => {
    expect(canEditDraftContent({ aggregateStatus: "DRAFT", itemStatus: "DRAFT" })).toBe(true);
  });

  it("freezes In Review, Published, and Archived aggregates", () => {
    expect(canEditDraftContent({ aggregateStatus: "IN_REVIEW" })).toBe(false);
    expect(canEditDraftContent({ aggregateStatus: "PUBLISHED" })).toBe(false);
    expect(canEditDraftContent({ aggregateStatus: "ARCHIVED" })).toBe(false);
  });

  it("does not edit a non-Draft child through a Draft parent", () => {
    expect(canEditDraftContent({ aggregateStatus: "DRAFT", itemStatus: "PUBLISHED" })).toBe(false);
  });
});
