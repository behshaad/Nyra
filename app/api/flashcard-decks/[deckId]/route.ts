import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { canDeleteLearnerFlashcardDeck } from "@/lib/flashcards/flashcard-access";
import { getDevLearnerProfileId } from "@/lib/flashcards/flashcard-repository";

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      deckId: string;
    }>;
  }
) {
  const { deckId } = await context.params;
  const db = getPrisma();
  const learnerProfileId = await getDevLearnerProfileId();
  const deck = await db.flashcardDeck.findUnique({
    where: {
      id: deckId
    },
    select: {
      id: true,
      ownerType: true,
      learnerProfileId: true
    }
  });

  if (!deck) {
    return NextResponse.json(
      { error: "Flashcard deck was not found." },
      { status: 404 }
    );
  }

  if (!canDeleteLearnerFlashcardDeck({ learnerProfileId, deck })) {
    return NextResponse.json(
      { error: "You cannot delete this Flashcard Deck." },
      { status: 403 }
    );
  }

  await db.flashcardDeck.delete({
    where: {
      id: deck.id
    }
  });

  return NextResponse.json({
    deleted: true
  });
}
