import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { InterfaceTheme } from "../lib/generated/prisma/enums";
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

async function findSupabaseUserIdByEmail(
  supabase: SupabaseClient,
  email: string
) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100
    });

    if (error) {
      throw error;
    }

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      return user.id;
    }

    if (data.users.length < 100) {
      return null;
    }

    page += 1;
  }
}

async function ensureSupabaseUser(
  supabase: SupabaseClient,
  seedUser: SeedUser
) {
  const existingUserId = await findSupabaseUserIdByEmail(supabase, seedUser.email);

  if (existingUserId) {
    const { error } = await supabase.auth.admin.updateUserById(existingUserId, {
      email_confirm: true,
      password: seedUser.password,
      user_metadata: {
        full_name: seedUser.displayName
      }
    });

    if (error) {
      throw error;
    }

    return existingUserId;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: seedUser.email,
    email_confirm: true,
    password: seedUser.password,
    user_metadata: {
      full_name: seedUser.displayName
    }
  });

  if (error || !data.user) {
    throw error ?? new Error(`Unable to create ${seedUser.email}.`);
  }

  return data.user.id;
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
  const missingForSeed = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? missing
    : [...missing, "SUPABASE_SERVICE_ROLE_KEY"];

  if (missingForSeed.length > 0) {
    throw new Error(
      `Missing required auth seed env: ${missingForSeed.join(", ")}`
    );
  }

  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const databaseUrl = requiredEnv("DATABASE_URL");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl
    })
  });

  try {
    for (const seedUser of seedUsers) {
      const authUserId = await ensureSupabaseUser(supabase, seedUser);

      await ensureLearnerProfile(prisma, seedUser, authUserId);
      await ensureAdminAccess(prisma, seedUser, authUserId);

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
