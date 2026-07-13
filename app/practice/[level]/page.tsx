import { redirect } from "next/navigation";
import { WorldPage } from "@/components/practice/world/level-world";
import { getAuthSession } from "@/lib/auth/server";
import { resolveInterfaceLanguage } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getLevelWorldConfig } from "@/lib/practice/level-worlds";
import { getPracticeJourney } from "@/lib/practice/journey";

export const dynamic = "force-dynamic";

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
  const preferences = await getLearnerPreferences();
  const language = ui ? resolveInterfaceLanguage(ui) : preferences.interfaceLanguage;
  const returnToPractice = language === "fa" ? "/practice" : `/practice?ui=${language}`;

  if (!allowedLevels.has(normalizedLevel)) {
    redirect(returnToPractice);
  }

  const [journey, world, session] = await Promise.all([
    getPracticeJourney({
      interfaceLanguage: language
    }),
    Promise.resolve(getLevelWorldConfig(normalizedLevel)),
    getAuthSession()
  ]);
  const journeyLevel = journey.levels.find((candidate) => candidate.label === normalizedLevel);

  if (!world || !journeyLevel || journeyLevel.totalCount === 0) {
    redirect(returnToPractice);
  }

  return (
    <main className={`practice-shell ${language === "fa" ? "learner-rtl" : ""}`} dir="ltr">
      <WorldPage
        initialJourney={journey}
        isAdmin={session?.role === "ADMIN"}
        language={language}
        levelLabel={normalizedLevel}
        world={world}
      />
    </main>
  );
}
