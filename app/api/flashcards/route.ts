import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { createFlashcard } from "@/lib/flashcards/flashcard-repository";
import { parseFlashcardInput } from "@/lib/flashcards/flashcard-validation";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseFlashcardInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getPrisma();
  const deck = await db.flashcardDeck.findUnique({
    where: {
      id: parsed.input.deckId
    }
  });

  if (!deck) {
    return NextResponse.json(
      { error: "Flashcard deck was not found." },
      { status: 400 }
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
