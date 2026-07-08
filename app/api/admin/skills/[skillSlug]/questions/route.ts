import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { parseQuestionInput } from "@/lib/admin/question-validation";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      skillSlug: string;
    }>;
  }
) {
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

  const nextOrder = (skill.questions[0]?.order ?? 0) + 1;
  const question = await db.question.create({
    data: {
      ...parsed.input,
      order: nextOrder,
      skillId: skill.id
    }
  });

  return NextResponse.json({
    questionId: question.id,
    skillSlug: skill.slug
  });
}
