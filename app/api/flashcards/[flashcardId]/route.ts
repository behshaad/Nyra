import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { recordAdminAudit } from "@/lib/admin/audit-log";
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
  const publicationStatus =
    typeof body.publicationStatus === "string"
      ? body.publicationStatus.trim()
      : "";

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

  if (flashcard.deck.ownerType === FlashcardDeckOwnerType.ADMIN) {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
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

    await recordAdminAudit(request, {
      action: "flashcard.archive",
      entityType: "Flashcard",
      entityId: updated.id,
      summary: `Archived Flashcard in admin deck ${flashcard.deck.id}`,
      before: flashcard,
      after: updated
    });

    return NextResponse.json({
      id: updated.id,
      publicationStatus: updated.publicationStatus
    });
  }

  const parsed = parseFlashcardUpdateInput(body, {
    requireRichContent: flashcard.deck.ownerType === FlashcardDeckOwnerType.ADMIN
  });

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const canEdit = canCreateFlashcardInDeck({
    actorIsAdmin: flashcard.deck.ownerType === FlashcardDeckOwnerType.ADMIN,
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

  if (flashcard.deck.ownerType === FlashcardDeckOwnerType.ADMIN) {
    await recordAdminAudit(request, {
      action: "flashcard.update",
      entityType: "Flashcard",
      entityId: updated.id,
      summary: `Updated Flashcard in admin deck ${flashcard.deck.id}`,
      before: flashcard,
      after: updated
    });
  }

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
  request: Request,
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

  if (flashcard.deck.ownerType === FlashcardDeckOwnerType.ADMIN) {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
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
