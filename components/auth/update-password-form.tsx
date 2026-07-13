"use client";

import { useActionState } from "react";
import { AlertCircle, EyeOff, KeyRound, LockKeyhole } from "lucide-react";
import type { AuthActionState } from "@/lib/auth/actions";
import { updatePasswordAction } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export function UpdatePasswordForm() {
  const [state, action, isPending] = useActionState(
    updatePasswordAction,
    initialState
  );

  return (
    <form action={action} className="auth-form">
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

      <label className="auth-field">
        <span>New Password</span>
        <div>
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            autoComplete="new-password"
            name="password"
            placeholder="Enter new password"
            required
            type="password"
          />
        </div>
      </label>

      <label className="auth-field">
        <span>Confirm Password</span>
        <div>
          <EyeOff size={18} aria-hidden="true" />
          <input
            autoComplete="new-password"
            name="confirmPassword"
            placeholder="Repeat new password"
            required
            type="password"
          />
        </div>
      </label>

      <button className="primary-button auth-submit" disabled={isPending} type="submit">
        <span>{isPending ? "Updating..." : "Update Password"}</span>
      </button>
    </form>
  );
}
