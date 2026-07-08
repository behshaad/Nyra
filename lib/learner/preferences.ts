import { getPrisma } from "@/lib/db/prisma";
import {
  defaultInterfaceLanguage,
  resolveInterfaceLanguage,
  type InterfaceLanguageCode
} from "@/lib/i18n/interface-language";
import {
  defaultInterfaceTheme,
  resolveInterfaceTheme,
  type InterfaceThemeCode
} from "@/lib/i18n/interface-theme";

export const devAuthUserId = "dev-local-learner";
export const defaultLevelLabel = "A1";

export type LearnerPreferences = {
  interfaceLanguage: InterfaceLanguageCode;
  interfaceTheme: InterfaceThemeCode;
  currentLevel: string;
};

function isMissingThemeColumnError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2022"
  );
}

export async function getLearnerPreferences(): Promise<LearnerPreferences> {
  const db = getPrisma();
  let learnerProfile:
    | {
        interfaceLanguage: string;
        interfaceTheme?: string;
        currentLevel: string;
      }
    | null;

  try {
    learnerProfile = await db.learnerProfile.findUnique({
      where: {
        authUserId: devAuthUserId
      },
      select: {
        interfaceLanguage: true,
        interfaceTheme: true,
        currentLevel: true
      }
    });
  } catch (error) {
    if (!isMissingThemeColumnError(error)) {
      throw error;
    }

    learnerProfile = await db.learnerProfile.findUnique({
      where: {
        authUserId: devAuthUserId
      },
      select: {
        interfaceLanguage: true,
        currentLevel: true
      }
    });
  }

  return {
    interfaceLanguage: resolveInterfaceLanguage(
      learnerProfile?.interfaceLanguage ?? defaultInterfaceLanguage
    ),
    interfaceTheme: resolveInterfaceTheme(
      learnerProfile?.interfaceTheme ?? defaultInterfaceTheme
    ),
    currentLevel: learnerProfile?.currentLevel ?? defaultLevelLabel
  };
}

export function safeReturnTo(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
