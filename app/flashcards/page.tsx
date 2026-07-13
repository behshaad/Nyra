import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { FlashcardLibrary } from "@/components/flashcard-library";
import {
  getFlashcardUnitOptions,
  getLearnerFlashcardDecks
} from "@/lib/flashcards/flashcard-repository";
import { localizeFlashcardDeckForInterface } from "@/lib/flashcards/flashcard-display";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
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
        <FlashcardLibrary
          decks={decks.map((deck) => localizeFlashcardDeckForInterface({
            id: deck.id,
            slug: deck.slug,
            title: deck.title,
            description: deck.description,
            levelLabel: deck.levelLabel,
            category: deck.category,
            iconKey: deck.iconKey,
            colorKey: deck.colorKey,
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
              isDue: card.isDue,
              dueAt: card.reviewState?.dueAt.toISOString() ?? null,
              intervalStep: card.reviewState?.intervalStep ?? null
            }))
          }, language))}
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
