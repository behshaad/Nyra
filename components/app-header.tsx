import {
  interfaceCopy,
  resolveSupportedInterfaceLanguage,
  type InterfaceLanguageCode
} from "@/lib/i18n/interface-language";
import type { InterfaceThemeCode } from "@/lib/i18n/interface-theme";
import { getAuthSession } from "@/lib/auth/server";
import { getLearnerPreferencesForAuthUser } from "@/lib/learner/preferences";
import { ThemeSync } from "@/components/theme-sync";
import { InterfaceLanguageSync } from "@/components/interface-language-sync";
import { AppHeaderClient } from "@/components/app-header-client";

export async function AppHeader({
  language,
  theme,
  currentPath = "/"
}: {
  language?: InterfaceLanguageCode;
  theme?: InterfaceThemeCode;
  currentPath?: string;
}) {
  const session = language && theme ? null : await getAuthSession();
  const preferences =
    language && theme
      ? null
      : await getLearnerPreferencesForAuthUser(session?.id);
  const activeLanguage = resolveSupportedInterfaceLanguage(
    language,
    preferences?.interfaceLanguage
  );
  const activeTheme = theme ?? preferences?.interfaceTheme ?? "SYSTEM";
  const copy = interfaceCopy[activeLanguage];

  return (
    <>
      <ThemeSync theme={activeTheme} />
      <InterfaceLanguageSync language={activeLanguage} />
      <AppHeaderClient
        currentPath={currentPath}
        labels={{
          nav: {
            flashcards: copy.nav.flashcards,
            resources: copy.nav.resources
          },
          adminDashboard: copy.nav.admin,
          continueLearning: copy.header.startLearning,
          languageLabel: copy.header.languageLabel
        }}
        language={activeLanguage}
        theme={activeTheme}
      />
    </>
  );
}
