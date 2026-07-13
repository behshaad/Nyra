import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/server";
import { getPrisma } from "@/lib/db/prisma";
import { devAuthUserId } from "@/lib/learner/preferences";
import { QuestionEngine } from "@/lib/question-engine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    skillSlug?: string;
  };

  if (!body.skillSlug) {
    return NextResponse.json(
      { error: "skillSlug is required." },
      { status: 400 }
    );
  }

  const db = getPrisma();
  const authSession = await getAuthSession();
  const learnerProfile = await db.learnerProfile.findUnique({
    where: {
      authUserId: authSession?.id ?? devAuthUserId
    },
    select: {
      id: true
    }
  });

  if (!learnerProfile) {
    return NextResponse.json(
      { error: "Development learner is missing. Run npm run db:seed." },
      { status: 500 }
    );
  }

  const engine = new QuestionEngine(db);
  const session = await engine.startOrResumeSession({
    learnerProfileId: learnerProfile.id,
    skillSlug: body.skillSlug
  });

  return NextResponse.json(session);
}
