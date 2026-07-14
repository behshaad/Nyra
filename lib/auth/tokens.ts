import { createHash, randomBytes } from "crypto";
import { getPrisma } from "@/lib/db/prisma";
import { getAppUrl, sendAuthEmail } from "@/lib/auth/email";

const tokenLifetimes = {
  EMAIL_VERIFICATION: 1000 * 60 * 60 * 24,
  PASSWORD_RESET: 1000 * 60 * 30
} as const;

type AuthTokenType = keyof typeof tokenLifetimes;
type Db = ReturnType<typeof getPrisma>;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function createToken(userId: string, type: AuthTokenType, db: Db) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + tokenLifetimes[type]);

  await db.authToken.create({
    data: {
      expiresAt,
      tokenHash: hashToken(token),
      type,
      userId
    }
  });

  return token;
}

export async function sendVerificationEmail(input: {
  email: string;
  userId: string;
}, db: Db = getPrisma()) {
  const token = await createToken(input.userId, "EMAIL_VERIFICATION", db);
  const url = `${getAppUrl()}/verify-email?token=${encodeURIComponent(token)}`;

  await sendAuthEmail({
    subject: "Verify your Nyra email",
    text: `Verify your Nyra email address:\n\n${url}\n\nThis link expires in 24 hours.`,
    to: input.email
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  userId: string;
}, db: Db = getPrisma()) {
  const token = await createToken(input.userId, "PASSWORD_RESET", db);
  const url = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  await sendAuthEmail({
    subject: "Reset your Nyra password",
    text: `Reset your Nyra password:\n\n${url}\n\nThis link expires in 30 minutes.`,
    to: input.email
  });
}

export async function consumeAuthToken(
  token: string,
  type: AuthTokenType,
  db: Db = getPrisma()
) {
  const tokenHash = hashToken(token);
  const record = await db.authToken.findUnique({
    include: {
      user: true
    },
    where: {
      tokenHash
    }
  });

  if (
    !record ||
    record.type !== type ||
    record.usedAt ||
    record.expiresAt <= new Date() ||
    record.user.status !== "ACTIVE"
  ) {
    return null;
  }

  await db.authToken.update({
    data: {
      usedAt: new Date()
    },
    where: {
      id: record.id
    }
  });

  return record.user;
}
