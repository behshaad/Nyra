import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { AuthSession } from "@/lib/auth/session";
import { getAuthSession } from "@/lib/auth/server";

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

function decodeBasicAuth(header: string | null) {
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  const decoded = globalThis.atob(header.slice("Basic ".length));
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1)
  };
}

export function hasBasicAdminAccess(header: string | null) {
  const credentials = decodeBasicAuth(header);

  return Boolean(
    adminUsername &&
      adminPassword &&
      credentials?.username === adminUsername &&
      credentials.password === adminPassword
  );
}

export function adminPageAccessRedirectForSession(session: AuthSession | null) {
  if (!session) {
    return "/login?returnTo=/admin";
  }

  if (session.role !== "ADMIN") {
    return "/admin-access-denied";
  }

  return null;
}

export async function requireAdminPageAccess() {
  const headerStore = await headers();

  if (hasBasicAdminAccess(headerStore.get("authorization"))) {
    return;
  }

  const session = await getAuthSession();
  const redirectTo = adminPageAccessRedirectForSession(session);

  if (!redirectTo) {
    return;
  }

  redirect(redirectTo);
}

export async function requireAdminApiAccess(request: Request) {
  if (hasBasicAdminAccess(request.headers.get("authorization"))) {
    return null;
  }

  const session = await getAuthSession();

  if (session?.role === "ADMIN") {
    return null;
  }

  return NextResponse.json(
    { error: "Admin Access is required." },
    { status: session ? 403 : 401 }
  );
}
