import { KeyRound } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { interfaceCopy } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";

export default async function ForgotPasswordPage() {
  const preferences = await getLearnerPreferences();
  const copy = interfaceCopy[preferences.interfaceLanguage];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={preferences.interfaceLanguage} currentPath="/login" />
      <section className="auth-page">
        <div className="auth-copy">
          <span className="section-label">Account Recovery</span>
          <h1>Reset your password</h1>
          <p>Enter your account email and Nyra will send the next steps if the account is eligible.</p>
          <div className="auth-note">
            <KeyRound size={18} aria-hidden="true" />
            <span>Password reset requires a verified email address.</span>
          </div>
        </div>
        <section className="app-panel auth-card" aria-labelledby="forgot-password-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Secure reset</p>
              <h2 id="forgot-password-title">Forgot Password</h2>
            </div>
          </div>
          <ForgotPasswordForm />
        </section>
      </section>
    </main>
  );
}
