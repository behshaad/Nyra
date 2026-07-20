import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";
import {
  FlashcardDeckOwnerType,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import { parseQuestionInput } from "@/lib/admin/question-validation";
import { recordAdminAudit } from "@/lib/admin/audit-log";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;

  const { questionId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseQuestionInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getPrisma();
  const current = await db.question.findUnique({
    where: {
      id: questionId
    },
    include: {
      skill: true
    }
  });

  if (!current) {
    return NextResponse.json(
      { error: "Question was not found." },
      { status: 404 }
    );
  }

  const { suggestedFlashcardIds, ...questionInput } = parsed.input;
  const validSuggestionCount =
    suggestedFlashcardIds.length === 0
      ? 0
      : await db.flashcard.count({
          where: {
            id: {
              in: suggestedFlashcardIds
            },
            publicationStatus: PublicationStatus.PUBLISHED,
            deck: {
              ownerType: FlashcardDeckOwnerType.ADMIN,
              publicationStatus: PublicationStatus.PUBLISHED
            }
          }
        });

  if (validSuggestionCount !== suggestedFlashcardIds.length) {
    return NextResponse.json(
      { error: "Suggested Flashcards must come from Published admin decks." },
      { status: 400 }
    );
  }

  const question = await db.$transaction(async (tx) => {
    const updated = await tx.question.update({
      where: {
        id: current.id
      },
      data: questionInput
    });

    await tx.questionSuggestedFlashcard.deleteMany({
      where: {
        questionId: current.id
      }
    });

    if (suggestedFlashcardIds.length > 0) {
      await tx.questionSuggestedFlashcard.createMany({
        data: suggestedFlashcardIds.map((flashcardId, index) => ({
          questionId: current.id,
          flashcardId,
          order: index + 1
        }))
      });
    }

    return updated;
  });

  await recordAdminAudit(request, {
    action: "question.update",
    entityType: "Question",
    entityId: question.id,
    summary: `Updated Question in Skill ${current.skill.slug}`,
    before: current,
    after: question
  });

  return NextResponse.json({
    questionId: question.id,
    skillSlug: current.skill.slug
  });
}
