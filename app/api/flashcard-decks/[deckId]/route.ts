import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { PublicationStatus } from "@/lib/generated/prisma/enums";
import {
  canArchiveAdminFlashcardDeck,
  canDeleteLearnerFlashcardDeck
} from "@/lib/flashcards/flashcard-access";
import { getDevLearnerProfileId } from "@/lib/flashcards/flashcard-repository";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      deckId: string;
    }>;
  }
) {
  const { deckId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const publicationStatus = clean(body.publicationStatus);

  if (publicationStatus !== PublicationStatus.ARCHIVED) {
    return NextResponse.json(
      { error: "Only archive is supported for admin Flashcard Decks." },
      { status: 400 }
    );
  }

  const db = getPrisma();
  const deck = await db.flashcardDeck.findUnique({
    where: {
      id: deckId
    },
    select: {
      id: true,
      ownerType: true
    }
  });

  if (!deck) {
    return NextResponse.json(
      { error: "Flashcard deck was not found." },
      { status: 404 }
    );
  }

  if (!canArchiveAdminFlashcardDeck(deck)) {
    return NextResponse.json(
      { error: "Personal Flashcard Decks can be deleted, not archived." },
      { status: 403 }
    );
  }

  const updated = await db.flashcardDeck.update({
    where: {
      id: deck.id
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
