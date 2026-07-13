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

function isDatabaseUnavailableError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("DATABASE_URL is required") ||
      error.message.includes("Can't reach database server"))
  );
}

export function defaultLearnerPreferences(): LearnerPreferences {
  return {
    interfaceLanguage: defaultInterfaceLanguage,
    interfaceTheme: defaultInterfaceTheme,
    currentLevel: defaultLevelLabel
  };
}

export async function getLearnerPreferencesForAuthUser(
  authUserId = devAuthUserId
): Promise<LearnerPreferences> {
  let learnerProfile:
    | {
        interfaceLanguage: string;
        interfaceTheme?: string;
        currentLevel: string;
      }
    | null;

  try {
    const db = getPrisma();

    learnerProfile = await db.learnerProfile.findUnique({
      where: {
        authUserId
      },
      select: {
        interfaceLanguage: true,
        interfaceTheme: true,
        currentLevel: true
      }
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return defaultLearnerPreferences();
    }

    if (!isMissingThemeColumnError(error)) {
      throw error;
    }

    const db = getPrisma();

    learnerProfile = await db.learnerProfile.findUnique({
      where: {
        authUserId
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

export async function getLearnerPreferences(): Promise<LearnerPreferences> {
  return getLearnerPreferencesForAuthUser(devAuthUserId);
}

export function safeReturnTo(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
