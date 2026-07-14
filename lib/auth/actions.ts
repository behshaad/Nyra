"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import {
  createPasswordAccount,
  normalizeEmail,
  validEmail
} from "@/lib/auth/account";
import { getPrisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { ensureLearnerProfileForIdentity } from "@/lib/auth/nyra-identity";
import {
  consumeAuthToken,
  sendPasswordResetEmail,
  sendVerificationEmail
} from "@/lib/auth/tokens";

export type AuthActionState = {
  error?: string;
  success?: string;
  values?: {
    email?: string;
    fullName?: string;
  };
};

function formString(formData: globalThis.FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function signupAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const fullName = formString(formData, "fullName").trim();
  const email = normalizeEmail(formString(formData, "email"));
  const password = formString(formData, "password");
  const confirmPassword = formString(formData, "confirmPassword");

  if (!fullName || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required.",
      values: { email, fullName }
    };
  }

  if (!validEmail(email)) {
    return {
      error: "Enter a valid email address.",
      values: { email, fullName }
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
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
    const { error, user } = await createPasswordAccount({
      email,
      fullName,
      password
    });

    if (error || !user) {
      return {
        error: error ?? "Unable to create account.",
        values: { email, fullName }
      };
    }

    await ensureLearnerProfileForIdentity({
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      fullName: user.name
    });
    await sendVerificationEmail({
      email: user.email,
      userId: user.id
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create account.",
      values: { email, fullName }
    };
  }

  return {
    success: "Account created. Signing you in...",
    values: { email, fullName }
  };
}

export async function requestPasswordResetAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formString(formData, "email"));
  const success = "If an eligible account exists, you'll receive an email with the next steps.";

  if (!validEmail(email)) {
    return {
      success,
      values: { email }
    };
  }

  const user = await getPrisma().user.findUnique({
    where: {
      email
    }
  });

  if (user?.status === "ACTIVE" && user.emailVerifiedAt) {
    await sendPasswordResetEmail({
      email: user.email,
      userId: user.id
    });
  }

  return {
    success,
    values: { email }
  };
}

export async function resetPasswordAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const token = formString(formData, "token");
  const password = formString(formData, "password");
  const confirmPassword = formString(formData, "confirmPassword");

  if (!token || !password || !confirmPassword) {
    return {
      error: "All fields are required."
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters."
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match."
    };
  }

  const user = await consumeAuthToken(token, "PASSWORD_RESET");

  if (!user) {
    return {
      error: "This reset link is invalid or expired."
    };
  }

  await getPrisma().user.update({
    data: {
      passwordHash: await hashPassword(password)
    },
    where: {
      id: user.id
    }
  });

  return {
    success: "Password changed successfully. You can now sign in."
  };
}

export async function verifyEmailAction(token: string): Promise<AuthActionState> {
  const user = await consumeAuthToken(token, "EMAIL_VERIFICATION");

  if (!user) {
    return {
      error: "This verification link is invalid or expired."
    };
  }

  await getPrisma().user.update({
    data: {
      emailVerifiedAt: user.emailVerifiedAt ?? new Date()
    },
    where: {
      id: user.id
    }
  });

  return {
    success: "Email verified successfully."
  };
}

export async function resendVerificationForSessionAction() {
  const session = await getServerSession(authOptions);
  const userId = session?.user
    ? (session.user as typeof session.user & { id?: string }).id
    : null;

  if (!userId) {
    redirect("/login");
  }

  const user = await getPrisma().user.findUnique({
    where: {
      id: userId
    }
  });

  if (user?.status === "ACTIVE" && !user.emailVerifiedAt) {
    await sendVerificationEmail({
      email: user.email,
      userId: user.id
    });
  }

  redirect("/profile?verification=sent");
}

export async function logoutAction() {
  const cookieStore = await cookies();

  for (const name of [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token"
  ]) {
    cookieStore.delete(name);
  }

  redirect("/login");
}
