import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateOAuthUser, normalizeEmail } from "@/lib/auth/account";
import { getPrisma } from "@/lib/db/prisma";
import {
  buildAuthSessionView,
  ensureLearnerProfileForIdentity,
  getAuthRoleForIdentity
} from "@/lib/auth/nyra-identity";
import { verifyPassword } from "@/lib/auth/password";

type NyraToken = JWT & {
  emailVerifiedAt?: string | null;
  email?: string;
  name?: string;
  role?: "ADMIN" | "USER";
};

type NyraSession = Session & {
  user: {
    email: string;
    emailVerifiedAt: string | null;
    id: string;
    name: string;
    role: "ADMIN" | "USER";
  };
};

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const email = normalizeEmail(credentials?.email ?? "");
      const password = credentials?.password ?? "";

      if (!email || !password) {
        return null;
      }

      const user = await getPrisma().user.findUnique({
        where: {
          email
        }
      });

      if (!user || user.status !== "ACTIVE" || !user.passwordHash) {
        return null;
      }

      const passwordMatches = await verifyPassword(password, user.passwordHash);

      if (!passwordMatches) {
        return null;
      }

      await ensureLearnerProfileForIdentity({
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        fullName: user.name,
        id: user.id
      });

      await getPrisma().user.update({
        where: {
          id: user.id
        },
        data: {
          lastLoginAt: new Date(),
          lastLoginProvider: "credentials"
        }
      });

      return {
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        id: user.id,
        name: user.name
      };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") {
        return true;
      }

      const googleProfile = profile as
        | {
            email?: string;
            email_verified?: boolean;
            name?: string;
            sub?: string;
          }
        | undefined;
      const email = googleProfile?.email ?? user.email ?? "";
      const providerAccountId = account.providerAccountId || googleProfile?.sub;

      if (!email || !providerAccountId || googleProfile?.email_verified !== true) {
        return "/login?error=Google%20email%20must%20be%20verified.";
      }

      const nyraUser = await getOrCreateOAuthUser({
        email,
        emailVerified: true,
        name: googleProfile?.name ?? user.name,
        provider: account.provider,
        providerAccountId
      });

      if (!nyraUser) {
        return "/login?error=Unable%20to%20sign%20in%20with%20this%20account.";
      }

      user.id = nyraUser.id;
      user.email = nyraUser.email;
      user.name = nyraUser.name;
      (user as typeof user & { emailVerifiedAt?: string | null }).emailVerifiedAt =
        nyraUser.emailVerifiedAt?.toISOString() ?? null;

      await ensureLearnerProfileForIdentity({
        email: nyraUser.email,
        emailVerifiedAt: nyraUser.emailVerifiedAt,
        fullName: nyraUser.name,
        id: nyraUser.id
      });

      await getPrisma().user.update({
        where: {
          id: nyraUser.id
        },
        data: {
          lastLoginAt: new Date(),
          lastLoginProvider: account.provider
        }
      });

      return true;
    },
    async jwt({ token, user }) {
      const nyraToken = token as NyraToken;

      if (user?.id) {
        const authUser = user as typeof user & { emailVerifiedAt?: string | null };

        nyraToken.sub = user.id;
        nyraToken.email = user.email ?? "";
        nyraToken.emailVerifiedAt = authUser.emailVerifiedAt ?? null;
        nyraToken.name = user.name ?? "";
        nyraToken.role = await getAuthRoleForIdentity(user.id);
      }

      return nyraToken;
    },
    async session({ session, token }) {
      const nyraToken = token as NyraToken;

      if (!nyraToken.sub || !nyraToken.email) {
        return session;
      }

      const authSession = await buildAuthSessionView({
        id: nyraToken.sub,
        email: nyraToken.email,
        emailVerifiedAt: nyraToken.emailVerifiedAt,
        fullName: nyraToken.name ?? null,
        expiresAt: session.expires
      });

      return {
        ...session,
        user: {
          email: authSession.email,
          emailVerifiedAt: authSession.emailVerifiedAt,
          id: authSession.id,
          name: authSession.fullName,
          role: authSession.role
        }
      } satisfies NyraSession;
    }
  },
  pages: {
    signIn: "/login"
  },
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    strategy: "jwt"
  }
};
