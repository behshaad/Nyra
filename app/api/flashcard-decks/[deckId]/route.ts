import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";
import { PublicationStatus } from "@/lib/generated/prisma/enums";
import {
  canArchiveAdminFlashcardDeck,
  canDeleteLearnerFlashcardDeck
} from "@/lib/flashcards/flashcard-access";
import { getDevLearnerProfileId } from "@/lib/flashcards/flashcard-repository";
import { parseFlashcardDeckUpdateInput } from "@/lib/flashcards/flashcard-validation";

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
  const parsedUpdate = parseFlashcardDeckUpdateInput(body);

  const db = getPrisma();
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

  if (deck.ownerType === "ADMIN") {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
  }

  if (publicationStatus === PublicationStatus.ARCHIVED) {
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

  if (!parsedUpdate.ok) {
    return NextResponse.json({ error: parsedUpdate.error }, { status: 400 });
  }

  const learnerProfileId = await getDevLearnerProfileId();

  if (!canDeleteLearnerFlashcardDeck({ learnerProfileId, deck })) {
    return NextResponse.json(
      { error: "You cannot edit this Flashcard Deck." },
      { status: 403 }
    );
  }

  const updated = await db.flashcardDeck.update({
    where: {
      id: deck.id
    },
    data: parsedUpdate.input
  });

  return NextResponse.json({
    id: updated.id,
    slug: updated.slug,
    title: updated.title,
    description: updated.description,
    levelLabel: updated.levelLabel,
    category: updated.category,
    iconKey: updated.iconKey,
    colorKey: updated.colorKey,
    ownerType: updated.ownerType,
    publicationStatus: updated.publicationStatus,
    unitId: updated.unitId
  });
}

export async function DELETE(
  request: Request,
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

  if (deck.ownerType === "ADMIN") {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
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
