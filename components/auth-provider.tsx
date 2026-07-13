"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AuthSession } from "@/lib/auth/mock-session";

const AuthContext = createContext<AuthSession | null>(null);

export function AuthProvider({
  children,
  session
}: {
  children: ReactNode;
  session: AuthSession | null;
}) {
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
