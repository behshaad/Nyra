export type AuthRole = "ADMIN" | "USER";

export type AuthSession = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  fullName: string;
  role: AuthRole;
  expiresAt: string | null;
};
