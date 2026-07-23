import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { normalizeDatabaseConnectionString } from "@/lib/db/connection-string";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const rawConnectionString = process.env.DATABASE_URL;

  if (!rawConnectionString) {
    throw new Error("DATABASE_URL is required before using the Prisma client.");
  }

  const connectionString = normalizeDatabaseConnectionString(rawConnectionString);
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
