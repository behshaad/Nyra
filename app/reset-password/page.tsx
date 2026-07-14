import { KeyRound } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { interfaceCopy } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const preferences = await getLearnerPreferences();
  const copy = interfaceCopy[preferences.interfaceLanguage];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={preferences.interfaceLanguage} currentPath="/login" />
      <section className="auth-page">
        <div className="auth-copy">
          <span className="section-label">Account Recovery</span>
          <h1>Choose a new password</h1>
          <p>Use the secure link from your email to set a new Nyra password.</p>
          <div className="auth-note">
            <KeyRound size={18} aria-hidden="true" />
            <span>Reset links expire after 30 minutes.</span>
          </div>
        </div>
        <section className="app-panel auth-card" aria-labelledby="reset-password-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Secure reset</p>
              <h2 id="reset-password-title">Reset Password</h2>
            </div>
          </div>
          <ResetPasswordForm token={token} />
        </section>
      </section>
    </main>
  );
}
