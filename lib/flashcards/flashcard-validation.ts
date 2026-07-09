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
  ownerType: FlashcardDeckOwnerType;
  publicationStatus: PublicationStatus;
  unitId: string | null;
};

export type FlashcardInput = {
  deckId: string;
  front: string;
  back: string;
  article: string | null;
  example: string;
  exampleMeaning: string;
  pronunciation: string | null;
  difficulty: FlashcardDifficulty;
  notes: string | null;
};

const ownerTypes = new Set(Object.values(FlashcardDeckOwnerType));
const publicationStatuses = new Set(Object.values(PublicationStatus));
const difficulties = new Set(Object.values(FlashcardDifficulty));

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown) {
  const cleaned = clean(value);

  return cleaned.length > 0 ? cleaned : null;
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
      ownerType: ownerType as FlashcardDeckOwnerType,
      publicationStatus: publicationStatus as PublicationStatus,
      unitId
    }
  };
}

export function parseFlashcardInput(body: Record<string, unknown>):
  | { ok: true; input: FlashcardInput }
  | { ok: false; error: string } {
  const deckId = clean(body.deckId);
  const front = clean(body.front);
  const back = clean(body.back);
  const article = optionalString(body.article);
  const example = clean(body.example);
  const exampleMeaning = clean(body.exampleMeaning);
  const pronunciation = optionalString(body.pronunciation);
  const difficulty = clean(body.difficulty) || FlashcardDifficulty.MEDIUM;
  const notes = optionalString(body.notes);

  if (!deckId || !front || !back || !example || !exampleMeaning) {
    return {
      ok: false,
      error: "Deck, front, back, example, and example meaning are required."
    };
  }

  if (!difficulties.has(difficulty as FlashcardDifficulty)) {
    return {
      ok: false,
      error: "Flashcard difficulty is invalid."
    };
  }

  return {
    ok: true,
    input: {
      deckId,
      front,
      back,
      article,
      example,
      exampleMeaning,
      pronunciation,
      difficulty: difficulty as FlashcardDifficulty,
      notes
    }
  };
}
