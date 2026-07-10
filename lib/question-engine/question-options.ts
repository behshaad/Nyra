export type QuestionOptions = {
  choices: string[];
  acceptedAnswers: string[];
  tiles: string[];
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

export function parseLineList(value: unknown) {
  if (Array.isArray(value)) {
    return cleanStringArray(value);
  }

  return cleanString(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function questionOptionsFrom(value: unknown): QuestionOptions {
  if (Array.isArray(value)) {
    return {
      choices: cleanStringArray(value),
      acceptedAnswers: [],
      tiles: []
    };
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return {
      choices: cleanStringArray(record.choices ?? record.options),
      acceptedAnswers: cleanStringArray(record.acceptedAnswers),
      tiles: cleanStringArray(record.tiles)
    };
  }

  return {
    choices: [],
    acceptedAnswers: [],
    tiles: []
  };
}

export function serializeQuestionOptions(input: {
  choices: string[];
  acceptedAnswers?: string[];
  tiles?: string[];
}) {
  const acceptedAnswers = input.acceptedAnswers ?? [];
  const tiles = input.tiles ?? [];

  if (acceptedAnswers.length === 0 && tiles.length === 0) {
    return input.choices;
  }

  return {
    choices: input.choices,
    acceptedAnswers,
    tiles
  };
}
