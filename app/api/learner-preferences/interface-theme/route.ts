import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { resolveInterfaceTheme } from "@/lib/i18n/interface-theme";
import { devAuthUserId, safeReturnTo } from "@/lib/learner/preferences";

function isMissingThemeColumnError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2022"
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const interfaceTheme = resolveInterfaceTheme(searchParams.get("theme"));
  const returnTo = safeReturnTo(searchParams.get("returnTo"));

  try {
    await getPrisma().learnerProfile.update({
      where: {
        authUserId: devAuthUserId
      },
      data: {
        interfaceTheme
      },
      select: {
        id: true
      }
    });
  } catch (error) {
    if (!isMissingThemeColumnError(error)) {
      throw error;
    }
  }

  return NextResponse.redirect(new globalThis.URL(returnTo, origin));
}
