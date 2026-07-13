import { createServerClient, type CookieOptions } from "@supabase/ssr";
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

function hasBasicAdminAccess(request: NextRequest) {
  const credentials = decodeBasicAuth(request.headers.get("authorization"));

  return Boolean(
    adminUsername &&
      adminPassword &&
      credentials?.username === adminUsername &&
      credentials.password === adminPassword
  );
}

async function getSupabaseUser(request: NextRequest, response: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options as CookieOptions);
        });
      }
    }
  });
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  return error ? null : user;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const response = NextResponse.next({
    request
  });
  const activeUser = await getSupabaseUser(request, response);

  if ((pathname === "/login" || pathname === "/signup") && activeUser) {
    return NextResponse.redirect(new globalThis.URL("/profile", request.url));
  }

  if (pathname.startsWith("/profile")) {
    if (activeUser) {
      return response;
    }

    const loginUrl = new globalThis.URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return response;
  }

  if (hasBasicAdminAccess(request)) {
    return response;
  }

  if (activeUser) {
    return response;
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
    "/api/admin/:path*",
    "/auth/callback",
    "/auth/update-password"
  ]
};
