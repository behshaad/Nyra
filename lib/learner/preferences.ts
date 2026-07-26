import { getPrisma } from "@/lib/db/prisma";
import {
  defaultInterfaceLanguage,
  interfaceLanguageCookie,
  resolveSupportedInterfaceLanguage,
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
  authUserId?: string
): Promise<LearnerPreferences> {
  const resolvedAuthUserId = authUserId ?? devAuthUserId;
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
        authUserId: resolvedAuthUserId
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
        authUserId: resolvedAuthUserId
      },
      select: {
        interfaceLanguage: true,
        currentLevel: true
      }
    });
  }

  let guestLanguage: string | undefined;
  if (!authUserId) {
    try {
      const { cookies } = await import("next/headers");
      guestLanguage = (await cookies()).get(interfaceLanguageCookie)?.value;
    } catch {
      // Request cookies are unavailable in scripts and isolated unit tests.
    }
  }

  return {
    interfaceLanguage: resolveSupportedInterfaceLanguage(
      guestLanguage,
      resolveSupportedInterfaceLanguage(
        learnerProfile?.interfaceLanguage,
        defaultInterfaceLanguage
      )
    ),
    interfaceTheme: resolveInterfaceTheme(
      learnerProfile?.interfaceTheme ?? defaultInterfaceTheme
    ),
    currentLevel: learnerProfile?.currentLevel ?? defaultLevelLabel
  };
}

export async function getLearnerPreferences(): Promise<LearnerPreferences> {
  return getLearnerPreferencesForAuthUser();
}

export function safeReturnTo(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
