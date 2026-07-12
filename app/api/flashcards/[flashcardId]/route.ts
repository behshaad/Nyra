import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import {
  FlashcardDeckOwnerType,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import {
  canCreateFlashcardInDeck,
  canArchiveAdminFlashcardDeck,
  canDeleteLearnerFlashcardDeck
} from "@/lib/flashcards/flashcard-access";
import { getDevLearnerProfileId } from "@/lib/flashcards/flashcard-repository";
import { parseFlashcardUpdateInput } from "@/lib/flashcards/flashcard-validation";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      flashcardId: string;
    }>;
  }
) {
  const { flashcardId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const publicationStatus = clean(body.publicationStatus);
  const actorOwnerType = clean(body.actorOwnerType) || FlashcardDeckOwnerType.LEARNER;

  if (!Object.values(FlashcardDeckOwnerType).includes(actorOwnerType as FlashcardDeckOwnerType)) {
    return NextResponse.json(
      { error: "Flashcard actor owner type is invalid." },
      { status: 400 }
    );
  }

  const db = getPrisma();
  const learnerProfileId = await getDevLearnerProfileId();
  const flashcard = await db.flashcard.findUnique({
    where: {
      id: flashcardId
    },
    include: {
      deck: {
        select: {
          id: true,
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

  if (publicationStatus === PublicationStatus.ARCHIVED) {
    if (!canArchiveAdminFlashcardDeck(flashcard.deck)) {
      return NextResponse.json(
        { error: "Personal Flashcards can be deleted, not archived." },
        { status: 403 }
      );
    }

    const updated = await db.flashcard.update({
      where: {
        id: flashcard.id
      },
      data: {
        publicationStatus
      }
    });

    return NextResponse.json({
      id: updated.id,
      publicationStatus: updated.publicationStatus
    });
  }

  const parsed = parseFlashcardUpdateInput(body, {
    requireRichContent: actorOwnerType === FlashcardDeckOwnerType.ADMIN
  });

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const canEdit = canCreateFlashcardInDeck({
    actorOwnerType: actorOwnerType as FlashcardDeckOwnerType,
    learnerProfileId,
    deck: flashcard.deck
  });

  if (!canEdit) {
    return NextResponse.json(
      { error: "You cannot edit this Flashcard." },
      { status: 403 }
    );
  }

  const updated = await db.flashcard.update({
    where: {
      id: flashcard.id
    },
    data: parsed.input
  });

  return NextResponse.json({
    id: updated.id,
    deckId: updated.deckId,
    front: updated.front,
    back: updated.back,
    article: updated.article,
    example: updated.example,
    exampleMeaning: updated.exampleMeaning,
    pronunciation: updated.pronunciation,
    pronunciationAudioUrl: updated.pronunciationAudioUrl,
    difficulty: updated.difficulty,
    publicationStatus: updated.publicationStatus,
    notes: updated.notes
  });
}

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
