import { Check } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";

export default function PricingPage() {
  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">Pricing</span>
          <h1>Static pricing until provider research is done.</h1>
          <p>
            Payments, checkout, webhooks, premium gating, and provider choice are deferred until
            Nyra has the learning loop and regional payment constraints clear.
          </p>
        </div>

        <section className="premium-section standalone">
          <div>
            <span className="section-label">Free now</span>
            <h2>Build trust before billing.</h2>
            <p>
              The MVP should prove that Nyra teaches well before subscriptions are wired.
            </p>
          </div>
          <div className="pricing-card">
            <span className="status-pill bright">Future Premium</span>
            <h3>Nyra Premium</h3>
            <p>Full path access, deeper review, resources, and advanced insights later.</p>
            <ul>
              <li>
                <Check size={18} /> A1 polished first
              </li>
              <li>
                <Check size={18} /> A1-B2 long-term path
              </li>
              <li>
                <Check size={18} /> Flashcards and analytics after core loop
              </li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
