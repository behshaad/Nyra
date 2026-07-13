import { LearningJourney } from "@/components/practice/learning-journey";
import { getAuthSession } from "@/lib/auth/server";
import { resolveInterfaceLanguage } from "@/lib/i18n/interface-language";
import { getLearnerPreferencesForAuthUser } from "@/lib/learner/preferences";
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
  const session = await getAuthSession();
  const preferences = await getLearnerPreferencesForAuthUser(session?.id);
  const language = ui ? resolveInterfaceLanguage(ui) : preferences.interfaceLanguage;
  const journey = await getPracticeJourney({
    authUserId: session?.id,
    interfaceLanguage: language
  });

  return (
    <main className={`practice-shell ${language === "fa" ? "learner-rtl" : ""}`} dir="ltr">
      <LearningJourney initialJourney={journey} language={language} />
    </main>
  );
}
