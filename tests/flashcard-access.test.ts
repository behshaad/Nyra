import { describe, expect, it } from "vitest";
import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";
import {
  canCreateFlashcardInDeck,
  canDeleteLearnerFlashcardDeck
} from "@/lib/flashcards/flashcard-access";

describe("flashcard deck access", () => {
  it("allows admins to create cards in admin decks", () => {
    expect(
      canCreateFlashcardInDeck({
        actorOwnerType: FlashcardDeckOwnerType.ADMIN,
        learnerProfileId: null,
        deck: {
          ownerType: FlashcardDeckOwnerType.ADMIN,
          learnerProfileId: null
        }
      })
    ).toBe(true);
  });

  it("prevents learners from creating cards in admin decks", () => {
    expect(
      canCreateFlashcardInDeck({
        actorOwnerType: FlashcardDeckOwnerType.LEARNER,
        learnerProfileId: "learner-1",
        deck: {
          ownerType: FlashcardDeckOwnerType.ADMIN,
          learnerProfileId: null
        }
      })
    ).toBe(false);
  });

  it("allows learners to create cards only in their own learner decks", () => {
    expect(
      canCreateFlashcardInDeck({
        actorOwnerType: FlashcardDeckOwnerType.LEARNER,
        learnerProfileId: "learner-1",
        deck: {
          ownerType: FlashcardDeckOwnerType.LEARNER,
          learnerProfileId: "learner-1"
        }
      })
    ).toBe(true);
    expect(
      canCreateFlashcardInDeck({
        actorOwnerType: FlashcardDeckOwnerType.LEARNER,
        learnerProfileId: "learner-1",
        deck: {
          ownerType: FlashcardDeckOwnerType.LEARNER,
          learnerProfileId: "learner-2"
        }
      })
    ).toBe(false);
  });

  it("allows learners to delete only their own learner decks", () => {
    expect(
      canDeleteLearnerFlashcardDeck({
        learnerProfileId: "learner-1",
        deck: {
          ownerType: FlashcardDeckOwnerType.LEARNER,
          learnerProfileId: "learner-1"
        }
      })
    ).toBe(true);
    expect(
      canDeleteLearnerFlashcardDeck({
        learnerProfileId: "learner-1",
        deck: {
          ownerType: FlashcardDeckOwnerType.ADMIN,
          learnerProfileId: null
        }
      })
    ).toBe(false);
    expect(
      canDeleteLearnerFlashcardDeck({
        learnerProfileId: "learner-1",
        deck: {
          ownerType: FlashcardDeckOwnerType.LEARNER,
          learnerProfileId: "learner-2"
        }
      })
    ).toBe(false);
  });
});
