"use server";

import { redirect } from "next/navigation";
import {
  createMockSession,
  findMockUser,
  inferRoleFromEmail,
  normalizeEmail
} from "@/lib/auth/mock-session";
import { clearAuthSession, setAuthSession } from "@/lib/auth/server";
import { safeReturnTo } from "@/lib/learner/preferences";

export type AuthActionState = {
  error?: string;
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

export async function loginAction(
  _state: AuthActionState,
  formData: globalThis.FormData
): Promise<AuthActionState> {
  const email = normalizeEmail(formString(formData, "email"));
  const password = formString(formData, "password");
  const remember = formData.get("remember") === "on";
  const returnTo = safeReturnTo(formString(formData, "returnTo"));
  const user = findMockUser(email, password);

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

  await setAuthSession(
    createMockSession({
      email: user?.email ?? email,
      fullName: user?.fullName ?? email.split("@")[0] ?? "Nyra Learner",
      remember,
      role: user?.role ?? inferRoleFromEmail(email)
    })
  );

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

  await setAuthSession(
    createMockSession({
      email,
      fullName,
      remember: true,
      role: inferRoleFromEmail(email)
    })
  );

  redirect("/profile");
}

export async function logoutAction() {
  await clearAuthSession();
  redirect("/login");
}
