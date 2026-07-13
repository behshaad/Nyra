import "server-only";

import { cookies } from "next/headers";
import {
  decodeAuthSession,
  encodeAuthSession,
  isSessionExpired,
  mockAuthCookieName,
  type AuthSession
} from "@/lib/auth/mock-session";

export async function getAuthSession() {
  const cookieStore = await cookies();
  const session = decodeAuthSession(cookieStore.get(mockAuthCookieName)?.value);

  if (!session || isSessionExpired(session)) {
    return null;
  }

  return session;
}

export async function setAuthSession(session: AuthSession) {
  const cookieStore = await cookies();
  const maxAge = session.remember
    ? Math.max(0, Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000))
    : undefined;

  cookieStore.set(mockAuthCookieName, encodeAuthSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();

  cookieStore.delete(mockAuthCookieName);
}
