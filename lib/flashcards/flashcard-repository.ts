import {
  FlashcardDeckOwnerType,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";
import { devAuthUserId } from "@/lib/learner/preferences";
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
  const learnerProfile = await db.learnerProfile.findUnique({
    where: {
      authUserId: devAuthUserId
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
        include: learnerProfileId
          ? {
              reviewStates: {
                where: {
                  learnerProfileId
                }
              }
            }
          : undefined,
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

export async function createFlashcardDeck(input: FlashcardDeckInput) {
  const db = getPrisma();
  const learnerProfileId =
    input.ownerType === FlashcardDeckOwnerType.LEARNER
      ? await getDevLearnerProfileId()
      : null;

  return db.flashcardDeck.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      levelLabel: input.levelLabel,
      category: input.category,
      ownerType: input.ownerType,
      publicationStatus: input.publicationStatus,
      learnerProfileId,
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
      difficulty: input.difficulty,
      notes: input.notes
    }
  });
}
