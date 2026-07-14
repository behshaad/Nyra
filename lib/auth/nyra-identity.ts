import { getPrisma } from "@/lib/db/prisma";
import {
  defaultInterfaceLanguage,
  resolveInterfaceLanguage,
  type InterfaceLanguageCode
} from "@/lib/i18n/interface-language";
import { defaultInterfaceTheme } from "@/lib/i18n/interface-theme";
import { defaultLevelLabel } from "@/lib/learner/preferences";
import type { AuthRole, AuthSession } from "@/lib/auth/session";

type NyraDb = {
  adminAccess: {
    findUnique(input: {
      where: { authUserId: string };
      select: { revokedAt: true };
    }): Promise<{ revokedAt: Date | null } | null>;
  };
  learnerProfile: {
    findUnique(input: { where: { authUserId: string } }): Promise<{
      displayName: string;
    } | null>;
    create(input: {
      data: {
        authUserId: string;
        displayName: string;
        sourceLanguage: string;
        targetLanguage: string;
        interfaceLanguage: string;
        interfaceTheme: "SYSTEM" | "LIGHT" | "DARK";
        currentLevel: string;
        dailyGoalMinutes: number;
        onboardingComplete: boolean;
      };
    }): Promise<{
      displayName: string;
    }>;
  };
};

export type AuthenticatedIdentity = {
  id: string;
  email: string;
  emailVerifiedAt?: Date | string | null;
  fullName?: string | null;
  expiresAt?: string | null;
};

export type LearnerProfileDefaults = {
  displayName?: string;
  interfaceLanguage?: InterfaceLanguageCode;
};

function displayNameFromIdentity(identity: AuthenticatedIdentity) {
  const metadataName = identity.fullName?.trim();

  if (metadataName) {
    return metadataName;
  }

  const emailPrefix = identity.email.split("@")[0]?.trim();

  return emailPrefix || "Nyra Learner";
}

export async function ensureLearnerProfileForIdentity(
  identity: AuthenticatedIdentity,
  defaults: LearnerProfileDefaults = {},
  db: NyraDb = getPrisma()
) {
  const existing = await db.learnerProfile.findUnique({
    where: {
      authUserId: identity.id
    }
  });

  if (existing) {
    return existing;
  }

  return db.learnerProfile.create({
    data: {
      authUserId: identity.id,
      displayName:
        defaults.displayName?.trim() || displayNameFromIdentity(identity),
      sourceLanguage: "Persian",
      targetLanguage: "German",
      interfaceLanguage: resolveInterfaceLanguage(
        defaults.interfaceLanguage ?? defaultInterfaceLanguage
      ),
      interfaceTheme: defaultInterfaceTheme,
      currentLevel: defaultLevelLabel,
      dailyGoalMinutes: 10,
      onboardingComplete: false
    }
  });
}

export async function getAuthRoleForIdentity(
  authUserId: string,
  db: NyraDb = getPrisma()
): Promise<AuthRole> {
  const adminAccess = await db.adminAccess.findUnique({
    where: {
      authUserId
    },
    select: {
      revokedAt: true
    }
  });

  return adminAccess && !adminAccess.revokedAt ? "ADMIN" : "USER";
}

export async function buildAuthSessionView(
  identity: AuthenticatedIdentity,
  defaults: LearnerProfileDefaults = {},
  db: NyraDb = getPrisma()
): Promise<AuthSession> {
  const learnerProfile = await ensureLearnerProfileForIdentity(
    identity,
    defaults,
    db
  );
  const role = await getAuthRoleForIdentity(identity.id, db);

  return {
    id: identity.id,
    email: identity.email,
    emailVerifiedAt: identity.emailVerifiedAt
      ? new Date(identity.emailVerifiedAt).toISOString()
      : null,
    fullName: learnerProfile.displayName,
    role,
    expiresAt: identity.expiresAt ?? null
  };
}
