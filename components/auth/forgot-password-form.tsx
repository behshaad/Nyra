"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Mail } from "lucide-react";
import type { AuthActionState } from "@/lib/auth/actions";
import { requestPasswordResetAction } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [state, setState] = useState<AuthActionState>({});
  const [isPending, startTransition] = useTransition();

  function submit(formData: globalThis.FormData) {
    startTransition(async () => {
      setState(await requestPasswordResetAction({}, formData));
    });
  }

  return (
    <form action={submit} className="auth-form">
      {state.success ? (
        <div className="auth-success" role="status">
          <span>{state.success}</span>
        </div>
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
      <button className="primary-button auth-submit" disabled={isPending} type="submit">
        <span>{isPending ? "Please wait..." : "Send reset instructions"}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
