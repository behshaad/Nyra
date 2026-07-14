import { UserPlus } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth/auth-form";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";

export default async function SignupPage({
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
      <AppHeader language={language} currentPath="/signup" />

      <section className="auth-page">
        <div className="auth-copy">
          <span className="section-label">New Learner</span>
          <h1>Create your account</h1>
          <p>
            Start with a Nyra account while your Learner Profile stays separate.
          </p>
          <div className="auth-note">
            <UserPlus size={18} aria-hidden="true" />
            <span>Your Learner Profile starts with goals, level, and daily practice preferences.</span>
          </div>
        </div>

        <section className="app-panel auth-card" aria-labelledby="signup-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Join Nyra</p>
              <h2 id="signup-title">Sign Up</h2>
            </div>
          </div>
          <AuthForm
            googleEnabled={Boolean(
              process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            )}
            mode="signup"
          />
        </section>
      </section>
    </main>
  );
}
