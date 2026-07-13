import { describe, expect, it } from "vitest";
import {
  getLevelContentSummary,
  getPublishedSkills,
  sampleCourse,
  sampleResources
} from "@/lib/learning/sample-content";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

describe("B1 sample content", () => {
  it("publishes the full B1 level with a cumulative final test", () => {
    const b1 = sampleCourse.levels.find((level) => level.label === "B1");

    expect(b1?.units).toHaveLength(12);
    expect(getLevelContentSummary("B1")).toMatchObject({
      unitCount: 12,
      regularSkillCount: 48,
      checkpointCount: 12,
      finalTestCount: 1,
      questionCount: 558
    });
  });

  it("publishes every playable B1 skill in learner-facing helpers", () => {
    const publishedB1Skills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "B1"
    );

    expect(publishedB1Skills).toHaveLength(61);
    expect(publishedB1Skills.slice(0, 5).map((skill) => skill.slug)).toEqual([
      "b1-plan-a-trip-and-explain-preferences",
      "b1-understand-and-discuss-travel-options",
      "b1-tell-a-holiday-story-in-the-past",
      "b1-understand-announcements-and-travel-updates",
      "b1-travel-plans-and-holiday-stories-checkpoint"
    ]);
    expect(publishedB1Skills.slice(0, 5).map((skill) => skill.questions.length)).toEqual([
      8,
      8,
      8,
      8,
      12
    ]);
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

  it("accepts the authored natural order for B1 word-ordering prompts", () => {
    const firstSkill = getPublishedSkills().find(
      (skill) => skill.slug === "b1-plan-a-trip-and-explain-preferences"
    );
    const wordOrderingQuestions =
      firstSkill?.questions.filter((question) => question.type === "WORD_ORDERING") ?? [];

    expect(wordOrderingQuestions).toHaveLength(2);
    expect(wordOrderingQuestions.map((question) => question.correctAnswer)).toEqual([
      "Ich habe Lust ans Meer zu fahren",
      "Ich habe Lust ans Meer zu fahren"
    ]);
  });

  it("publishes one Persian-first B1 Unit 1 Learning Guide", () => {
    const b1Guides = sampleResources.filter(
      (resource) => resource.levelLabel === "B1" && resource.type === "LEARNING_GUIDE"
    );

    expect(b1Guides).toHaveLength(12);
    expect(b1Guides[0]).toMatchObject({
      slug: "b1-travel-plans-persian-guide",
      unitSlug: "b1-travel-plans-and-holiday-stories",
      skillSlug: "b1-plan-a-trip-and-explain-preferences",
      publicationStatus: "PUBLISHED"
    });
  });

  it("uses a balanced mixed-question B1 final test", () => {
    const finalTest = getPublishedSkills().find(
      (skill) => skill.levelLabel === "B1" && skill.kind === "FINAL_TEST"
    );

    expect(finalTest?.questions).toHaveLength(30);
    expect(finalTest?.questions.filter((question) => question.type === "MULTIPLE_CHOICE")).toHaveLength(10);
    expect(finalTest?.questions.filter((question) => question.type === "FILL_IN_BLANK")).toHaveLength(10);
    expect(finalTest?.questions.filter((question) => question.type === "WORD_ORDERING")).toHaveLength(10);
  });
});
