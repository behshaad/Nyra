import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";
import {
  FlashcardDeckOwnerType,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import { parseQuestionInput } from "@/lib/admin/question-validation";
import { recordAdminAudit } from "@/lib/admin/audit-log";
import { canEditDraftContent, draftRevisionRequiredMessage } from "@/lib/admin/content-editability";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      skillSlug: string;
    }>;
  }
) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;

  const { skillSlug } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseQuestionInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getPrisma();
  const skill = await db.skill.findUnique({
    where: {
      slug: skillSlug
    },
    include: {
      questions: {
        select: {
          order: true
        },
        orderBy: {
          order: "desc"
        },
        take: 1
      }
    }
  });

  if (!skill) {
    return NextResponse.json(
      { error: "Skill was not found." },
      { status: 404 }
    );
  }

  if (
    !canEditDraftContent({ aggregateStatus: skill.publicationStatus }) ||
    parsed.input.publicationStatus !== PublicationStatus.DRAFT
  ) {
    return NextResponse.json({ error: draftRevisionRequiredMessage }, { status: 409 });
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

  const nextOrder = (skill.questions[0]?.order ?? 0) + 1;
  const question = await db.$transaction(async (tx) => {
    const created = await tx.question.create({
      data: {
        ...questionInput,
        order: nextOrder,
        skillId: skill.id
      }
    });

    if (suggestedFlashcardIds.length > 0) {
      await tx.questionSuggestedFlashcard.createMany({
        data: suggestedFlashcardIds.map((flashcardId, index) => ({
          questionId: created.id,
          flashcardId,
          order: index + 1
        }))
      });
    }

    return created;
  });

  await recordAdminAudit(request, {
    action: "question.create",
    entityType: "Question",
    entityId: question.id,
    summary: `Created Question in Skill ${skill.slug}`,
    after: question
  });

  return NextResponse.json({
    questionId: question.id,
    skillSlug: skill.slug
  });
}
