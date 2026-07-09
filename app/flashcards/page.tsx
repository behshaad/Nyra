import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { FlashcardStudy } from "@/components/flashcard-study";
import {
  getFlashcardUnitOptions,
  getLearnerFlashcardDecks
} from "@/lib/flashcards/flashcard-repository";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { flashcardCopy, text } from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";

export default async function FlashcardsPage({
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
  const [decks, units] = await Promise.all([
    getLearnerFlashcardDecks(),
    getFlashcardUnitOptions()
  ]);

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/flashcards" />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">{text(flashcardCopy.label, language)}</span>
          <h1>{text(flashcardCopy.title, language)}</h1>
          <p>{text(flashcardCopy.body, language)}</p>
        </div>

        <FlashcardStudy
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
              difficulty: card.difficulty,
              isDue: card.isDue,
              dueAt: card.reviewState?.dueAt.toISOString() ?? null,
              intervalStep: card.reviewState?.intervalStep ?? null
            }))
          }))}
          units={units.map((unit) => ({
            id: unit.id,
            title: unit.title,
            levelLabel: unit.level.label
          }))}
          language={language}
        />
      </section>
    </main>
  );
}
