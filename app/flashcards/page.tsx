import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { FlashcardStudy } from "@/components/flashcard-study";
import { flashcards } from "@/lib/flashcards/sample-flashcards";
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

        <FlashcardStudy cards={flashcards} language={language} />
      </section>
    </main>
  );
}
