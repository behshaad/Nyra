import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { AuthSession } from "@/lib/auth/session";
import { getAuthSession } from "@/lib/auth/server";

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

export type AdminActor =
  | {
      type: "AUTH_USER";
      authUserId: string;
      email: string;
    }
  | {
      type: "BASIC_AUTH_ADMIN";
      authUserId: null;
      email: null;
    };

type AdminApiAccessCheck = {
  actor: AdminActor | null;
  isAuthenticated: boolean;
};

const adminApiAccessChecks = new WeakMap<Request, Promise<AdminApiAccessCheck>>();

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
  const check = await getAdminApiAccessCheck(request);

  if (check.actor) {
    return null;
  }

  return NextResponse.json(
    { error: "Admin Access is required." },
    { status: check.isAuthenticated ? 403 : 401 }
  );
}

async function resolveAdminApiAccess(request: Request): Promise<AdminApiAccessCheck> {
  if (hasBasicAdminAccess(request.headers.get("authorization"))) {
    return {
      actor: {
        type: "BASIC_AUTH_ADMIN",
        authUserId: null,
        email: null
      },
      isAuthenticated: true
    };
  }

  const session = await getAuthSession();

  return {
    actor:
      session?.role === "ADMIN"
        ? {
            type: "AUTH_USER",
            authUserId: session.id,
            email: session.email
          }
        : null,
    isAuthenticated: Boolean(session)
  };
}

export function getAdminApiAccessCheck(request: Request) {
  const existing = adminApiAccessChecks.get(request);

  if (existing) {
    return existing;
  }

  const check = resolveAdminApiAccess(request);
  adminApiAccessChecks.set(request, check);
  return check;
}

export async function getAdminActorForRequest(request: Request) {
  return (await getAdminApiAccessCheck(request)).actor;
}
