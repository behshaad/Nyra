import {
  FlashcardDeckOwnerType,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import { getAuthSession } from "@/lib/auth/server";
import { resolveLearnerAuthUserId } from "@/lib/auth/learner-access";
import { getPrisma } from "@/lib/db/prisma";
import type {
  FlashcardDeckInput,
  FlashcardInput
} from "@/lib/flashcards/flashcard-validation";

type FlashcardReviewStateSummary = {
  dueAt: Date;
  intervalStep: number;
};

export async function getDevLearnerProfileId() {
  const db = getPrisma();
  const session = await getAuthSession();
  const authUserId = resolveLearnerAuthUserId(session?.id);

  if (!authUserId) {
    return null;
  }

  const learnerProfile = await db.learnerProfile.findUnique({
    where: {
      authUserId
    },
    select: {
      id: true
    }
  });

  return learnerProfile?.id ?? null;
}

export async function getLearnerFlashcardDecks() {
  const db = getPrisma();
  const learnerProfileId = await getDevLearnerProfileId();
  const now = new Date();

  return db.flashcardDeck.findMany({
    where: {
      OR: [
        {
          ownerType: FlashcardDeckOwnerType.ADMIN,
          publicationStatus: PublicationStatus.PUBLISHED
        },
        ...(learnerProfileId
          ? [
              {
                ownerType: FlashcardDeckOwnerType.LEARNER,
                learnerProfileId
              }
            ]
          : [])
      ]
    },
    include: {
      unit: true,
      flashcards: {
        where: {
          publicationStatus: PublicationStatus.PUBLISHED
        },
        ...(learnerProfileId
          ? {
              include: {
                reviewStates: {
                  where: {
                    learnerProfileId
                  }
                }
              }
            }
          : {}),
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: [
      {
        levelLabel: "asc"
      },
      {
        category: "asc"
      },
      {
        title: "asc"
      }
    ]
  }).then((decks) =>
    decks.map((deck) => ({
      ...deck,
      flashcards: deck.flashcards.map((flashcard) => {
        const flashcardWithReviewStates = flashcard as typeof flashcard & {
          reviewStates?: FlashcardReviewStateSummary[];
        };
        const reviewState = flashcardWithReviewStates.reviewStates?.[0] ?? null;

        return {
          ...flashcard,
          reviewState,
          isDue: !reviewState || reviewState.dueAt <= now
        };
      })
    }))
  );
}

export async function getAdminFlashcardDecks() {
  const db = getPrisma();

  return db.flashcardDeck.findMany({
    include: {
      unit: true,
      learnerProfile: true,
      flashcards: {
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function getFlashcardDeckOptions() {
  const decks = await getAdminFlashcardDecks();

  return decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    levelLabel: deck.levelLabel,
    category: deck.category,
    ownerType: deck.ownerType
  }));
}

export async function getFlashcardUnitOptions() {
  const db = getPrisma();

  return db.unit.findMany({
    include: {
      level: true
    },
    orderBy: {
      order: "asc"
    }
  });
}

export async function createFlashcardDeck(
  input: FlashcardDeckInput,
  learnerProfileId?: string | null
) {
  const db = getPrisma();
  const ownerLearnerProfileId =
    input.ownerType === FlashcardDeckOwnerType.LEARNER
      ? learnerProfileId ?? await getDevLearnerProfileId()
      : null;

  if (input.ownerType === FlashcardDeckOwnerType.LEARNER && !ownerLearnerProfileId) {
    throw new Error("Authentication is required to create a personal Flashcard Deck.");
  }

  return db.flashcardDeck.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      levelLabel: input.levelLabel,
      category: input.category,
      iconKey: input.iconKey,
      colorKey: input.colorKey,
      ownerType: input.ownerType,
      publicationStatus: input.publicationStatus,
      learnerProfileId: ownerLearnerProfileId,
      unitId: input.unitId
    }
  });
}

export async function createFlashcard(input: FlashcardInput) {
  const db = getPrisma();
  const lastCard = await db.flashcard.findFirst({
    where: {
      deckId: input.deckId
    },
    orderBy: {
      order: "desc"
    },
    select: {
      order: true
    }
  });

  return db.flashcard.create({
    data: {
      deckId: input.deckId,
      order: (lastCard?.order ?? 0) + 1,
      front: input.front,
      back: input.back,
      article: input.article,
      example: input.example,
      exampleMeaning: input.exampleMeaning,
      pronunciation: input.pronunciation,
      pronunciationAudioUrl: input.pronunciationAudioUrl,
      difficulty: input.difficulty,
      publicationStatus: input.publicationStatus,
      notes: input.notes
    }
  });
}
