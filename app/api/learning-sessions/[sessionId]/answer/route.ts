import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { QuestionEngine } from "@/lib/question-engine";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      sessionId: string;
    }>;
  }
) {
  const { sessionId } = await context.params;
  const body = (await request.json()) as {
    submittedAnswer?: string;
  };

  if (!body.submittedAnswer) {
    return NextResponse.json(
      { error: "submittedAnswer is required." },
      { status: 400 }
    );
  }

  const engine = new QuestionEngine(getPrisma());
  const feedback = await engine.submitAnswer({
    sessionId,
    submittedAnswer: body.submittedAnswer
  });

  return NextResponse.json(feedback);
}
