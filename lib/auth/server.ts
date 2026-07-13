import { isAuthConfigurationError } from "@/lib/auth/config";
import { buildAuthSessionView } from "@/lib/auth/nyra-identity";
import type { AuthSession } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

function metadataString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();

    return buildAuthSessionView({
      id: user.id,
      email: user.email ?? "",
      fullName:
        metadataString(user.user_metadata?.full_name) ||
        metadataString(user.user_metadata?.name),
      expiresAt: session?.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : null
    });
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      return null;
    }

    throw error;
  }
}
