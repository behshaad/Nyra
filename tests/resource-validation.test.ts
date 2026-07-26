import { describe, expect, it } from "vitest";
import { parseResourceInput } from "@/lib/resources/resource-validation";

function validResource(overrides: Record<string, unknown> = {}) {
  return {
    title: "A useful guide",
    slug: "a-useful-guide",
    description: "Description",
    content: "Content",
    levelLabel: "A1",
    language: "fa",
    thumbnailIcon: "book-open",
    metadata: "",
    type: "LEARNING_GUIDE",
    publicationStatus: "DRAFT",
    ...overrides
  };
}

describe("Resource image validation", () => {
  it("accepts a Media Library image selection", () => {
    const result = parseResourceInput(validResource({ thumbnailMediaId: "image-123" }));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.input.thumbnailMediaId).toBe("image-123");
  });

  it("normalizes an empty image selection to the default", () => {
    const result = parseResourceInput(validResource({ thumbnailMediaId: " " }));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.input.thumbnailMediaId).toBeNull();
  });
});
