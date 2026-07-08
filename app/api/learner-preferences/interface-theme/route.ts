import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { resolveInterfaceTheme } from "@/lib/i18n/interface-theme";
import { devAuthUserId, safeReturnTo } from "@/lib/learner/preferences";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const interfaceTheme = resolveInterfaceTheme(searchParams.get("theme"));
  const returnTo = safeReturnTo(searchParams.get("returnTo"));

  await getPrisma().learnerProfile.update({
    where: {
      authUserId: devAuthUserId
    },
    data: {
      interfaceTheme
    }
  });

  return NextResponse.redirect(new globalThis.URL(returnTo, origin));
}
