import { NextResponse } from "next/server";
import { resolveInterfaceLanguage } from "@/lib/i18n/interface-language";
import { getPracticeJourney } from "@/lib/practice/journey";

export async function GET(request: Request) {
  const url = new globalThis.URL(request.url);
  const ui = resolveInterfaceLanguage(url.searchParams.get("ui"));
  const courseSlug = url.searchParams.get("course") ?? undefined;

  const journey = await getPracticeJourney({
    courseSlug,
    interfaceLanguage: ui
  });

  return NextResponse.json(journey);
}
