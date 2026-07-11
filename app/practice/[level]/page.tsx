import { redirect } from "next/navigation";
import {
  levelPreferenceHref,
  resolveInterfaceLanguage,
  type InterfaceLanguageCode
} from "@/lib/i18n/interface-language";

const allowedLevels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

export default async function PracticeLevelPage({
  params,
  searchParams
}: {
  params: Promise<{ level: string }>;
  searchParams: Promise<{ ui?: string }>;
}) {
  const { level } = await params;
  const { ui } = await searchParams;
  const normalizedLevel = level.toUpperCase();
  const language: InterfaceLanguageCode = resolveInterfaceLanguage(ui);

  if (!allowedLevels.has(normalizedLevel)) {
    redirect(language === "fa" ? "/practice" : `/practice?ui=${language}`);
  }

  redirect(
    levelPreferenceHref({
      level: normalizedLevel,
      returnTo: language === "fa" ? "/learn" : `/learn?ui=${language}`
    })
  );
}
