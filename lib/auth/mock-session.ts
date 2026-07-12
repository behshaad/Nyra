export type AuthRole = "ADMIN" | "USER";

export type AuthSession = {
  id: string;
  email: string;
  fullName: string;
  role: AuthRole;
  remember: boolean;
  expiresAt: string;
};

export const mockAuthCookieName = "nyra_mock_session";
export const mockAuthReturnToCookieName = "nyra_auth_return_to";

const sessionDurationMs = {
  session: 1000 * 60 * 60 * 8,
  remembered: 1000 * 60 * 60 * 24 * 30
};

export const mockUsers = [
  {
    email: "learner@nyra.local",
    password: "nyra-user",
    fullName: "Nyra Learner",
    role: "USER" as const
  },
  {
    email: "admin@nyra.local",
    password: "nyra-admin",
    fullName: "Nyra Admin",
    role: "ADMIN" as const
  }
];

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createMockSession(input: {
  email: string;
  fullName: string;
  remember: boolean;
  role: AuthRole;
}) {
  const now = Date.now();
  const duration = input.remember
    ? sessionDurationMs.remembered
    : sessionDurationMs.session;

  return {
    id: `mock-${input.role.toLowerCase()}-${normalizeEmail(input.email)}`,
    email: normalizeEmail(input.email),
    fullName: input.fullName.trim(),
    role: input.role,
    remember: input.remember,
    expiresAt: new Date(now + duration).toISOString()
  } satisfies AuthSession;
}

export function encodeAuthSession(session: AuthSession) {
  return encodeURIComponent(JSON.stringify(session));
}

export function decodeAuthSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    const session = JSON.parse(decodeURIComponent(value)) as Partial<AuthSession>;

    if (
      !session.id ||
      !session.email ||
      !session.fullName ||
      (session.role !== "ADMIN" && session.role !== "USER") ||
      typeof session.remember !== "boolean" ||
      !session.expiresAt
    ) {
      return null;
    }

    if (Number.isNaN(Date.parse(session.expiresAt))) {
      return null;
    }

    return session as AuthSession;
  } catch {
    return null;
  }
}

export function isSessionExpired(session: AuthSession) {
  return Date.parse(session.expiresAt) <= Date.now();
}

export function findMockUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);

  return mockUsers.find(
    (user) => user.email === normalizedEmail && user.password === password
  ) ?? null;
}

export function inferRoleFromEmail(email: string): AuthRole {
  return normalizeEmail(email).startsWith("admin") ? "ADMIN" : "USER";
}
