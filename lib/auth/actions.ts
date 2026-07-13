"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthConfigurationError, isAuthConfigurationError } from "@/lib/auth/config";
import { buildAuthSessionView } from "@/lib/auth/nyra-identity";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { safeReturnTo } from "@/lib/learner/preferences";

export type AuthActionState = {
  error?: string;
  success?: string;
  values?: {
    email?: string;
    fullName?: string;
    remember?: boolean;
  };
};

function formString(formData: globalThis.FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function authErrorMessage(error: unknown) {
  if (isAuthConfigurationError(error)) {
    return error.message;
  }

  return error instanceof Error ? error.message : "Authentication failed.";
}

async function requestOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new AuthConfigurationError("Unable to determine the request origin.");
  }

  return `${protocol}://${host}`;
}

async function provisionCurrentUser(input: {
  fullName?: string;
  interfaceLanguage?: "fa" | "en" | "de";
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unable to load the authenticated user.");
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();

  await buildAuthSessionView({
    id: user.id,
    email: user.email ?? "",
    fullName:
      input.fullName ??
      (typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : typeof user.user_metadata?.name === "string"
          ? user.user_metadata.name
          : null),
    expiresAt: session?.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : null
  }, {
    displayName: input.fullName,
    interfaceLanguage: input.interfaceLanguage
  });
}

export async function loginAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formString(formData, "email"));
  const password = formString(formData, "password");
  const remember = formData.get("remember") === "on";
  const returnTo = safeReturnTo(formString(formData, "returnTo"));

  if (!email || !password) {
    return {
      error: "Email and password are required.",
      values: { email, remember }
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      values: { email, remember }
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        error: error.message,
        values: { email, remember }
      };
    }

    await provisionCurrentUser({});
  } catch (error) {
    return {
      error: authErrorMessage(error),
      values: { email, remember }
    };
  }

  redirect(returnTo);
}

export async function signupAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const fullName = formString(formData, "fullName").trim();
  const email = normalizeEmail(formString(formData, "email"));
  const password = formString(formData, "password");
  const confirmPassword = formString(formData, "confirmPassword");
  let shouldRedirectToProfile = false;

  if (!fullName || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required.",
      values: { email, fullName }
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      values: { email, fullName }
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
      values: { email, fullName }
    };
  }

  try {
    const origin = await requestOrigin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${origin}/auth/callback?next=/profile`
      }
    });

    if (error) {
      return {
        error: error.message,
        values: { email, fullName }
      };
    }

    if (data.session) {
      await provisionCurrentUser({ fullName });
      shouldRedirectToProfile = true;
    } else {
      return {
        success: "Check your email to verify your account before signing in.",
        values: { email, fullName }
      };
    }
  } catch (error) {
    return {
      error: authErrorMessage(error),
      values: { email, fullName }
    };
  }

  if (shouldRedirectToProfile) {
    redirect("/profile");
  }

  return {
    success: "Check your email to verify your account before signing in.",
    values: { email, fullName }
  };
}

export async function googleSignInAction(formData: globalThis.FormData) {
  const returnTo = safeReturnTo(formString(formData, "returnTo") || "/profile");
  let redirectUrl: string | null = null;

  try {
    const origin = await requestOrigin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(returnTo)}`
      }
    });

    if (error || !data.url) {
      redirectUrl = `/login?error=${encodeURIComponent(error?.message ?? "Google sign-in failed.")}`;
    } else {
      redirectUrl = data.url;
    }
  } catch (error) {
    redirectUrl = `/login?error=${encodeURIComponent(authErrorMessage(error))}`;
  }

  redirect(redirectUrl);
}

export async function requestPasswordResetAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formString(formData, "email"));

  if (!email) {
    return {
      error: "Email is required.",
      values: { email }
    };
  }

  try {
    const origin = await requestOrigin();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/auth/update-password`
    });

    if (error) {
      return {
        error: error.message,
        values: { email }
      };
    }

    return {
      success: "Check your email for a secure password reset link.",
      values: { email }
    };
  } catch (error) {
    return {
      error: authErrorMessage(error),
      values: { email }
    };
  }
}

export async function updatePasswordAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const password = formString(formData, "password");
  const confirmPassword = formString(formData, "confirmPassword");
  let shouldRedirectToProfile = false;

  if (!password || !confirmPassword) {
    return {
      error: "All fields are required."
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters."
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match."
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      return {
        error: error.message
      };
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      await provisionCurrentUser({});
      shouldRedirectToProfile = true;
    }
  } catch (error) {
    return {
      error: authErrorMessage(error)
    };
  }

  if (shouldRedirectToProfile) {
    redirect("/profile");
  }

  redirect("/login?message=password-updated");
}

export async function logoutAction() {
  try {
    const supabase = await createSupabaseServerClient();

    await supabase.auth.signOut();
  } catch (error) {
    if (!isAuthConfigurationError(error)) {
      throw error;
    }
  }

  redirect("/login");
}
