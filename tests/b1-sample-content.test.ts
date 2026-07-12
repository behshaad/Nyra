import { describe, expect, it } from "vitest";
import {
  getLevelContentSummary,
  getPublishedSkills,
  sampleCourse,
  sampleResources
} from "@/lib/learning/sample-content";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

describe("B1 sample content", () => {
  it("creates the B1 roadmap with only Unit 1 published", () => {
    const b1 = sampleCourse.levels.find((level) => level.label === "B1");

    expect(b1?.units).toHaveLength(12);
    expect(getLevelContentSummary("B1")).toMatchObject({
      unitCount: 12,
      regularSkillCount: 48,
      checkpointCount: 1,
      finalTestCount: 0,
      questionCount: 44
    });
  });

  it("publishes only the first B1 Unit as playable content", () => {
    const publishedB1Skills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "B1"
    );

    expect(publishedB1Skills).toHaveLength(5);
    expect(publishedB1Skills.map((skill) => skill.slug)).toEqual([
      "b1-plan-a-trip-and-explain-preferences",
      "b1-understand-and-discuss-travel-options",
      "b1-tell-a-holiday-story-in-the-past",
      "b1-understand-announcements-and-travel-updates",
      "b1-travel-plans-and-holiday-stories-checkpoint"
    ]);
    expect(publishedB1Skills.map((skill) => skill.questions.length)).toEqual([
      8,
      8,
      8,
      8,
      12
    ]);
  });

  it("keeps B1 Units 2-12 as Draft Skill scaffolding without Questions", () => {
    const b1 = sampleCourse.levels.find((level) => level.label === "B1");
    const draftUnits = b1?.units.slice(1) ?? [];

    expect(draftUnits).toHaveLength(11);
    for (const unit of draftUnits) {
      expect(unit.skills).toHaveLength(4);
      expect(
        unit.skills.every(
          (skill) =>
            skill.kind === "REGULAR" &&
            skill.publicationStatus === "DRAFT" &&
            skill.questions.length === 0
        )
      ).toBe(true);
    }
  });

  it("uses the current deterministic Question Types for published B1 regular Skills", () => {
    const publishedB1RegularSkills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "B1" && skill.kind === "REGULAR"
    );

    for (const skill of publishedB1RegularSkills) {
      expect(skill.questions.filter((question) => question.type === "MULTIPLE_CHOICE")).toHaveLength(3);
      expect(skill.questions.filter((question) => question.type === "FILL_IN_BLANK")).toHaveLength(3);
      expect(skill.questions.filter((question) => question.type === "WORD_ORDERING")).toHaveLength(2);
      expect(
        skill.questions
          .filter((question) => question.type === "WORD_ORDERING")
          .every((question) => questionOptionsFrom(question.choices).tiles.length > 0)
      ).toBe(true);
    }
  });

  it("publishes one Persian-first B1 Unit 1 Learning Guide", () => {
    const b1Guides = sampleResources.filter(
      (resource) => resource.levelLabel === "B1" && resource.type === "LEARNING_GUIDE"
    );

    expect(b1Guides.map((guide) => guide.slug)).toEqual([
      "b1-travel-plans-persian-guide"
    ]);
    expect(b1Guides[0]).toMatchObject({
      unitSlug: "b1-travel-plans-and-holiday-stories",
      skillSlug: "b1-plan-a-trip-and-explain-preferences",
      publicationStatus: "PUBLISHED"
    });
  });
});
