import {
  interfaceCopy,
  type InterfaceLanguageCode
} from "@/lib/i18n/interface-language";
import type { InterfaceThemeCode } from "@/lib/i18n/interface-theme";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { ThemeSync } from "@/components/theme-sync";
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
  const preferences = language && theme ? null : await getLearnerPreferences();
  const activeLanguage = language ?? preferences?.interfaceLanguage ?? "fa";
  const activeTheme = theme ?? preferences?.interfaceTheme ?? "SYSTEM";
  const copy = interfaceCopy[activeLanguage];

  return (
    <>
      <ThemeSync theme={activeTheme} />
      <AppHeaderClient
        currentPath={currentPath}
        labels={{
          nav: {
            flashcards: copy.nav.flashcards,
            resources: copy.nav.resources
          },
          continueLearning: copy.header.startLearning,
          languageLabel: copy.header.languageLabel
        }}
        language={activeLanguage}
        theme={activeTheme}
      />
    </>
  );
}
