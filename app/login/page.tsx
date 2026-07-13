import { ShieldCheck } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth/auth-form";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { getLearnerPreferences, safeReturnTo } from "@/lib/learner/preferences";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{
    returnTo?: string;
    ui?: string;
    error?: string;
    message?: string;
  }>;
}) {
  const { error, message, returnTo, ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/login" />

      <section className="auth-page">
        <div className="auth-copy">
          <span className="section-label">Authentication</span>
          <h1>Login to Nyra</h1>
          <p>
            Continue your German learning path with secure Supabase authentication.
          </p>
          <div className="auth-note">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Your learning space opens with your Nyra profile and progress waiting for you.</span>
          </div>
        </div>

        <section className="app-panel auth-card" aria-labelledby="login-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Welcome back</p>
              <h2 id="login-title">Login</h2>
            </div>
          </div>
          {error ? (
            <div className="auth-error" role="alert">
              <span>{error}</span>
            </div>
          ) : null}
          {message === "password-updated" ? (
            <div className="auth-success" role="status">
              <span>Password changed successfully. You can now sign in.</span>
            </div>
          ) : null}
          <AuthForm mode="login" returnTo={safeReturnTo(returnTo ?? null)} />
        </section>
      </section>
    </main>
  );
}
