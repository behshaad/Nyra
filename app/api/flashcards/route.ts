import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";
import { canCreateFlashcardInDeck } from "@/lib/flashcards/flashcard-access";
import {
  createFlashcard,
  getDevLearnerProfileId
} from "@/lib/flashcards/flashcard-repository";
import { parseFlashcardInput } from "@/lib/flashcards/flashcard-validation";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseFlashcardInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getPrisma();
  const actorOwnerType = clean(body.actorOwnerType) || FlashcardDeckOwnerType.LEARNER;

  if (!Object.values(FlashcardDeckOwnerType).includes(actorOwnerType as FlashcardDeckOwnerType)) {
    return NextResponse.json(
      { error: "Flashcard actor owner type is invalid." },
      { status: 400 }
    );
  }

  const deck = await db.flashcardDeck.findUnique({
    where: {
      id: parsed.input.deckId
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

  const learnerProfileId = await getDevLearnerProfileId();
  const canCreate = canCreateFlashcardInDeck({
    actorOwnerType: actorOwnerType as FlashcardDeckOwnerType,
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

  return NextResponse.json(
    {
      id: card.id
    },
    { status: 201 }
  );
}
