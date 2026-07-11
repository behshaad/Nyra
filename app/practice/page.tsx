import { LearningJourney } from "@/components/practice/learning-journey";
import { resolveInterfaceLanguage } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getPracticeJourney } from "@/lib/practice/journey";

export const dynamic = "force-dynamic";

export default async function PracticePage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui ? resolveInterfaceLanguage(ui) : preferences.interfaceLanguage;
  const journey = await getPracticeJourney({
    interfaceLanguage: language
  });

  return (
    <main className={`practice-shell ${language === "fa" ? "learner-rtl" : ""}`} dir="ltr">
      <LearningJourney initialJourney={journey} language={language} />
    </main>
  );
}
