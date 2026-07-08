import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { parseQuestionInput } from "@/lib/admin/question-validation";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
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

  const question = await db.question.update({
    where: {
      id: current.id
    },
    data: parsed.input
  });

  return NextResponse.json({
    questionId: question.id,
    skillSlug: current.skill.slug
  });
}
