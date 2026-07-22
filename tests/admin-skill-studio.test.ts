import { describe, expect, it } from "vitest";
import { PublicationStatus, SkillKind } from "@/lib/generated/prisma/enums";
import {
  filterSkillStudioUnits,
  groupSkillStudioByLevel,
  skillStudioReadiness,
  type SkillStudioSkill,
  type SkillStudioUnit
} from "@/lib/admin/skill-studio";

function skill(overrides: Partial<SkillStudioSkill> = {}): SkillStudioSkill {
  return {
    id: "skill-1", slug: "say-hello", order: 1, title: "Say hello", description: "Intro",
    kind: SkillKind.REGULAR, publicationStatus: PublicationStatus.PUBLISHED, xp: 80,
    questions: Array.from({ length: 8 }, () => ({ required: true, publicationStatus: PublicationStatus.PUBLISHED })),
    ...overrides
  };
}

function unit(overrides: Partial<SkillStudioUnit> = {}): SkillStudioUnit {
  return {
    id: "unit-1", slug: "introductions", order: 1, title: "Introductions", summary: "Start here",
    level: { id: "level-1", label: "A1", order: 1, title: "Beginner" }, skills: [skill()], ...overrides
  };
}

describe("Skill Studio", () => {
  it("keeps runnable and ready distinct", () => {
    const result = skillStudioReadiness(skill({ questions: [{ required: true, publicationStatus: PublicationStatus.PUBLISHED }] }));
    expect(result).toMatchObject({ learnerAvailable: true, readiness: "needs_attention", target: 8 });
  });

  it("combines discovery filters and removes empty Units", () => {
    const units = [unit(), unit({ id: "unit-2", title: "Banking", skills: [skill({ id: "skill-2", kind: SkillKind.UNIT_CHECKPOINT })] })];
    const filtered = filterSkillStudioUnits(units, { q: "bank", kind: "UNIT_CHECKPOINT", level: "A1" });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toBe("Banking");
  });

  it("groups Units by ordered Level", () => {
    const groups = groupSkillStudioByLevel([
      unit({ id: "unit-b", level: { id: "level-b", label: "B1", order: 2, title: "Intermediate" } }),
      unit()
    ]);
    expect(groups.map((level) => level.label)).toEqual(["A1", "B1"]);
  });
});
