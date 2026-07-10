import {
  FlashcardDeckOwnerType,
  FlashcardReviewResult,
  ProgressEventType,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";
import { getDevLearnerProfileId } from "@/lib/flashcards/flashcard-repository";

export const intervalDaysByStep = [0, 1, 3, 7, 14, 30, 60] as const;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

export function nextKnownStep(currentStep: number) {
  return Math.min(currentStep + 1, intervalDaysByStep.length - 1);
}

export function getNextReviewSchedule(input: {
  result: FlashcardReviewResult;
  currentStep: number;
  reviewedAt: Date;
}) {
  const intervalStep =
    input.result === FlashcardReviewResult.KNOWN
      ? nextKnownStep(input.currentStep)
      : 0;
  const dueAt =
    input.result === FlashcardReviewResult.KNOWN
      ? addDays(input.reviewedAt, intervalDaysByStep[intervalStep])
      : input.reviewedAt;

  return {
    intervalStep,
    dueAt
  };
}

export async function reviewFlashcard(input: {
  flashcardId: string;
  result: FlashcardReviewResult;
}) {
  const db = getPrisma();
  const learnerProfileId = await getDevLearnerProfileId();

  if (!learnerProfileId) {
    throw new Error("Development learner is missing. Run npm run db:seed.");
  }

  return db.$transaction(async (tx) => {
    const flashcard = await tx.flashcard.findUnique({
      where: {
        id: input.flashcardId
      },
      include: {
        deck: true
      }
    });

    if (!flashcard) {
      throw new Error("Flashcard was not found.");
    }

    const canReview =
      (flashcard.deck.ownerType === FlashcardDeckOwnerType.ADMIN &&
        flashcard.deck.publicationStatus === PublicationStatus.PUBLISHED &&
        flashcard.publicationStatus === PublicationStatus.PUBLISHED) ||
      (flashcard.deck.ownerType === FlashcardDeckOwnerType.LEARNER &&
        flashcard.deck.learnerProfileId === learnerProfileId &&
        flashcard.publicationStatus === PublicationStatus.PUBLISHED);

    if (!canReview) {
      throw new Error("Flashcard is not available for this learner.");
    }

    const now = new Date();
    const existing = await tx.flashcardReviewState.findUnique({
      where: {
        learnerProfileId_flashcardId: {
          learnerProfileId,
          flashcardId: input.flashcardId
        }
      }
    });
    const schedule = getNextReviewSchedule({
      result: input.result,
      currentStep: existing?.intervalStep ?? 0,
      reviewedAt: now
    });

    const state = await tx.flashcardReviewState.upsert({
      where: {
        learnerProfileId_flashcardId: {
          learnerProfileId,
          flashcardId: input.flashcardId
        }
      },
      create: {
        learnerProfileId,
        flashcardId: input.flashcardId,
        intervalStep: schedule.intervalStep,
        dueAt: schedule.dueAt,
        lastReviewedAt: now,
        reviewCount: 1,
        knownCount: input.result === FlashcardReviewResult.KNOWN ? 1 : 0,
        unknownCount: input.result === FlashcardReviewResult.UNKNOWN ? 1 : 0
      },
      update: {
        intervalStep: schedule.intervalStep,
        dueAt: schedule.dueAt,
        lastReviewedAt: now,
        reviewCount: {
          increment: 1
        },
        knownCount:
          input.result === FlashcardReviewResult.KNOWN
            ? {
                increment: 1
              }
            : undefined,
        unknownCount:
          input.result === FlashcardReviewResult.UNKNOWN
            ? {
                increment: 1
              }
            : undefined
      }
    });

    await tx.progressEvent.create({
      data: {
        learnerProfileId,
        type: ProgressEventType.FLASHCARD_REVIEWED,
        metadata: {
          flashcardId: input.flashcardId,
          deckId: flashcard.deckId,
          result: input.result,
          intervalStep: schedule.intervalStep,
          dueAt: schedule.dueAt.toISOString()
        }
      }
    });

    return {
      flashcardId: input.flashcardId,
      result: input.result,
      intervalStep: state.intervalStep,
      dueAt: state.dueAt,
      reviewCount: state.reviewCount,
      knownCount: state.knownCount,
      unknownCount: state.unknownCount
    };
  });
}

export { FlashcardReviewResult };
