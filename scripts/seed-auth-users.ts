import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { InterfaceTheme } from "../lib/generated/prisma/enums";
import { hashPassword } from "../lib/auth/password";
import {
  loadLocalEnv,
  missingRequiredAuthEnv,
  printAuthEnvStatus
} from "./auth-env";

type SeedUser = {
  admin: boolean;
  displayName: string;
  email: string;
  password: string;
};

const seedUsers: SeedUser[] = [
  {
    admin: true,
    displayName: "Nyra Admin",
    email: "admin@nyra.local",
    password: "Admin123!"
  },
  {
    admin: false,
    displayName: "Nyra Student",
    email: "student@nyra.local",
    password: "Student123!"
  }
];

function requiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

async function ensureUser(prisma: PrismaClient, seedUser: SeedUser) {
  return prisma.user.upsert({
    where: {
      email: seedUser.email
    },
    create: {
      email: seedUser.email,
      emailVerifiedAt: new Date(),
      name: seedUser.displayName,
      passwordHash: await hashPassword(seedUser.password),
      status: "ACTIVE"
    },
    update: {
      emailVerifiedAt: new Date(),
      name: seedUser.displayName,
      passwordHash: await hashPassword(seedUser.password),
      status: "ACTIVE"
    }
  });
}

async function ensureLearnerProfile(
  prisma: PrismaClient,
  seedUser: SeedUser,
  authUserId: string
) {
  await prisma.learnerProfile.upsert({
    where: {
      authUserId
    },
    create: {
      authUserId,
      currentLevel: "A1",
      dailyGoalMinutes: 10,
      displayName: seedUser.displayName,
      interfaceLanguage: "en",
      interfaceTheme: InterfaceTheme.SYSTEM,
      onboardingComplete: false,
      sourceLanguage: "Persian",
      targetLanguage: "German"
    },
    update: {
      displayName: seedUser.displayName
    }
  });
}

async function ensureAdminAccess(
  prisma: PrismaClient,
  seedUser: SeedUser,
  authUserId: string
) {
  if (seedUser.admin) {
    await prisma.adminAccess.upsert({
      where: {
        authUserId
      },
      create: {
        authUserId,
        grantedBy: "seed-auth-users"
      },
      update: {
        grantedBy: "seed-auth-users",
        revokedAt: null
      }
    });

    return;
  }

  await prisma.adminAccess.deleteMany({
    where: {
      authUserId
    }
  });
}

async function main() {
  loadLocalEnv();
  printAuthEnvStatus();

  const missing = missingRequiredAuthEnv();

  if (missing.length > 0) {
    throw new Error(`Missing required auth env: ${missing.join(", ")}`);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: requiredEnv("DATABASE_URL")
    })
  });

  try {
    for (const seedUser of seedUsers) {
      const user = await ensureUser(prisma, seedUser);

      await ensureLearnerProfile(prisma, seedUser, user.id);
      await ensureAdminAccess(prisma, seedUser, user.id);

      console.log(
        `${seedUser.email}: ready (${seedUser.admin ? "admin" : "student"})`
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
