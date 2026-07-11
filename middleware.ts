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
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1)
  };
}

export function middleware(request: NextRequest) {
  if (!adminUsername || !adminPassword) {
    return process.env.NODE_ENV === "production" ? unauthorized() : NextResponse.next();
  }

  const credentials = decodeBasicAuth(request.headers.get("authorization"));

  if (
    credentials?.username === adminUsername &&
    credentials.password === adminPassword
  ) {
    return NextResponse.next();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
