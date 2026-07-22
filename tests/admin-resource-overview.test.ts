import { describe, expect, it } from "vitest";
import { PublicationStatus, ResourceType } from "@/lib/generated/prisma/enums";
import {
  filterAdminResources,
  resourcePlacement,
  resourceReadiness,
  type AdminResourceRecord
} from "@/lib/admin/resource-overview";

function resource(overrides: Partial<AdminResourceRecord> = {}): AdminResourceRecord {
  return {
    id: "resource-1",
    slug: "greetings",
    title: "Greetings",
    description: "Useful phrases",
    content: "Hallo",
    type: ResourceType.GRAMMAR_RESOURCE,
    levelLabel: "A1",
    language: "fa/de/en",
    url: null,
    publicationStatus: PublicationStatus.DRAFT,
    updatedAt: new Date("2026-07-22T00:00:00Z"),
    unit: null,
    skill: null,
    ...overrides
  };
}

describe("Resource Studio overview", () => {
  it("requires HTTPS destinations for destination-based types", () => {
    expect(resourceReadiness(resource({ type: ResourceType.EXTERNAL_LINK })).ready).toBe(false);
    expect(
      resourceReadiness(resource({ type: ResourceType.EXTERNAL_LINK, url: "https://nyra.test" })).ready
    ).toBe(true);
  });

  it("labels the most specific placement", () => {
    expect(
      resourcePlacement(
        resource({
          unit: { id: "unit-1", title: "Introductions" },
          skill: { id: "skill-1", title: "Say hello", unitId: "unit-1" }
        })
      )
    ).toBe("Skill · Say hello");
  });

  it("combines search and lifecycle filters", () => {
    const resources = [
      resource(),
      resource({ id: "resource-2", title: "Family", publicationStatus: PublicationStatus.PUBLISHED })
    ];
    expect(filterAdminResources(resources, { q: "family", status: "PUBLISHED" })).toHaveLength(1);
    expect(filterAdminResources(resources, { q: "family", status: "DRAFT" })).toHaveLength(0);
  });
});
