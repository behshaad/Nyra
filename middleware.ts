import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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
    password: decoded.slice(separatorIndex + 1),
    username: decoded.slice(0, separatorIndex)
  };
}

function hasBasicAdminAccess(request: NextRequest) {
  const credentials = decodeBasicAuth(request.headers.get("authorization"));

  return Boolean(
    adminUsername &&
      adminPassword &&
      credentials?.username === adminUsername &&
      credentials.password === adminPassword
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  const isSignedIn = Boolean(token?.sub);

  if ((pathname === "/login" || pathname === "/signup") && isSignedIn) {
    return NextResponse.redirect(new globalThis.URL("/profile", request.url));
  }

  if (pathname.startsWith("/profile")) {
    if (isSignedIn) {
      return NextResponse.next();
    }

    const loginUrl = new globalThis.URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (hasBasicAdminAccess(request) || isSignedIn) {
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
  matcher: [
    "/login",
    "/signup",
    "/profile/:path*",
    "/admin/:path*",
    "/api/admin/:path*"
  ]
};
