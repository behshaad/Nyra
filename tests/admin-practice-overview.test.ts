import { describe, expect, it } from "vitest";
import {
  projectAdminPracticeOverview,
  type AdminPracticeCourseInput,
  type AdminPracticeSkillInput
} from "@/lib/admin/practice-overview";

function skill(
  publicationStatus: AdminPracticeSkillInput["publicationStatus"],
  publishedRequiredQuestions: number,
  overrides: Partial<AdminPracticeSkillInput> = {}
): AdminPracticeSkillInput {
  return {
    id: overrides.id ?? `${publicationStatus}-${publishedRequiredQuestions}`,
    slug: overrides.slug ?? `${publicationStatus.toLowerCase()}-${publishedRequiredQuestions}`,
    order: overrides.order ?? 1,
    title: overrides.title ?? "Skill",
    description: overrides.description ?? "Description",
    kind: overrides.kind ?? "REGULAR",
    publicationStatus,
    questions: Array.from({ length: publishedRequiredQuestions }, (_, index) => ({
      id: `question-${index}`,
      required: true,
      publicationStatus: "PUBLISHED" as const
    }))
  };
}

function course(skills: AdminPracticeSkillInput[]): AdminPracticeCourseInput {
  return {
    id: "course-1",
    slug: "german-for-persian",
    title: "German for Persian speakers",
    sourceLanguage: "fa",
    targetLanguage: "de",
    levels: [
      {
        id: "level-1",
        label: "A1",
        order: 1,
        title: "A1",
        units: [
          {
            id: "unit-1",
            slug: "unit-1",
            order: 1,
            title: "Unit 1",
            summary: "Summary",
            skills
          }
        ]
      }
    ]
  };
}

describe("admin Practice overview projection", () => {
  it("distinguishes runnable Published Skills from content-ready Skills", () => {
    const overview = projectAdminPracticeOverview(
      course([skill("PUBLISHED", 1), skill("PUBLISHED", 8, { id: "ready", order: 2 })])
    );
    const [runnable, ready] = overview.levels[0]!.units[0]!.skills;

    expect(runnable).toMatchObject({
      learnerAvailable: true,
      health: "needs_attention",
      issue: "below_target",
      questionTarget: 8
    });
    expect(ready).toMatchObject({
      learnerAvailable: true,
      health: "available",
      issue: null
    });
    expect(overview.metrics.skills).toEqual({
      authored: 2,
      learnerAvailable: 2,
      needsAttention: 1
    });
  });

  it("flags a Published Skill with no required Published Questions as not runnable", () => {
    const overview = projectAdminPracticeOverview(course([skill("PUBLISHED", 0)]));
    const projected = overview.levels[0]!.units[0]!.skills[0]!;

    expect(projected).toMatchObject({
      learnerAvailable: false,
      health: "needs_attention",
      issue: "not_runnable"
    });
    expect(overview.levels[0]!.health).toBe("needs_attention");
  });

  it("keeps Draft work from making healthy Published content look broken", () => {
    const overview = projectAdminPracticeOverview(
      course([skill("PUBLISHED", 8), skill("DRAFT", 0, { id: "draft", order: 2 })])
    );

    expect(overview.levels[0]!.units[0]!.health).toBe("available");
  });

  it("distinguishes archived-only, in-preparation, and empty containers", () => {
    const archived = projectAdminPracticeOverview(course([skill("ARCHIVED", 0)]));
    const preparing = projectAdminPracticeOverview(
      course([skill("ARCHIVED", 0), skill("DRAFT", 0, { id: "draft", order: 2 })])
    );
    const empty = projectAdminPracticeOverview(course([]));

    expect(archived.levels[0]!.units[0]!.health).toBe("archived_only");
    expect(preparing.levels[0]!.units[0]!.health).toBe("in_preparation");
    expect(empty.levels[0]!.units[0]!.health).toBe("empty");
  });

  it("only allows direct editing for Draft Skills", () => {
    const overview = projectAdminPracticeOverview(
      course([
        skill("DRAFT", 0),
        skill("IN_REVIEW", 0, { id: "review", order: 2 }),
        skill("PUBLISHED", 8, { id: "published", order: 3 })
      ])
    );

    expect(overview.levels[0]!.units[0]!.skills.map((item) => item.canEdit)).toEqual([
      true,
      false,
      false
    ]);
  });
});
