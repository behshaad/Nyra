import { describe, expect, it, vi } from "vitest";
import {
  buildAuthSessionView,
  ensureLearnerProfileForIdentity,
  getAuthRoleForIdentity
} from "@/lib/auth/nyra-identity";

type AdminAccessRecord = { revokedAt: Date | null } | null;
type LearnerProfileRecord = { displayName: string; [key: string]: unknown };

function learnerProfileStore(existing: LearnerProfileRecord | null = null) {
  const created: unknown[] = [];

  return {
    created,
    db: {
      learnerProfile: {
        findUnique: vi.fn(async () => existing),
        create: vi.fn(async ({ data }) => {
          created.push(data);
          return {
            id: "profile-1",
            ...data
          };
        })
      },
      adminAccess: {
        findUnique: vi.fn(async (): Promise<AdminAccessRecord> => null)
      }
    }
  };
}

describe("Nyra auth identity boundary", () => {
  it("provisions a clean learner profile once for a new authenticated identity", async () => {
    const { created, db } = learnerProfileStore();

    const profile = await ensureLearnerProfileForIdentity(
      {
        id: "supabase-user-1",
        email: "sara@example.com",
        fullName: "Sara"
      },
      {
        interfaceLanguage: "en"
      },
      db
    );

    expect(profile).toMatchObject({
      authUserId: "supabase-user-1",
      displayName: "Sara",
      sourceLanguage: "Persian",
      targetLanguage: "German",
      interfaceLanguage: "en",
      interfaceTheme: "SYSTEM",
      currentLevel: "A1",
      dailyGoalMinutes: 10,
      onboardingComplete: false
    });
    expect(created).toHaveLength(1);
  });

  it("does not create a duplicate profile for an existing identity", async () => {
    const existing = {
      id: "profile-1",
      authUserId: "supabase-user-1",
      displayName: "Existing Learner"
    };
    const { db } = learnerProfileStore(existing);

    const profile = await ensureLearnerProfileForIdentity(
      {
        id: "supabase-user-1",
        email: "sara@example.com"
      },
      {},
      db
    );

    expect(profile).toBe(existing);
    expect(db.learnerProfile.create).not.toHaveBeenCalled();
  });

  it("derives admin role only from active AdminAccess", async () => {
    const db = {
      learnerProfile: {
        findUnique: vi.fn(),
        create: vi.fn()
      },
      adminAccess: {
        findUnique: vi.fn(async (): Promise<AdminAccessRecord> => ({ revokedAt: null }))
      }
    };

    await expect(getAuthRoleForIdentity("admin-user", db)).resolves.toBe("ADMIN");

    db.adminAccess.findUnique.mockResolvedValueOnce({
      revokedAt: new Date()
    });
    await expect(getAuthRoleForIdentity("admin-user", db)).resolves.toBe("USER");
  });

  it("builds a compatibility session view from Supabase identity and Nyra data", async () => {
    const { db } = learnerProfileStore({
      id: "profile-1",
      authUserId: "supabase-user-1",
      displayName: "Nyra Name"
    });

    db.adminAccess.findUnique.mockResolvedValueOnce({ revokedAt: null });

    const session = await buildAuthSessionView(
      {
        id: "supabase-user-1",
        email: "sara@example.com",
        fullName: "Provider Name",
        expiresAt: "2026-08-01T00:00:00.000Z"
      },
      {},
      db
    );

    expect(session).toEqual({
      id: "supabase-user-1",
      email: "sara@example.com",
      fullName: "Nyra Name",
      role: "ADMIN",
      remember: true,
      expiresAt: "2026-08-01T00:00:00.000Z"
    });
  });
});
