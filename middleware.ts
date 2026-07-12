import { NextRequest, NextResponse } from "next/server";
import {
  decodeAuthSession,
  isSessionExpired,
  mockAuthCookieName
} from "@/lib/auth/mock-session";

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Nyra Admin"'
    }
  });
}

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

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = decodeAuthSession(request.cookies.get(mockAuthCookieName)?.value);
  const activeSession = session && !isSessionExpired(session) ? session : null;

  if ((pathname === "/login" || pathname === "/signup") && activeSession) {
    return NextResponse.redirect(new globalThis.URL("/profile", request.url));
  }

  if (pathname.startsWith("/profile")) {
    if (activeSession) {
      return NextResponse.next();
    }

    const loginUrl = new globalThis.URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (activeSession?.role === "ADMIN") {
    return NextResponse.next();
  }

  const credentials = decodeBasicAuth(request.headers.get("authorization"));

  if (
    adminUsername &&
    adminPassword &&
    credentials?.username === adminUsername &&
    credentials.password === adminPassword
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return unauthorized();
  }

  const loginUrl = new globalThis.URL("/login", request.url);
  loginUrl.searchParams.set("returnTo", `${pathname}${search}`);

  if (!adminUsername || !adminPassword) {
    return NextResponse.redirect(loginUrl);
  }

  return unauthorized();
}

export const config = {
  matcher: ["/login", "/signup", "/profile/:path*", "/admin/:path*", "/api/admin/:path*"]
};
