export class AuthConfigurationError extends Error {
  constructor(message = "Supabase Auth is not configured.") {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export function getSupabaseAuthConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new AuthConfigurationError(
      "Supabase Auth is missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return {
    publishableKey,
    url
  };
}

export function isAuthConfigurationError(error: unknown) {
  return error instanceof AuthConfigurationError;
}
