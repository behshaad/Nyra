import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { recordAdminAudit } from "@/lib/admin/audit-log";
import { getPrisma } from "@/lib/db/prisma";
import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";
import {
  createFlashcardDeck,
  getDevLearnerProfileId
} from "@/lib/flashcards/flashcard-repository";
import { parseFlashcardDeckInput } from "@/lib/flashcards/flashcard-validation";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const ownerType = clean(body.ownerType) || FlashcardDeckOwnerType.LEARNER;
  const parsed = parseFlashcardDeckInput(body, {
    requireDescription: ownerType === FlashcardDeckOwnerType.ADMIN
  });

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let learnerProfileId: string | null = null;

  if (parsed.input.ownerType === FlashcardDeckOwnerType.ADMIN) {
    const denied = await requireAdminApiAccess(request);
    if (denied) return denied;
  } else {
    learnerProfileId = await getDevLearnerProfileId();

    if (!learnerProfileId) {
      return NextResponse.json(
        { error: "Authentication is required." },
        { status: 401 }
      );
    }
  }

  const db = getPrisma();
  const existing = await db.flashcardDeck.findUnique({
    where: {
      slug: parsed.input.slug
    }
  });

  if (existing) {
    return NextResponse.json(
      { error: "A Flashcard deck with this slug already exists." },
      { status: 409 }
    );
  }

  if (parsed.input.unitId) {
    const unit = await db.unit.findUnique({
      where: {
        id: parsed.input.unitId
      }
    });

    if (!unit) {
      return NextResponse.json(
        { error: "Related Unit was not found." },
        { status: 400 }
      );
    }
  }

  const deck = await createFlashcardDeck(parsed.input, learnerProfileId);

  if (deck.ownerType === FlashcardDeckOwnerType.ADMIN) {
    await recordAdminAudit(request, {
      action: "flashcard_deck.create",
      entityType: "FlashcardDeck",
      entityId: deck.id,
      summary: `Created admin Flashcard Deck ${deck.slug}`,
      after: deck
    });
  }

  return NextResponse.json(
    {
      id: deck.id,
      slug: deck.slug,
      title: deck.title,
      description: deck.description,
      levelLabel: deck.levelLabel,
      category: deck.category,
      iconKey: deck.iconKey,
      colorKey: deck.colorKey,
      ownerType: deck.ownerType,
      publicationStatus: deck.publicationStatus,
      unitId: deck.unitId
    },
    { status: 201 }
  );
}
