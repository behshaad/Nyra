import { KeyRound } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";

export default async function UpdatePasswordPage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/auth/update-password" />

      <section className="auth-page">
        <div className="auth-copy">
          <span className="section-label">Authentication</span>
          <h1>Update your password</h1>
          <p>Choose a new password for your Nyra account.</p>
          <div className="auth-note">
            <KeyRound size={18} aria-hidden="true" />
            <span>Supabase verifies the reset link before Nyra updates your session.</span>
          </div>
        </div>

        <section className="app-panel auth-card" aria-labelledby="update-password-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Password Reset</p>
              <h2 id="update-password-title">New Password</h2>
            </div>
          </div>
          <UpdatePasswordForm />
        </section>
      </section>
    </main>
  );
}
