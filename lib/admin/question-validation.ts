import { PublicationStatus } from "@/lib/generated/prisma/enums";

export type QuestionInput = {
  prompt: string;
  helper: string | null;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  publicationStatus: PublicationStatus;
};

const publicationStatuses = new Set(Object.values(PublicationStatus));

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseChoices(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((choice): choice is string => typeof choice === "string")
      .map((choice) => choice.trim())
      .filter(Boolean);
  }

  return clean(value)
    .split("\n")
    .map((choice) => choice.trim())
    .filter(Boolean);
}

export function parseQuestionInput(body: Record<string, unknown>):
  | { ok: true; input: QuestionInput }
  | { ok: false; error: string } {
  const prompt = clean(body.prompt);
  const helper = clean(body.helper);
  const choices = parseChoices(body.choices);
  const correctAnswer = clean(body.correctAnswer);
  const explanation = clean(body.explanation);
  const publicationStatus = clean(body.publicationStatus);

  if (!prompt || !explanation) {
    return {
      ok: false,
      error: "Prompt and explanation are required."
    };
  }

  if (choices.length === 0) {
    return {
      ok: false,
      error: "At least one choice is required."
    };
  }

  if (!correctAnswer || !choices.includes(correctAnswer)) {
    return {
      ok: false,
      error: "Correct answer must match one of the choices exactly."
    };
  }

  if (!publicationStatuses.has(publicationStatus as PublicationStatus)) {
    return {
      ok: false,
      error: "Publication status is invalid."
    };
  }

  return {
    ok: true,
    input: {
      prompt,
      helper: helper || null,
      choices,
      correctAnswer,
      explanation,
      publicationStatus: publicationStatus as PublicationStatus
    }
  };
}
