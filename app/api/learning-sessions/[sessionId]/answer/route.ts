import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/server";
import { resolveLearnerAuthUserId } from "@/lib/auth/learner-access";
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

  const db = getPrisma();
  const authSession = await getAuthSession();
  const authUserId = resolveLearnerAuthUserId(authSession?.id);

  if (!authUserId) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 }
    );
  }

  const learnerProfile = await db.learnerProfile.findUnique({
    where: {
      authUserId
    },
    select: {
      id: true
    }
  });

  if (!learnerProfile) {
    return NextResponse.json(
      { error: "Learner Profile was not found." },
      { status: 404 }
    );
  }

  const engine = new QuestionEngine(db);
  const feedback = await engine.submitAnswer({
    sessionId,
    learnerProfileId: learnerProfile.id,
    submittedAnswer: body.submittedAnswer
  });

  return NextResponse.json(feedback);
}
