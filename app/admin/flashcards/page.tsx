import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { FlashcardStudy } from "@/components/flashcard-study";
import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";
import {
  getAdminFlashcardDecks,
  getFlashcardUnitOptions
} from "@/lib/flashcards/flashcard-repository";

export const dynamic = "force-dynamic";

export default async function AdminFlashcardsPage() {
  const [decks, units] = await Promise.all([
    getAdminFlashcardDecks(),
    getFlashcardUnitOptions()
  ]);
  const cardCount = decks.reduce(
    (total, deck) => total + deck.flashcards.length,
    0
  );

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath="/admin/flashcards" />

      <section className="route-page admin-route">
        <div className="route-hero admin-title-row">
          <Link className="ghost-button" href="/admin">
            <ArrowLeft size={17} />
            Back to Admin
          </Link>
          <span className="section-label">Admin CMS</span>
          <h1>Flashcard Studio.</h1>
          <p>
            Create categorized Flashcard Decks by Level, Unit, and lesson-style grouping.
            Learners can study published admin decks and build personal decks from the
            learner Flashcards page.
          </p>
          <div className="stats-strip">
            <div>
              <strong>{decks.length}</strong>
              <span>Decks</span>
            </div>
            <div>
              <strong>{cardCount}</strong>
              <span>Flashcards</span>
            </div>
            <div>
              <strong>{new Set(decks.map((deck) => deck.category)).size}</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>

        <FlashcardStudy
          adminMode
          ownerType={FlashcardDeckOwnerType.ADMIN}
          decks={decks.map((deck) => ({
            id: deck.id,
            slug: deck.slug,
            title: deck.title,
            description: deck.description,
            levelLabel: deck.levelLabel,
            category: deck.category,
            ownerType: deck.ownerType,
            publicationStatus: deck.publicationStatus,
            unitTitle: deck.unit?.title ?? null,
            flashcards: deck.flashcards.map((card) => ({
              id: card.id,
              front: card.front,
              back: card.back,
              article: card.article,
              example: card.example,
              exampleMeaning: card.exampleMeaning,
              pronunciation: card.pronunciation,
              pronunciationAudioUrl: card.pronunciationAudioUrl,
              publicationStatus: card.publicationStatus,
              difficulty: card.difficulty,
              isDue: true,
              dueAt: null,
              intervalStep: null
            }))
          }))}
          units={units.map((unit) => ({
            id: unit.id,
            title: unit.title,
            levelLabel: unit.level.label
          }))}
          language="en"
        />
      </section>
    </main>
  );
}
