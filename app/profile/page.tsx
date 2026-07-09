import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { ProfileSettings } from "@/components/profile-settings";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { profileCopy, text } from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { devLearnerProfile } from "@/lib/learning/sample-content";

export default async function ProfilePage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/profile" />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">{text(profileCopy.label, language)}</span>
          <h1>{text(profileCopy.title, language)}</h1>
          <p>{text(profileCopy.body, language)}</p>
        </div>

        <ProfileSettings
          language={language}
          initialValues={{
            displayName: devLearnerProfile.displayName,
            sourceLanguage: devLearnerProfile.sourceLanguage,
            targetLanguage: devLearnerProfile.targetLanguage,
            currentLevel: preferences.currentLevel,
            dailyGoalMinutes: devLearnerProfile.dailyGoalMinutes
          }}
        />
      </section>
    </main>
  );
}
