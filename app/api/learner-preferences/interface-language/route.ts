import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { resolveInterfaceLanguage } from "@/lib/i18n/interface-language";
import { devAuthUserId, safeReturnTo } from "@/lib/learner/preferences";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const interfaceLanguage = resolveInterfaceLanguage(searchParams.get("ui"));
  const returnTo = safeReturnTo(searchParams.get("returnTo"));

  await getPrisma().learnerProfile.update({
    where: {
      authUserId: devAuthUserId
    },
    data: {
      interfaceLanguage
    }
  });

  return NextResponse.redirect(new globalThis.URL(returnTo, origin));
}
