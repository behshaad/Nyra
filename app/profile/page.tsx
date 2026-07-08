import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { devLearnerProfile } from "@/lib/learning/sample-content";

export default function ProfilePage() {
  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader currentPath="/profile" />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">Learner Profile</span>
          <h1>Dev learner identity until Supabase Auth lands.</h1>
          <p>
            Auth is deferred, but the product identity boundary is visible: learning data belongs
            to the Learner Profile, not auth metadata.
          </p>
        </div>

        <section className="app-panel route-panel" aria-label="Development learner profile">
          <div className="profile-grid">
            {Object.entries(devLearnerProfile).map(([label, value]) => (
              <article className="meter-card" key={label}>
                <div>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
