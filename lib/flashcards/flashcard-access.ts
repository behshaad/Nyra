import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";

export type FlashcardDeckAccessRecord = {
  ownerType: FlashcardDeckOwnerType;
  learnerProfileId: string | null;
};

export function canCreateFlashcardInDeck(input: {
  actorOwnerType: FlashcardDeckOwnerType;
  learnerProfileId: string | null;
  deck: FlashcardDeckAccessRecord;
}) {
  if (input.actorOwnerType === FlashcardDeckOwnerType.ADMIN) {
    return input.deck.ownerType === FlashcardDeckOwnerType.ADMIN;
  }

  return (
    input.deck.ownerType === FlashcardDeckOwnerType.LEARNER &&
    Boolean(input.learnerProfileId) &&
    input.deck.learnerProfileId === input.learnerProfileId
  );
}

export function canDeleteLearnerFlashcardDeck(input: {
  learnerProfileId: string | null;
  deck: FlashcardDeckAccessRecord;
}) {
  return (
    input.deck.ownerType === FlashcardDeckOwnerType.LEARNER &&
    Boolean(input.learnerProfileId) &&
    input.deck.learnerProfileId === input.learnerProfileId
  );
}
