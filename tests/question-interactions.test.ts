import { describe, expect, it } from "vitest";
import {
  PublicationStatus,
  QuestionType
} from "@/lib/generated/prisma/enums";
import { parseQuestionInput } from "@/lib/admin/question-validation";
import { evaluateAnswer } from "@/lib/question-engine/evaluation";
import {
  questionOptionsFrom,
  serializeQuestionOptions
} from "@/lib/question-engine/question-options";

describe("question interactions", () => {
  it("accepts authored deterministic answer variants", () => {
    const choices = serializeQuestionOptions({
      choices: [],
      acceptedAnswers: ["moechte", "moechte."],
      tiles: []
    });

    expect(
      evaluateAnswer(
        {
          type: QuestionType.FILL_IN_BLANK,
          choices,
          correctAnswer: "möchte"
        },
        " Moechte! "
      )
    ).toBe(true);
  });

  it("keeps typed answers strict for unlisted grammar differences", () => {
    expect(
      evaluateAnswer(
        {
          type: QuestionType.FILL_IN_BLANK,
          choices: [],
          correctAnswer: "geht"
        },
        "gehen"
      )
    ).toBe(false);
  });

  it("supports multiple valid word orders through accepted answers", () => {
    const choices = serializeQuestionOptions({
      choices: [],
      acceptedAnswers: ["Deutsch lerne ich heute"],
      tiles: ["Ich", "lerne", "heute", "Deutsch"]
    });

    expect(
      evaluateAnswer(
        {
          type: QuestionType.WORD_ORDERING,
          choices,
          correctAnswer: "Ich lerne heute Deutsch"
        },
        "Deutsch lerne ich heute"
      )
    ).toBe(true);
    expect(questionOptionsFrom(choices).tiles).toEqual([
      "Ich",
      "lerne",
      "heute",
      "Deutsch"
    ]);
  });

  it("parses fill-in-blank questions without multiple-choice options", () => {
    const parsed = parseQuestionInput({
      type: QuestionType.FILL_IN_BLANK,
      prompt: "Ich ___ Deutsch.",
      choices: "",
      acceptedAnswers: "lerne.",
      correctAnswer: "lerne",
      explanation: "Ich takes lerne.",
      required: true,
      publicationStatus: PublicationStatus.PUBLISHED
    });

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(questionOptionsFrom(parsed.input.choices).acceptedAnswers).toEqual([
        "lerne."
      ]);
    }
  });
});
