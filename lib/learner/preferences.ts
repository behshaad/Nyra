import { getPrisma } from "@/lib/db/prisma";
import {
  defaultInterfaceLanguage,
  resolveInterfaceLanguage,
  type InterfaceLanguageCode
} from "@/lib/i18n/interface-language";

export const devAuthUserId = "dev-local-learner";
export const defaultLevelLabel = "A1";

export type LearnerPreferences = {
  interfaceLanguage: InterfaceLanguageCode;
  currentLevel: string;
};

export async function getLearnerPreferences(): Promise<LearnerPreferences> {
  const learnerProfile = await getPrisma().learnerProfile.findUnique({
    where: {
      authUserId: devAuthUserId
    },
    select: {
      interfaceLanguage: true,
      currentLevel: true
    }
  });

  return {
    interfaceLanguage: resolveInterfaceLanguage(
      learnerProfile?.interfaceLanguage ?? defaultInterfaceLanguage
    ),
    currentLevel: learnerProfile?.currentLevel ?? defaultLevelLabel
  };
}

export function safeReturnTo(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
