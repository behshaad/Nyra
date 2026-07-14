"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserRound
} from "lucide-react";
import type { AuthActionState } from "@/lib/auth/actions";
import { signupAction } from "@/lib/auth/actions";

type AuthMode = "login" | "signup";

export function AuthForm({
  googleEnabled = false,
  mode,
  returnTo = "/profile"
}: {
  googleEnabled?: boolean;
  mode: AuthMode;
  returnTo?: string;
}) {
  const isLogin = mode === "login";
  const [state, setState] = useState<AuthActionState>({});
  const [isPending, startTransition] = useTransition();

  function submitAuth(formData: globalThis.FormData) {
    setState({});

    startTransition(async () => {
      if (isLogin) {
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const password = String(formData.get("password") ?? "");

        if (!email || !password) {
          setState({
            error: "Email and password are required.",
            values: { email }
          });
          return;
        }

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false
        });

        if (!result?.ok) {
          setState({
            error: "Invalid login credentials",
            values: { email }
          });
          return;
        }

        window.location.assign(returnTo);
        return;
      }

      const result = await signupAction({}, formData);

      if (result.error) {
        setState(result);
        return;
      }

      const email = String(formData.get("email") ?? "").trim().toLowerCase();
      const password = String(formData.get("password") ?? "");
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (!signInResult?.ok) {
        setState({
          error: "Account created, but automatic login failed. Please log in.",
          values: { email, fullName: String(formData.get("fullName") ?? "") }
        });
        return;
      }

      window.location.assign("/profile");
    });
  }

  return (
    <div className="auth-form-stack">
      <form action={submitAuth} className="auth-form">
        {isLogin ? <input name="returnTo" type="hidden" value={returnTo} /> : null}

        {state.error ? (
          <div className="auth-error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        ) : null}

        {state.success ? (
          <div className="auth-success" role="status">
            <KeyRound size={18} aria-hidden="true" />
            <span>{state.success}</span>
          </div>
        ) : null}

        {!isLogin ? (
          <label className="auth-field">
            <span>Full Name</span>
            <div>
              <UserRound size={18} aria-hidden="true" />
              <input
                autoComplete="name"
                defaultValue={state.values?.fullName ?? ""}
                name="fullName"
                placeholder="Your name"
                required
              />
            </div>
          </label>
        ) : null}

        <label className="auth-field">
          <span>Email</span>
          <div>
            <Mail size={18} aria-hidden="true" />
            <input
              autoComplete="email"
              defaultValue={state.values?.email ?? ""}
              name="email"
              placeholder="learner@nyra.local"
              required
              type="email"
            />
          </div>
        </label>

        <label className="auth-field">
          <span>Password</span>
          <div>
            <LockKeyhole size={18} aria-hidden="true" />
              <input
                autoComplete={isLogin ? "current-password" : "new-password"}
                name="password"
                placeholder="Enter password"
                required
              type="password"
            />
          </div>
        </label>

        {!isLogin ? (
          <label className="auth-field">
            <span>Confirm Password</span>
            <div>
              <EyeOff size={18} aria-hidden="true" />
              <input
                autoComplete="new-password"
                name="confirmPassword"
                placeholder="Repeat password"
                required
                type="password"
              />
            </div>
          </label>
        ) : null}

        {isLogin ? (
          <Link className="auth-small-link" href="/forgot-password">
            Forgot password?
          </Link>
        ) : null}

        <button className="primary-button auth-submit" disabled={isPending} type="submit">
          <span>{isPending ? "Please wait..." : isLogin ? "Login" : "Create Account"}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>

        {googleEnabled ? (
          <button
            className="secondary-button auth-submit"
            disabled={isPending}
            onClick={() => {
              void signIn("google", {
                callbackUrl: returnTo
              });
            }}
            type="button"
          >
            <BadgeCheck size={18} aria-hidden="true" />
            <span>Continue with Google</span>
          </button>
        ) : null}

        <p className="auth-switch">
          {isLogin ? "New to Nyra?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
}
