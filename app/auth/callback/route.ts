import { NextResponse } from "next/server";
import { isAuthConfigurationError } from "@/lib/auth/config";
import { buildAuthSessionView } from "@/lib/auth/nyra-identity";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { safeReturnTo } from "@/lib/learner/preferences";

function redirectOrigin(request: Request) {
  const url = new globalThis.URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (process.env.NODE_ENV !== "development" && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return url.origin;
}

export async function GET(request: Request) {
  const requestUrl = new globalThis.URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeReturnTo(requestUrl.searchParams.get("next"));
  const origin = redirectOrigin(request);

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Authentication link is invalid or expired.")}`
    );
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    throw error;
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (user) {
    await buildAuthSessionView({
      id: user.id,
      email: user.email ?? "",
      fullName:
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : null,
      expiresAt: session?.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : null
    });
  }

  return NextResponse.redirect(`${origin}${next}`);
}
