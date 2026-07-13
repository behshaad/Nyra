import { describe, expect, it } from "vitest";
import {
  getLevelContentSummary,
  getPublishedSkills,
  sampleCourse,
  sampleResources
} from "@/lib/learning/sample-content";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

describe("B2 sample content", () => {
  it("publishes the full B2 level with a cumulative final test", () => {
    const b2 = sampleCourse.levels.find((level) => level.label === "B2");

    expect(b2?.units).toHaveLength(12);
    expect(getLevelContentSummary("B2")).toMatchObject({
      unitCount: 12,
      regularSkillCount: 48,
      checkpointCount: 12,
      finalTestCount: 1,
      questionCount: 558
    });
  });

  it("publishes every playable B2 skill in learner-facing helpers", () => {
    const publishedB2Skills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "B2"
    );

    expect(publishedB2Skills).toHaveLength(61);
    expect(publishedB2Skills.slice(0, 5).map((skill) => skill.slug)).toEqual([
      "b2-discuss-career-paths",
      "b2-negotiate-workplace-responsibilities",
      "b2-write-a-formal-request",
      "b2-give-and-receive-feedback",
      "b2-work-careers-and-professional-communication-checkpoint"
    ]);
    expect(publishedB2Skills.slice(0, 5).map((skill) => skill.questions.length)).toEqual([
      8,
      8,
      8,
      8,
      12
    ]);
    expect(publishedB2Skills[4].description).toContain("کنترل B2");
  });

  it("uses the current deterministic Question Types for published B2 regular Skills", () => {
    const publishedB2RegularSkills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "B2" && skill.kind === "REGULAR"
    );

    for (const skill of publishedB2RegularSkills) {
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

  it("publishes Persian-first learning guides for all B2 Units", () => {
    const b2Guides = sampleResources.filter(
      (resource) => resource.levelLabel === "B2" && resource.type === "LEARNING_GUIDE"
    );

    expect(b2Guides.map((guide) => guide.unitSlug)).toEqual([
      "b2-work-careers-and-professional-communication",
      "b2-media-digital-life-and-public-opinion",
      "b2-society-politics-and-civic-participation",
      "b2-environment-consumption-and-sustainability",
      "b2-health-psychology-and-wellbeing",
      "b2-education-research-and-lifelong-learning",
      "b2-culture-literature-and-identity",
      "b2-economy-money-and-consumer-rights",
      "b2-science-technology-and-innovation",
      "b2-migration-housing-and-bureaucracy",
      "b2-travel-globalization-and-intercultural-communication",
      "b2-exam-strategies-argumentation-and-final-review"
    ]);
  });

  it("uses a balanced mixed-question B2 final test", () => {
    const finalTest = getPublishedSkills().find(
      (skill) => skill.levelLabel === "B2" && skill.kind === "FINAL_TEST"
    );

    expect(finalTest?.questions).toHaveLength(30);
    expect(finalTest?.questions.filter((question) => question.type === "MULTIPLE_CHOICE")).toHaveLength(10);
    expect(finalTest?.questions.filter((question) => question.type === "FILL_IN_BLANK")).toHaveLength(10);
    expect(finalTest?.questions.filter((question) => question.type === "WORD_ORDERING")).toHaveLength(10);
  });
});
