import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { recordAdminAudit } from "@/lib/admin/audit-log";
import { getPrisma } from "@/lib/db/prisma";
import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";
import { canCreateFlashcardInDeck } from "@/lib/flashcards/flashcard-access";
import {
  createFlashcard,
  getDevLearnerProfileId
} from "@/lib/flashcards/flashcard-repository";
import { parseFlashcardInput } from "@/lib/flashcards/flashcard-validation";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const db = getPrisma();
  const deckId = typeof body.deckId === "string" ? body.deckId.trim() : "";

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
      { status: 400 }
    );
  }

  let learnerProfileId: string | null = null;

  if (deck.ownerType === FlashcardDeckOwnerType.ADMIN) {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
  } else {
    learnerProfileId = await getDevLearnerProfileId();
  }

  const parsed = parseFlashcardInput(body, {
    requireRichContent: deck.ownerType === FlashcardDeckOwnerType.ADMIN
  });

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const canCreate = canCreateFlashcardInDeck({
    actorIsAdmin: deck.ownerType === FlashcardDeckOwnerType.ADMIN,
    learnerProfileId,
    deck
  });

  if (!canCreate) {
    return NextResponse.json(
      { error: "You cannot add Flashcards to this deck." },
      { status: 403 }
    );
  }

  const card = await createFlashcard(parsed.input);

  if (deck.ownerType === FlashcardDeckOwnerType.ADMIN) {
    await recordAdminAudit(request, {
      action: "flashcard.create",
      entityType: "Flashcard",
      entityId: card.id,
      summary: `Created Flashcard in admin deck ${deck.id}`,
      after: card
    });
  }

  return NextResponse.json(
    {
      id: card.id,
      deckId: card.deckId,
      front: card.front,
      back: card.back,
      article: card.article,
      example: card.example,
      exampleMeaning: card.exampleMeaning,
      pronunciation: card.pronunciation,
      pronunciationAudioUrl: card.pronunciationAudioUrl,
      difficulty: card.difficulty,
      publicationStatus: card.publicationStatus,
      notes: card.notes
    },
    { status: 201 }
  );
}
