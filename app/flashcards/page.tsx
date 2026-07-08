import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";

const cards = [
  { front: "die Familie", back: "خانواده", state: "Deferred" },
  { front: "der Bruder", back: "برادر", state: "Deferred" },
  { front: "heißen", back: "نام داشتن", state: "Deferred" }
];

export default function FlashcardsPage() {
  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader currentPath="/flashcards" />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">Flashcards</span>
          <h1>Spaced repetition comes after the core loop.</h1>
          <p>
            Flashcards are intentionally scaffolded, but real due-card scheduling waits until
            Question Attempts and Learning Sessions are proven.
          </p>
        </div>

        <div className="mini-panel-grid">
          {cards.map((card) => (
            <article className="flashcard" key={card.front}>
              <div>
                <span>{card.state}</span>
                <h3>{card.front}</h3>
                <p dir="rtl">{card.back}</p>
              </div>
              <div className="mini-progress">
                <span style={{ width: "0%" }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
