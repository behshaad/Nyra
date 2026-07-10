import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { canDeleteLearnerFlashcardDeck } from "@/lib/flashcards/flashcard-access";
import { getDevLearnerProfileId } from "@/lib/flashcards/flashcard-repository";

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      flashcardId: string;
    }>;
  }
) {
  const { flashcardId } = await context.params;
  const db = getPrisma();
  const learnerProfileId = await getDevLearnerProfileId();
  const flashcard = await db.flashcard.findUnique({
    where: {
      id: flashcardId
    },
    include: {
      deck: {
        select: {
          ownerType: true,
          learnerProfileId: true
        }
      }
    }
  });

  if (!flashcard) {
    return NextResponse.json(
      { error: "Flashcard was not found." },
      { status: 404 }
    );
  }

  if (!canDeleteLearnerFlashcardDeck({ learnerProfileId, deck: flashcard.deck })) {
    return NextResponse.json(
      { error: "You cannot delete this Flashcard." },
      { status: 403 }
    );
  }

  await db.flashcard.delete({
    where: {
      id: flashcard.id
    }
  });

  return NextResponse.json({
    deleted: true
  });
}
