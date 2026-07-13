export type AuthRole = "ADMIN" | "USER";

export type AuthSession = {
  id: string;
  email: string;
  fullName: string;
  role: AuthRole;
  remember: boolean;
  expiresAt: string | null;
};

export type SupabaseAuthProvider = "google";
