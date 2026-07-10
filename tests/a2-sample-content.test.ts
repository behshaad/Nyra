import { describe, expect, it } from "vitest";
import {
  getLevelContentSummary,
  getPublishedSkills,
  sampleResources,
  sampleCourse
} from "@/lib/learning/sample-content";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

describe("A2 sample content", () => {
  it("scaffolds the full A2 level while publishing Units 1-4", () => {
    const a2 = sampleCourse.levels.find((level) => level.label === "A2");

    expect(a2?.units).toHaveLength(12);
    expect(getLevelContentSummary("A2")).toMatchObject({
      unitCount: 12,
      regularSkillCount: 48,
      checkpointCount: 12,
      finalTestCount: 1,
      questionCount: 176
    });
  });

  it("publishes only the playable A2 Units 1-4 skills in learner-facing helpers", () => {
    const publishedA2Skills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "A2"
    );

    expect(publishedA2Skills).toHaveLength(20);
    expect(publishedA2Skills.slice(0, 5).map((skill) => skill.slug)).toEqual([
      "a2-reconnect-and-ask-how-someone-is",
      "a2-talk-about-moving-abroad",
      "a2-describe-recent-experiences",
      "a2-explain-why-you-learn-german",
      "a2-german-in-global-life-checkpoint"
    ]);
    expect(publishedA2Skills.slice(0, 5).map((skill) => skill.questions.length)).toEqual([
      8,
      8,
      8,
      8,
      12
    ]);
  });

  it("uses the A2 question quality mix for published regular Skills", () => {
    const publishedA2RegularSkills = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "A2" && skill.kind === "REGULAR"
    );

    for (const skill of publishedA2RegularSkills) {
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

  it("uses the A2 checkpoint mix for published Unit Checkpoints", () => {
    const checkpoints = getPublishedSkills().filter(
      (skill) => skill.levelLabel === "A2" && skill.kind === "UNIT_CHECKPOINT"
    );

    expect(checkpoints).toHaveLength(4);
    for (const checkpoint of checkpoints) {
      expect(checkpoint.questions.filter((question) => question.type === "MULTIPLE_CHOICE")).toHaveLength(5);
      expect(checkpoint.questions.filter((question) => question.type === "FILL_IN_BLANK")).toHaveLength(4);
      expect(checkpoint.questions.filter((question) => question.type === "WORD_ORDERING")).toHaveLength(3);
    }
  });

  it("publishes Persian-first learning guides for A2 Units 1-4", () => {
    const a2Guides = sampleResources.filter(
      (resource) => resource.levelLabel === "A2" && resource.type === "LEARNING_GUIDE"
    );

    expect(a2Guides.map((guide) => guide.unitSlug)).toEqual([
      "a2-german-in-global-life",
      "a2-appearance-and-recommendations",
      "a2-family-relationships-and-friends",
      "a2-housing-stays-and-email"
    ]);
  });
});
