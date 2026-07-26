import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/server";
import { getPrisma } from "@/lib/db/prisma";
import {
  interfaceLanguageCookie,
  resolveSupportedInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { safeReturnTo } from "@/lib/learner/preferences";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const interfaceLanguage = resolveSupportedInterfaceLanguage(searchParams.get("ui"));
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const session = await getAuthSession();

  if (session?.id) {
    await getPrisma().learnerProfile.update({
      where: {
        authUserId: session.id
      },
      data: {
        interfaceLanguage
      },
      select: {
        id: true
      }
    });
  }

  const response = NextResponse.redirect(new globalThis.URL(returnTo, origin));
  response.cookies.set(interfaceLanguageCookie, interfaceLanguage, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    secure: process.env.NODE_ENV === "production"
  });
  return response;
}
