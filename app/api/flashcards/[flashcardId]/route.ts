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
      flashcardId: string;
    }>;
  }
) {
  const { flashcardId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const publicationStatus = clean(body.publicationStatus);

  if (publicationStatus !== PublicationStatus.ARCHIVED) {
    return NextResponse.json(
      { error: "Only archive is supported for admin Flashcards." },
      { status: 400 }
    );
  }

  const db = getPrisma();
  const flashcard = await db.flashcard.findUnique({
    where: {
      id: flashcardId
    },
    include: {
      deck: {
        select: {
          ownerType: true
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
