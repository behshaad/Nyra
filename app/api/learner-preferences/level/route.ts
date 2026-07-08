import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { defaultLevelLabel, devAuthUserId, safeReturnTo } from "@/lib/learner/preferences";

const supportedLevelLabels = new Set(["A1"]);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const requestedLevel = searchParams.get("level") ?? defaultLevelLabel;
  const currentLevel = supportedLevelLabels.has(requestedLevel)
    ? requestedLevel
    : defaultLevelLabel;
  const returnTo = safeReturnTo(searchParams.get("returnTo"));

  await getPrisma().learnerProfile.update({
    where: {
      authUserId: devAuthUserId
    },
    data: {
      currentLevel
    },
    select: {
      id: true
    }
  });

  return NextResponse.redirect(new globalThis.URL(returnTo, origin));
}
