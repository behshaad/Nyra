import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { verifyEmailAction } from "@/lib/auth/actions";
import { interfaceCopy } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const preferences = await getLearnerPreferences();
  const copy = interfaceCopy[preferences.interfaceLanguage];
  const result = token
    ? await verifyEmailAction(token)
    : { error: "This verification link is invalid or expired." };

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={preferences.interfaceLanguage} currentPath="/profile" />
      <section className="auth-page">
        <div className="auth-copy">
          <span className="section-label">Email Verification</span>
          <h1>{result.success ? "Email verified" : "Verification needed"}</h1>
          <p>
            {result.success
              ? "Your Nyra account email is verified for sensitive account operations."
              : "This verification link could not be used. Request a new link from your profile."}
          </p>
          <div className={result.success ? "auth-note" : "auth-error"}>
            <MailCheck size={18} aria-hidden="true" />
            <span>{result.success ?? result.error}</span>
          </div>
          <Link className="primary-button compact" href="/profile">
            Continue to profile
          </Link>
        </div>
      </section>
    </main>
  );
}
