import {
  PublicationStatus,
  QuestionType
} from "@/lib/generated/prisma/enums";
import {
  parseLineList,
  serializeQuestionOptions
} from "@/lib/question-engine/question-options";

export type QuestionInput = {
  type: QuestionType;
  prompt: string;
  helper: string | null;
  choices: string[] | {
    choices: string[];
    acceptedAnswers: string[];
    tiles: string[];
  };
  correctAnswer: string;
  explanation: string;
  required: boolean;
  publicationStatus: PublicationStatus;
  suggestedFlashcardIds: string[];
};

const publicationStatuses = new Set(Object.values(PublicationStatus));
const questionTypes = new Set(Object.values(QuestionType));

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseSuggestedFlashcardIds(value: unknown) {
  const values = Array.isArray(value) ? value : [];
  const seen = new Set<string>();

  return values.filter((item): item is string => {
    if (typeof item !== "string") {
      return false;
    }

    const cleaned = item.trim();

    if (!cleaned || seen.has(cleaned)) {
      return false;
    }

    seen.add(cleaned);
    return true;
  });
}

export function parseQuestionInput(body: Record<string, unknown>):
  | { ok: true; input: QuestionInput }
  | { ok: false; error: string } {
  const prompt = clean(body.prompt);
  const helper = clean(body.helper);
  const type = clean(body.type);
  const choices = parseLineList(body.choices);
  const acceptedAnswers = parseLineList(body.acceptedAnswers);
  const tiles = parseLineList(body.tiles);
  const correctAnswer = clean(body.correctAnswer);
  const explanation = clean(body.explanation);
  const required = body.required === false || body.required === "false" ? false : true;
  const publicationStatus = clean(body.publicationStatus);
  const suggestedFlashcardIds = parseSuggestedFlashcardIds(body.suggestedFlashcardIds);

  if (!prompt || !explanation) {
    return {
      ok: false,
      error: "Prompt and explanation are required."
    };
  }

  if (type === QuestionType.MULTIPLE_CHOICE && choices.length === 0) {
    return {
      ok: false,
      error: "At least one choice is required."
    };
  }

  if (!correctAnswer) {
    return {
      ok: false,
      error: "Correct answer is required."
    };
  }

  if (type === QuestionType.MULTIPLE_CHOICE && !choices.includes(correctAnswer)) {
    return {
      ok: false,
      error: "Correct answer must match one of the choices exactly for multiple choice."
    };
  }

  if (type === QuestionType.WORD_ORDERING) {
    const effectiveTiles = tiles.length > 0 ? tiles : choices;

    if (effectiveTiles.length === 0) {
      return {
        ok: false,
        error: "Word ordering requires word tiles."
      };
    }
  }

  if (type === QuestionType.FILL_IN_BLANK && choices.length > 0 && !choices.includes(correctAnswer)) {
    return {
      ok: false,
      error: "Fill-in choices are optional, but if provided they must include the correct answer."
    };
  }

  if (!questionTypes.has(type as QuestionType)) {
    return {
      ok: false,
      error: "Question type is invalid."
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
      type: type as QuestionType,
      prompt,
      helper: helper || null,
      choices: serializeQuestionOptions({
        choices,
        acceptedAnswers,
        tiles: type === QuestionType.WORD_ORDERING ? tiles : []
      }),
      correctAnswer,
      explanation,
      required,
      publicationStatus: publicationStatus as PublicationStatus,
      suggestedFlashcardIds
    }
  };
}
