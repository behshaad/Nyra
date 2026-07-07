import Link from "next/link";
import { ArrowRight, BookOpen, ChartNoAxesCombined, Crown, Sparkles } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";

const foundationCards = [
  {
    icon: BookOpen,
    title: "A1 learning path",
    description:
      "Nyra starts with one polished A1 path for Persian speakers learning German."
  },
  {
    icon: Sparkles,
    title: "Human-reviewed content",
    description:
      "Learner-facing content stays deterministic and authored. AI drafting is deferred."
  },
  {
    icon: ChartNoAxesCombined,
    title: "Event-based progress",
    description:
      "Question attempts and session events are preserved before dashboard summaries."
  },
  {
    icon: Crown,
    title: "Premium later",
    description:
      "Pricing is visible now, but real subscriptions wait for the learning loop."
  }
];

export default function Home() {
  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Architecture milestone
          </div>
          <h1>Nyra is becoming a real learning product.</h1>
          <p>
            The prototype is now split into routes with a Prisma/PostgreSQL foundation,
            a deterministic Question Engine, and a focused A1 learning loop.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/learn/family-basics">
              Open first Skill
              <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/learn">
              View learning path
            </Link>
          </div>
        </div>

        <section className="app-panel" aria-label="Nyra foundation">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">First slice</p>
              <h2>A1 · Family basics</h2>
            </div>
            <span className="status-pill">Published</span>
          </div>
          <div className="foundation-grid">
            {foundationCards.map((card) => (
              <article className="feature-card" key={card.title}>
                <card.icon size={22} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
