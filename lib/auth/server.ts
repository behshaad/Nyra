import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getPrisma } from "@/lib/db/prisma";
import {
  buildAuthSessionView,
  ensureLearnerProfileForIdentity
} from "@/lib/auth/nyra-identity";
import type { AuthSession } from "@/lib/auth/session";

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | {
        email?: string | null;
        emailVerifiedAt?: string | null;
        id?: string | null;
        name?: string | null;
      }
    | undefined;

  if (!session || !user?.id || !user.email) {
    return null;
  }

  const dbUser = await getPrisma().user.findUnique({
    where: {
      id: user.id
    }
  });

  if (!dbUser || dbUser.status !== "ACTIVE") {
    return null;
  }

  await ensureLearnerProfileForIdentity({
    id: dbUser.id,
    email: dbUser.email,
    emailVerifiedAt: dbUser.emailVerifiedAt,
    fullName: dbUser.name
  });

  return buildAuthSessionView({
    id: dbUser.id,
    email: dbUser.email,
    emailVerifiedAt: dbUser.emailVerifiedAt,
    fullName: dbUser.name,
    expiresAt: session.expires
  });
}
