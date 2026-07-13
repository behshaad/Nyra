import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => ({
    unit: {
      findMany: vi.fn(async () => [])
    },
    level: {
      findMany: vi.fn(async () => [])
    },
    learnerProfile: {
      findUnique: vi.fn(async () => null)
    },
    progressEvent: {
      findMany: vi.fn(async () => [])
    }
  })
}));

describe("learning path fallback", () => {
  it("renders published B2 units from sample content when the database has no B2 rows", async () => {
    const { getLearningPathProgress } = await import("@/lib/learning/path-progress");

    const progress = await getLearningPathProgress("B2");

    expect(progress.units).toHaveLength(12);
    expect(progress.totalCount).toBe(61);
    expect(progress.nextSkill?.slug).toBe("b2-discuss-career-paths");
    expect(progress.units[0]?.skills).toHaveLength(5);
  });

  it("uses non-Persian A1 titles when the interface language is English", async () => {
    const { getLearningPathProgress } = await import("@/lib/learning/path-progress");

    const progress = await getLearningPathProgress("A1", "en");

    expect(progress.units[0]?.title).toBe("First contacts");
    expect(progress.units[0]?.skills[0]?.title).toBe("Greet and say your name");
    expect(progress.units[0]?.title).not.toMatch(/[\u0600-\u06FF]/);
    expect(progress.units[0]?.skills[0]?.description).not.toMatch(/[\u0600-\u06FF]/);
  });

  it("includes B2 skill routes when the database has no seeded levels", async () => {
    const { getFlatPublishedSkills } = await import("@/lib/learning/path-progress");

    const skills = await getFlatPublishedSkills();

    expect(skills.some((skill) => skill.slug === "b2-discuss-career-paths")).toBe(true);
    expect(skills.some((skill) => skill.slug === "b2-final-test")).toBe(true);
  });
});
