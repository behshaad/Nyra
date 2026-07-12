import { redirect } from "next/navigation";
import { SkillPlayer } from "@/components/practice/world/skill-player";
import { resolveInterfaceLanguage } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getPracticeJourney } from "@/lib/practice/journey";

export const dynamic = "force-dynamic";

const allowedLevels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

export default async function PracticeSkillPage({
  params,
  searchParams
}: {
  params: Promise<{ level: string; skillSlug: string }>;
  searchParams: Promise<{ ui?: string }>;
}) {
  const { level, skillSlug } = await params;
  const { ui } = await searchParams;
  const normalizedLevel = level.toUpperCase();
  const preferences = await getLearnerPreferences();
  const language = ui ? resolveInterfaceLanguage(ui) : preferences.interfaceLanguage;
  const practiceHref = language === "fa" ? "/practice" : `/practice?ui=${language}`;
  const worldHref =
    language === "fa"
      ? `/practice/${normalizedLevel.toLowerCase()}`
      : `/practice/${normalizedLevel.toLowerCase()}?ui=${language}`;

  if (!allowedLevels.has(normalizedLevel)) {
    redirect(practiceHref);
  }

  const journey = await getPracticeJourney({
    interfaceLanguage: language
  });
  const journeyLevel = journey.levels.find((candidate) => candidate.label === normalizedLevel);
  const skill = journeyLevel?.units
    .flatMap((unit) => unit.nodes)
    .find((candidate) => candidate.slug === skillSlug);

  if (!journeyLevel || journeyLevel.totalCount === 0 || !skill || skill.state === "locked") {
    redirect(worldHref);
  }

  return (
    <main className={`practice-shell ${language === "fa" ? "learner-rtl" : ""}`} dir="ltr">
      <SkillPlayer language={language} levelLabel={normalizedLevel} skillSlug={skillSlug} />
    </main>
  );
}
