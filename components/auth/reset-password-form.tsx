"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowRight, KeyRound, LockKeyhole } from "lucide-react";
import type { AuthActionState } from "@/lib/auth/actions";
import { resetPasswordAction } from "@/lib/auth/actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, setState] = useState<AuthActionState>({});
  const [isPending, startTransition] = useTransition();

  function submit(formData: globalThis.FormData) {
    startTransition(async () => {
      setState(await resetPasswordAction({}, formData));
    });
  }

  if (state.success) {
    return (
      <div className="auth-form-stack">
        <div className="auth-success" role="status">
          <KeyRound size={18} aria-hidden="true" />
          <span>{state.success}</span>
        </div>
        <Link className="primary-button auth-submit" href="/login?message=password-updated">
          Login
        </Link>
      </div>
    );
  }

  return (
    <form action={submit} className="auth-form">
      <input name="token" type="hidden" value={token} />
      {state.error ? (
        <div className="auth-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      ) : null}
      <label className="auth-field">
        <span>New password</span>
        <div>
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            autoComplete="new-password"
            name="password"
            placeholder="Enter password"
            required
            type="password"
          />
        </div>
      </label>
      <label className="auth-field">
        <span>Confirm password</span>
        <div>
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            autoComplete="new-password"
            name="confirmPassword"
            placeholder="Repeat password"
            required
            type="password"
          />
        </div>
      </label>
      <button className="primary-button auth-submit" disabled={isPending} type="submit">
        <span>{isPending ? "Please wait..." : "Change password"}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
