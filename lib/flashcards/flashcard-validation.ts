import {
  FlashcardDeckOwnerType,
  FlashcardDifficulty,
  PublicationStatus
} from "@/lib/generated/prisma/enums";

export type FlashcardDeckInput = {
  title: string;
  slug: string;
  description: string;
  levelLabel: string;
  category: string;
  iconKey: FlashcardDeckIconKey;
  colorKey: FlashcardDeckColorKey;
  ownerType: FlashcardDeckOwnerType;
  publicationStatus: PublicationStatus;
  unitId: string | null;
};

export type FlashcardDeckUpdateInput = {
  title: string;
  description: string;
  iconKey: FlashcardDeckIconKey;
  colorKey: FlashcardDeckColorKey;
};

export type FlashcardInput = {
  deckId: string;
  front: string;
  back: string;
  article: string | null;
  example: string;
  exampleMeaning: string;
  pronunciation: string | null;
  pronunciationAudioUrl: string | null;
  difficulty: FlashcardDifficulty;
  publicationStatus: PublicationStatus;
  notes: string | null;
};

export type FlashcardUpdateInput = Omit<FlashcardInput, "deckId">;

export const flashcardDeckIconKeys = [
  "layers-3",
  "book-open",
  "sparkles",
  "graduation-cap",
  "pen-line",
  "message-circle"
] as const;

export const flashcardDeckColorKeys = [
  "teal",
  "rose",
  "amber",
  "indigo",
  "emerald",
  "slate"
] as const;

export type FlashcardDeckIconKey = (typeof flashcardDeckIconKeys)[number];
export type FlashcardDeckColorKey = (typeof flashcardDeckColorKeys)[number];

const ownerTypes = new Set(Object.values(FlashcardDeckOwnerType));
const publicationStatuses = new Set(Object.values(PublicationStatus));
const difficulties = new Set(Object.values(FlashcardDifficulty));
const deckIconKeys = new Set<string>(flashcardDeckIconKeys);
const deckColorKeys = new Set<string>(flashcardDeckColorKeys);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown) {
  const cleaned = clean(value);

  return cleaned.length > 0 ? cleaned : null;
}

export function optionalAudioUrl(value: unknown) {
  const cleaned = optionalString(value);

  if (!cleaned) {
    return null;
  }

  if (
    cleaned.startsWith("/") ||
    cleaned.startsWith("https://") ||
    cleaned.startsWith("http://")
  ) {
    return cleaned;
  }

  return null;
}

function iconKey(value: unknown): FlashcardDeckIconKey {
  const cleaned = clean(value);

  return deckIconKeys.has(cleaned)
    ? (cleaned as FlashcardDeckIconKey)
    : "layers-3";
}

function colorKey(value: unknown): FlashcardDeckColorKey {
  const cleaned = clean(value);

  return deckColorKeys.has(cleaned)
    ? (cleaned as FlashcardDeckColorKey)
    : "teal";
}

function isSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function parseFlashcardDeckInput(body: Record<string, unknown>):
  | { ok: true; input: FlashcardDeckInput }
  | { ok: false; error: string } {
  const title = clean(body.title);
  const slug = clean(body.slug).toLowerCase();
  const description = clean(body.description);
  const levelLabel = clean(body.levelLabel) || "A1";
  const category = clean(body.category) || "Custom";
  const deckIconKey = iconKey(body.iconKey);
  const deckColorKey = colorKey(body.colorKey);
  const ownerType = clean(body.ownerType) || FlashcardDeckOwnerType.LEARNER;
  const publicationStatus =
    clean(body.publicationStatus) || PublicationStatus.PUBLISHED;
  const unitId = optionalString(body.unitId);

  if (!title || !slug || !description) {
    return {
      ok: false,
      error: "Title, slug, and description are required."
    };
  }

  if (!isSlug(slug)) {
    return {
      ok: false,
      error: "Slug must use lowercase letters, numbers, and hyphens."
    };
  }

  if (!ownerTypes.has(ownerType as FlashcardDeckOwnerType)) {
    return {
      ok: false,
      error: "Flashcard deck owner type is invalid."
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
      title,
      slug,
      description,
      levelLabel,
      category,
      iconKey: deckIconKey,
      colorKey: deckColorKey,
      ownerType: ownerType as FlashcardDeckOwnerType,
      publicationStatus: publicationStatus as PublicationStatus,
      unitId
    }
  };
}

export function parseFlashcardDeckUpdateInput(body: Record<string, unknown>):
  | { ok: true; input: FlashcardDeckUpdateInput }
  | { ok: false; error: string } {
  const title = clean(body.title);
  const description = clean(body.description);
  const deckIconKey = iconKey(body.iconKey);
  const deckColorKey = colorKey(body.colorKey);

  if (!title) {
    return {
      ok: false,
      error: "Title is required."
    };
  }

  return {
    ok: true,
    input: {
      title,
      description,
      iconKey: deckIconKey,
      colorKey: deckColorKey
    }
  };
}

function parseFlashcardContentInput(body: Record<string, unknown>, options?: {
  requireRichContent?: boolean;
}):
  | { ok: true; input: FlashcardUpdateInput }
  | { ok: false; error: string } {
  const front = clean(body.front);
  const back = clean(body.back);
  const article = optionalString(body.article);
  const example = clean(body.example);
  const exampleMeaning = clean(body.exampleMeaning);
  const pronunciation = optionalString(body.pronunciation);
  const pronunciationAudioUrl = optionalAudioUrl(body.pronunciationAudioUrl);
  const difficulty = clean(body.difficulty) || FlashcardDifficulty.MEDIUM;
  const publicationStatus =
    clean(body.publicationStatus) || PublicationStatus.PUBLISHED;
  const notes = optionalString(body.notes);

  if (!front || !back) {
    return {
      ok: false,
      error: "Front and back are required."
    };
  }

  if (options?.requireRichContent && (!example || !exampleMeaning)) {
    return {
      ok: false,
      error: "Example and example meaning are required."
    };
  }

  if (!difficulties.has(difficulty as FlashcardDifficulty)) {
    return {
      ok: false,
      error: "Flashcard difficulty is invalid."
    };
  }

  if (!publicationStatuses.has(publicationStatus as PublicationStatus)) {
    return {
      ok: false,
      error: "Publication status is invalid."
    };
  }

  if (clean(body.pronunciationAudioUrl) && !pronunciationAudioUrl) {
    return {
      ok: false,
      error: "Pronunciation audio must be a site path or URL."
    };
  }

  return {
    ok: true,
    input: {
      front,
      back,
      article,
      example,
      exampleMeaning,
      pronunciation,
      pronunciationAudioUrl,
      difficulty: difficulty as FlashcardDifficulty,
      publicationStatus: publicationStatus as PublicationStatus,
      notes
    }
  };
}

export function parseFlashcardInput(
  body: Record<string, unknown>,
  options?: {
    requireRichContent?: boolean;
  }
):
  | { ok: true; input: FlashcardInput }
  | { ok: false; error: string } {
  const deckId = clean(body.deckId);

  if (!deckId) {
    return {
      ok: false,
      error: "Deck is required."
    };
  }

  const parsed = parseFlashcardContentInput(body, options);

  if (!parsed.ok) {
    return parsed;
  }

  return {
    ok: true,
    input: {
      deckId,
      ...parsed.input
    }
  };
}

export function parseFlashcardUpdateInput(
  body: Record<string, unknown>,
  options?: {
    requireRichContent?: boolean;
  }
) {
  return parseFlashcardContentInput(body, options);
}
