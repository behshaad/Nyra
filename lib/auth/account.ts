import { getPrisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";

export const accountStatuses = {
  active: "ACTIVE",
  disabled: "DISABLED"
} as const;

type Db = ReturnType<typeof getPrisma>;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createPasswordAccount(input: {
  email: string;
  fullName: string;
  password: string;
}, db: Db = getPrisma()) {
  const email = normalizeEmail(input.email);
  const existingUser = await db.user.findUnique({
    where: {
      email
    }
  });

  if (existingUser?.passwordHash) {
    return {
      error: "An account with this email already exists." as const,
      user: null
    };
  }

  const passwordHash = await hashPassword(input.password);

  if (existingUser) {
    const user = await db.user.update({
      data: {
        name: existingUser.name || input.fullName,
        passwordHash,
        status: "ACTIVE"
      },
      where: {
        id: existingUser.id
      }
    });

    return { error: null, user };
  }

  const user = await db.user.create({
    data: {
      email,
      name: input.fullName,
      passwordHash,
      status: "ACTIVE"
    }
  });

  return { error: null, user };
}

export async function getOrCreateOAuthUser(input: {
  email: string;
  emailVerified: boolean;
  name?: string | null;
  provider: string;
  providerAccountId: string;
}, db: Db = getPrisma()) {
  if (!input.emailVerified) {
    return null;
  }

  const email = normalizeEmail(input.email);
  const existingLink = await db.providerAccount.findUnique({
    include: {
      user: true
    },
    where: {
      provider_providerAccountId: {
        provider: input.provider,
        providerAccountId: input.providerAccountId
      }
    }
  });

  if (existingLink) {
    return existingLink.user.status === "ACTIVE" ? existingLink.user : null;
  }

  const now = new Date();
  const user = await db.user.upsert({
    create: {
      email,
      emailVerifiedAt: now,
      name: input.name?.trim() || email.split("@")[0] || "Nyra Learner",
      status: "ACTIVE"
    },
    update: {
      emailVerifiedAt: now,
      name: input.name?.trim() || undefined
    },
    where: {
      email
    }
  });

  if (user.status !== "ACTIVE") {
    return null;
  }

  await db.providerAccount.create({
    data: {
      email,
      emailVerifiedAt: now,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      userId: user.id
    }
  });

  return user;
}
