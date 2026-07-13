import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";

export default function AdminAccessDeniedPage() {
  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath="/admin-access-denied" />

      <section className="route-page admin-route">
        <div className="route-hero">
          <span className="section-label">Admin Access</span>
          <h1>Access denied.</h1>
          <p>
            Your account is signed in, but it does not have active Nyra Admin Access.
          </p>
        </div>

        <section className="app-panel auth-card" aria-labelledby="admin-denied-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Permission required</p>
              <h2 id="admin-denied-title">Admin Access is required</h2>
            </div>
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <p>
            Use a seeded admin account or ask an existing operator to grant Admin Access
            for this authenticated identity.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/profile">
              Back to Profile
            </Link>
            <Link className="secondary-button" href="/">
              Home
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
