"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Chrome,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserRound
} from "lucide-react";
import type { AuthActionState } from "@/lib/auth/actions";
import {
  googleSignInAction,
  loginAction,
  requestPasswordResetAction,
  signupAction
} from "@/lib/auth/actions";

type AuthMode = "login" | "signup";

const initialState: AuthActionState = {};

export function AuthForm({
  mode,
  returnTo = "/profile"
}: {
  mode: AuthMode;
  returnTo?: string;
}) {
  const isLogin = mode === "login";
  const [state, action, isPending] = useActionState(
    isLogin ? loginAction : signupAction,
    initialState
  );
  const [resetState, resetAction, isResetPending] = useActionState(
    requestPasswordResetAction,
    initialState
  );

  return (
    <div className="auth-form-stack">
      <form action={googleSignInAction} className="auth-provider-form">
        <input name="returnTo" type="hidden" value={returnTo} />
        <button className="secondary-button auth-provider-button" type="submit">
          <Chrome size={18} aria-hidden="true" />
          <span>Continue with Google</span>
        </button>
      </form>

      <div className="auth-divider" aria-hidden="true">
        <span>or</span>
      </div>

      <form action={action} className="auth-form">
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
          <div className="auth-form-row">
            <label className="auth-checkbox">
              <input
                defaultChecked={state.values?.remember ?? true}
                name="remember"
                type="checkbox"
              />
              <span>Remember Me</span>
            </label>
            <Link href="/login#forgot-password">Forgot Password</Link>
          </div>
        ) : null}

        <button className="primary-button auth-submit" disabled={isPending} type="submit">
          <span>{isPending ? "Please wait..." : isLogin ? "Login" : "Create Account"}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>

        <p className="auth-switch">
          {isLogin ? "New to Nyra?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </p>
      </form>

      {isLogin ? (
        <form action={resetAction} className="auth-reset-form" id="forgot-password">
          <div>
            <strong>Forgot Password?</strong>
            <span>Send a secure reset link to your email.</span>
          </div>
          {resetState.error ? (
            <div className="auth-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{resetState.error}</span>
            </div>
          ) : null}
          {resetState.success ? (
            <div className="auth-success" role="status">
              <KeyRound size={18} aria-hidden="true" />
              <span>{resetState.success}</span>
            </div>
          ) : null}
          <label className="auth-field">
            <span>Email</span>
            <div>
              <Mail size={18} aria-hidden="true" />
              <input
                autoComplete="email"
                defaultValue={resetState.values?.email ?? state.values?.email ?? ""}
                name="email"
                placeholder="learner@nyra.local"
                required
                type="email"
              />
            </div>
          </label>
          <button className="secondary-button auth-submit" disabled={isResetPending} type="submit">
            <span>{isResetPending ? "Sending..." : "Send reset link"}</span>
          </button>
        </form>
      ) : null}
    </div>
  );
}
