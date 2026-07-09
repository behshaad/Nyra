"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  CheckCircle2,
  Layers3,
  Plus,
  RotateCcw,
  Save,
  Volume2,
  XCircle
} from "lucide-react";
import {
  FlashcardDeckOwnerType,
  FlashcardDifficulty,
  FlashcardReviewResult,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";

export type FlashcardWorkspaceCard = {
  id: string;
  front: string;
  back: string;
  article: string | null;
  example: string;
  exampleMeaning: string;
  pronunciation: string | null;
  pronunciationAudioUrl: string | null;
  difficulty: FlashcardDifficulty;
  isDue: boolean;
  dueAt: string | null;
  intervalStep: number | null;
};

export type FlashcardWorkspaceDeck = {
  id: string;
  slug: string;
  title: string;
  description: string;
  levelLabel: string;
  category: string;
  ownerType: FlashcardDeckOwnerType;
  publicationStatus: PublicationStatus;
  unitTitle: string | null;
  flashcards: FlashcardWorkspaceCard[];
};

type UnitOption = {
  id: string;
  title: string;
  levelLabel: string;
};

type CardStatus = "known" | "unknown";

const labels = {
  fa: {
    study: "مطالعه",
    review: "مرور",
    level: "سطح",
    category: "دسته",
    deck: "دسته فلش‌کارت",
    all: "همه",
    allDue: "همه کارت‌های موعددار",
    flip: "برگردان",
    known: "بلدم",
    unknown: "نیاز به مرور",
    progress: "پیشرفت",
    pronunciation: "تلفظ",
    pronunciationAudio: "فایل صوتی تلفظ",
    noPronunciationAudio: "بدون فایل صوتی",
    example: "مثال",
    difficulty: "سختی",
    reset: "شروع دوباره",
    createDeck: "ساخت دسته",
    addCard: "افزودن فلش‌کارت",
    title: "عنوان",
    slug: "اسلاگ",
    description: "توضیح",
    unit: "یونیت مرتبط",
    noUnit: "بدون یونیت",
    front: "روی کارت",
    back: "پشت کارت",
    article: "آرتیکل",
    exampleMeaning: "معنی مثال",
    notes: "یادداشت",
    saveDeck: "ذخیره دسته",
    saveCard: "ذخیره کارت",
    empty: "برای شروع یک دسته فلش‌کارت بساز یا یک دسته دیگر انتخاب کن.",
    stepOne: "۱",
    stepTwo: "۲",
    stepOneBody: "اول دسته را بساز یا از فهرست سمت راست انتخاب کن.",
    stepTwoBody: "بعد کارت‌های مربوط به همان دسته را اضافه کن.",
    selectedDeck: "دسته انتخاب‌شده",
    noDeckSelected: "اول یک دسته انتخاب یا ایجاد کن.",
    admin: "ادمین",
    learner: "شخصی"
  },
  en: {
    study: "Study",
    review: "Review",
    level: "Level",
    category: "Category",
    deck: "Flashcard Deck",
    all: "All",
    allDue: "All due cards",
    flip: "Flip",
    known: "Known",
    unknown: "Needs review",
    progress: "Progress",
    pronunciation: "Pronunciation",
    pronunciationAudio: "Pronunciation audio file",
    noPronunciationAudio: "No audio file",
    example: "Example",
    difficulty: "Difficulty",
    reset: "Reset",
    createDeck: "Create category",
    addCard: "Add flashcard",
    title: "Title",
    slug: "Slug",
    description: "Description",
    unit: "Related Unit",
    noUnit: "No Unit",
    front: "Front",
    back: "Back",
    article: "Article",
    exampleMeaning: "Example meaning",
    notes: "Notes",
    saveDeck: "Save category",
    saveCard: "Save card",
    empty: "Create a Flashcard Deck or choose another deck to start.",
    stepOne: "1",
    stepTwo: "2",
    stepOneBody: "Create the category first, or select an existing deck from the sidebar.",
    stepTwoBody: "Then add Flashcards that belong to the selected category.",
    selectedDeck: "Selected deck",
    noDeckSelected: "Select or create a category first.",
    admin: "Admin",
    learner: "Personal"
  },
  de: {
    study: "Lernen",
    review: "Wiederholen",
    level: "Niveau",
    category: "Kategorie",
    deck: "Kartendeck",
    all: "Alle",
    allDue: "Alle faelligen Karten",
    flip: "Drehen",
    known: "Bekannt",
    unknown: "Wiederholen",
    progress: "Fortschritt",
    pronunciation: "Aussprache",
    pronunciationAudio: "Aussprache-Audiodatei",
    noPronunciationAudio: "Keine Audiodatei",
    example: "Beispiel",
    difficulty: "Schwierigkeit",
    reset: "Zuruecksetzen",
    createDeck: "Kategorie erstellen",
    addCard: "Karte hinzufuegen",
    title: "Titel",
    slug: "Slug",
    description: "Beschreibung",
    unit: "Verknuepfte Einheit",
    noUnit: "Keine Einheit",
    front: "Vorderseite",
    back: "Rueckseite",
    article: "Artikel",
    exampleMeaning: "Beispielbedeutung",
    notes: "Notizen",
    saveDeck: "Kategorie speichern",
    saveCard: "Karte speichern",
    empty: "Erstelle ein Kartendeck oder waehle ein anderes Deck.",
    stepOne: "1",
    stepTwo: "2",
    stepOneBody: "Erstelle zuerst die Kategorie oder waehle ein bestehendes Deck.",
    stepTwoBody: "Fuege danach Karten zur ausgewaehlten Kategorie hinzu.",
    selectedDeck: "Ausgewaehltes Deck",
    noDeckSelected: "Waehle oder erstelle zuerst eine Kategorie.",
    admin: "Admin",
    learner: "Persoenlich"
  }
} satisfies Record<InterfaceLanguageCode, Record<string, string>>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTextDirection(value: string): "rtl" | "ltr" {
  const hasPersianOrArabic = /[\u0600-\u06FF]/.test(value);
  const hasLatin = /[A-Za-zÄÖÜäöüß]/.test(value);

  return hasLatin && !hasPersianOrArabic ? "ltr" : "rtl";
}

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | { error?: string };

  if (!response.ok) {
    const maybeError = data as { error?: string };

    throw new Error(maybeError.error ?? "Request failed.");
  }

  return data as T;
}

export function FlashcardStudy({
  decks,
  units,
  language,
  ownerType = FlashcardDeckOwnerType.LEARNER,
  adminMode = false
}: {
  decks: FlashcardWorkspaceDeck[];
  units: UnitOption[];
  language: InterfaceLanguageCode;
  ownerType?: FlashcardDeckOwnerType;
  adminMode?: boolean;
}) {
  const router = useRouter();
  const copy = labels[language];
  const [mode, setMode] = useState<"study" | "review">("study");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [deckId, setDeckId] = useState(decks[0]?.id ?? "");
  const [reviewScope, setReviewScope] = useState<"deck" | "all-due">("deck");
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<Record<string, CardStatus>>({});
  const [deckTitle, setDeckTitle] = useState("");
  const [deckSlug, setDeckSlug] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckLevelLabel, setDeckLevelLabel] = useState("A1");
  const [deckCategory, setDeckCategory] = useState(adminMode ? "Lesson 1" : "Custom");
  const [unitId, setUnitId] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [article, setArticle] = useState("");
  const [example, setExample] = useState("");
  const [exampleMeaning, setExampleMeaning] = useState("");
  const [pronunciationAudioUrl, setPronunciationAudioUrl] = useState("");
  const [difficulty, setDifficulty] = useState<FlashcardDifficulty>(
    FlashcardDifficulty.MEDIUM
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittingDeck, setSubmittingDeck] = useState(false);
  const [submittingCard, setSubmittingCard] = useState(false);
  const [reviewingCardId, setReviewingCardId] = useState<string | null>(null);

  const levels = useMemo(
    () => [...new Set(decks.map((deck) => deck.levelLabel))],
    [decks]
  );
  const categories = useMemo(
    () => [...new Set(decks.map((deck) => deck.category))],
    [decks]
  );
  const visibleDecks = decks.filter((deck) => {
    const levelMatch = level === "all" || deck.levelLabel === level;
    const categoryMatch = category === "all" || deck.category === category;

    return levelMatch && categoryMatch;
  });
  const activeDeck =
    visibleDecks.find((deck) => deck.id === deckId) ?? visibleDecks[0] ?? null;
  const activeCards = activeDeck?.flashcards ?? [];
  const dueCards = visibleDecks.flatMap((deck) =>
    deck.flashcards.filter((card) => card.isDue || status[card.id] === "unknown")
  );
  const reviewCards =
    reviewScope === "all-due"
      ? dueCards
      : activeCards.filter((card) => card.isDue || status[card.id] === "unknown");
  const filteredCards =
    mode === "study"
      ? activeCards
      : reviewCards.filter((card) => status[card.id] !== "known");
  const active = filteredCards[activeIndex % Math.max(filteredCards.length, 1)];
  const knownCount = activeCards.filter((card) => status[card.id] === "known").length;
  const progress =
    activeCards.length === 0 ? 0 : Math.round((knownCount / activeCards.length) * 100);

  function selectDeck(nextDeckId: string) {
    setDeckId(nextDeckId);
    setReviewScope("deck");
    setActiveIndex(0);
    setFlipped(false);
  }

  async function mark(nextStatus: CardStatus) {
    if (!active) {
      return;
    }

    if (mode === "review") {
      setReviewingCardId(active.id);
      setError(null);

      try {
        await readJson<{ flashcardId: string; dueAt: string }>(
          await fetch("/api/flashcard-reviews", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              flashcardId: active.id,
              result:
                nextStatus === "known"
                  ? FlashcardReviewResult.KNOWN
                  : FlashcardReviewResult.UNKNOWN
            })
          })
        );
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : "Unable to save review."
        );
        setReviewingCardId(null);
        return;
      } finally {
        setReviewingCardId(null);
      }
    }

    setStatus((current) => ({
      ...current,
      [active.id]: nextStatus
    }));
    setFlipped(false);
    setActiveIndex((index) => index + 1);
  }

  function updateDeckTitle(value: string) {
    setDeckTitle(value);

    if (!deckSlug) {
      setDeckSlug(slugify(value));
    }
  }

  function speakPrompt() {
    if (
      !active ||
      typeof globalThis.speechSynthesis === "undefined" ||
      typeof globalThis.SpeechSynthesisUtterance === "undefined"
    ) {
      return;
    }

    const utterance = new globalThis.SpeechSynthesisUtterance(
      `${active.article ? `${active.article} ` : ""}${active.front}`
    );
    utterance.lang = "de-DE";
    globalThis.speechSynthesis.speak(utterance);
  }

  function pronounce() {
    if (!active) {
      return;
    }

    if (active.pronunciationAudioUrl) {
      const audio = new globalThis.Audio(active.pronunciationAudioUrl);

      void audio.play().catch(() => {
        speakPrompt();
      });
      return;
    }

    speakPrompt();
  }

  async function submitDeck(event: FormEvent) {
    event.preventDefault();
    setSubmittingDeck(true);
    setError(null);

    try {
      await readJson<{ id: string; slug: string }>(
        await fetch("/api/flashcard-decks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: deckTitle,
            slug: deckSlug,
            description: deckDescription,
            levelLabel: deckLevelLabel,
            category: deckCategory,
            ownerType,
            publicationStatus: adminMode
              ? PublicationStatus.PUBLISHED
              : PublicationStatus.PUBLISHED,
            unitId
          })
        })
      );
      setDeckTitle("");
      setDeckSlug("");
      setDeckDescription("");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save deck.");
    } finally {
      setSubmittingDeck(false);
    }
  }

  async function submitCard(event: FormEvent) {
    event.preventDefault();
    setSubmittingCard(true);
    setError(null);

    try {
      await readJson<{ id: string }>(
        await fetch("/api/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            deckId: activeDeck?.id,
            front,
            back,
            article,
            example,
            exampleMeaning,
            pronunciationAudioUrl,
            difficulty,
            notes
          })
        })
      );
      setFront("");
      setBack("");
      setArticle("");
      setExample("");
      setExampleMeaning("");
      setPronunciationAudioUrl("");
      setNotes("");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save flashcard.");
    } finally {
      setSubmittingCard(false);
    }
  }

  return (
    <section className="flashcard-workspace" aria-label={copy.study}>
      <aside className="app-panel flashcard-sidebar">
        <div className="flashcard-sidebar-header">
          <div>
            <span className="section-label">{copy.deck}</span>
            <strong>{activeDeck?.title ?? copy.empty}</strong>
          </div>
          <small>
            {activeDeck
              ? `${activeDeck.levelLabel} · ${activeDeck.category} · ${activeDeck.flashcards.length} cards`
              : copy.all}
          </small>
        </div>

        <div className="segmented-control" role="group" aria-label="Flashcard mode">
          <button
            className={mode === "study" ? "active" : undefined}
            type="button"
            onClick={() => {
              setMode("study");
              setReviewScope("deck");
              setActiveIndex(0);
            }}
          >
            {copy.study}
          </button>
          <button
            className={mode === "review" ? "active" : undefined}
            type="button"
            onClick={() => {
              setMode("review");
              setActiveIndex(0);
            }}
          >
            {copy.review}
          </button>
        </div>

        {mode === "review" ? (
          <div className="segmented-control" role="group" aria-label="Review scope">
            <button
              className={reviewScope === "deck" ? "active" : undefined}
              type="button"
              onClick={() => {
                setReviewScope("deck");
                setActiveIndex(0);
              }}
            >
              {copy.deck}
            </button>
            <button
              className={reviewScope === "all-due" ? "active" : undefined}
              type="button"
              onClick={() => {
                setReviewScope("all-due");
                setActiveIndex(0);
              }}
            >
              {copy.allDue}
            </button>
          </div>
        ) : null}

        <div className="flashcard-filter-grid">
          <label>
            <span>{copy.level}</span>
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">{copy.all}</option>
              {levels.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{copy.category}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">{copy.all}</option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flashcard-deck-list">
          {visibleDecks.map((deck) => (
            <button
              className={clsx("flashcard-deck-chip", activeDeck?.id === deck.id && "active")}
              key={deck.id}
              type="button"
              onClick={() => selectDeck(deck.id)}
            >
              <Layers3 size={15} />
              <span>
                <strong>{deck.title}</strong>
                <small>
                  {deck.levelLabel} · {deck.category} ·{" "}
                  {deck.flashcards.filter((card) => card.isDue).length}/{deck.flashcards.length} due ·{" "}
                  {deck.ownerType === FlashcardDeckOwnerType.ADMIN
                    ? copy.admin
                    : copy.learner}
                </small>
              </span>
            </button>
          ))}
        </div>

        <div className="flashcard-progress">
          <div>
            <strong>{progress}%</strong>
            <span>{copy.progress}</span>
          </div>
          <div className="mini-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setStatus({});
            setActiveIndex(0);
            setFlipped(false);
          }}
        >
          <RotateCcw size={17} />
          {copy.reset}
        </button>
      </aside>

      <div className="flashcard-stage">
        {activeDeck ? (
          <div className="flashcard-deck-heading">
            <div>
              <span className="section-label">
                {activeDeck.levelLabel} · {activeDeck.category}
              </span>
              <h2>{activeDeck.title}</h2>
              <p>{activeDeck.description}</p>
            </div>
            <span className="status-pill">
              {activeDeck.flashcards.length} cards
            </span>
          </div>
        ) : null}

        {active ? (
          <>
            <button
              className={`study-card ${flipped ? "flipped" : ""}`}
              type="button"
              onClick={() => setFlipped((value) => !value)}
            >
              <span className="section-label">
                {activeDeck?.levelLabel} · {copy.difficulty}:{" "}
                {active.difficulty.toLowerCase()}
                {mode === "review" ? ` · due` : ""}
              </span>
              <div className="study-card-face">
                <h2 dir="ltr">
                  {active.article ? <small>{active.article}</small> : null}
                  {active.front}
                </h2>
                <p>{copy.flip}</p>
              </div>
              <div className="study-card-back">
                <h2>{active.back}</h2>
                <p>
                  <strong>{copy.example}</strong>
                  <span dir="ltr">{active.example}</span>
                  <small>{active.exampleMeaning}</small>
                </p>
              </div>
            </button>

            <div className="flashcard-actions">
              <button
                className="secondary-button"
                disabled={!active.pronunciationAudioUrl}
                type="button"
                onClick={pronounce}
              >
                <Volume2 size={18} />
                {active.pronunciationAudioUrl
                  ? copy.pronunciationAudio
                  : copy.noPronunciationAudio}
              </button>
              <button
                className="danger-button"
                disabled={reviewingCardId === active.id}
                type="button"
                onClick={() => void mark("unknown")}
              >
                <XCircle size={18} />
                {copy.unknown}
              </button>
              <button
                className="primary-button"
                disabled={reviewingCardId === active.id}
                type="button"
                onClick={() => void mark("known")}
              >
                <CheckCircle2 size={18} />
                {copy.known}
              </button>
            </div>
          </>
        ) : (
          <article className="app-panel empty-state">
            <h2>{copy.progress}: {progress}%</h2>
            <p>{copy.empty}</p>
          </article>
        )}

        <section className="flashcard-editor-flow">
          <form className="app-panel admin-form flashcard-step-card" onSubmit={submitDeck}>
            <div className="flashcard-step-header">
              <span>{copy.stepOne}</span>
              <div>
                <p className="panel-kicker">{copy.category}</p>
                <h2>{copy.createDeck}</h2>
                <small>{copy.stepOneBody}</small>
              </div>
              <Plus size={20} />
            </div>
            <div className="form-grid flashcard-category-grid">
              <label>
                <span>{copy.title}</span>
                <input
                  required
                  value={deckTitle}
                  onChange={(event) => updateDeckTitle(event.target.value)}
                  placeholder="A2 Lesson 1"
                />
              </label>
              <label>
                <span>{copy.slug}</span>
                <input
                  required
                  value={deckSlug}
                  onChange={(event) => setDeckSlug(slugify(event.target.value))}
                  placeholder="a2-lesson-1"
                />
              </label>
              <label>
                <span>{copy.level}</span>
                <input
                  required
                  value={deckLevelLabel}
                  onChange={(event) => setDeckLevelLabel(event.target.value)}
                />
              </label>
              <label>
                <span>{copy.category}</span>
                <input
                  required
                  value={deckCategory}
                  onChange={(event) => setDeckCategory(event.target.value)}
                />
              </label>
              <label className="form-grid-wide">
                <span>{copy.unit}</span>
                <select value={unitId} onChange={(event) => setUnitId(event.target.value)}>
                  <option value="">{copy.noUnit}</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.levelLabel} · {unit.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-grid-wide">
                <span>{copy.description}</span>
                <textarea
                  required
                  rows={3}
                  value={deckDescription}
                  onChange={(event) => setDeckDescription(event.target.value)}
                  placeholder="30 essential flashcards for the first A2 lesson."
                />
              </label>
            </div>
            <button className="primary-button" disabled={submittingDeck} type="submit">
              <Save size={17} />
              {submittingDeck ? "Saving..." : copy.saveDeck}
            </button>
          </form>

          <form
            className={clsx(
              "app-panel admin-form flashcard-step-card",
              !activeDeck && "disabled"
            )}
            onSubmit={submitCard}
          >
            <div className="flashcard-step-header">
              <span>{copy.stepTwo}</span>
              <div>
                <p className="panel-kicker">
                  {activeDeck ? copy.selectedDeck : copy.deck}
                </p>
                <h2>{copy.addCard}</h2>
                <small>
                  {activeDeck
                    ? `${activeDeck.title} · ${activeDeck.levelLabel} · ${activeDeck.category}`
                    : copy.noDeckSelected}
                </small>
              </div>
              <Plus size={20} />
            </div>
            <p className="flashcard-step-note">{copy.stepTwoBody}</p>
            <div className="form-grid">
              <label>
                <span>{copy.front}</span>
                <input
                  required
                  disabled={!activeDeck}
                  dir={getTextDirection(front)}
                  value={front}
                  onChange={(event) => setFront(event.target.value)}
                  placeholder="der Alltag"
                />
              </label>
              <label>
                <span>{copy.back}</span>
                <input
                  required
                  disabled={!activeDeck}
                  dir={getTextDirection(back)}
                  value={back}
                  onChange={(event) => setBack(event.target.value)}
                  placeholder="زندگی روزمره"
                />
              </label>
              <label>
                <span>{copy.article}</span>
                <input
                  disabled={!activeDeck}
                  value={article}
                  onChange={(event) => setArticle(event.target.value)}
                />
              </label>
              <label>
                <span>{copy.difficulty}</span>
                <select
                  disabled={!activeDeck}
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value as FlashcardDifficulty)}
                >
                  {Object.values(FlashcardDifficulty).map((option) => (
                    <option key={option} value={option}>
                      {option.toLowerCase()}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-grid-wide">
                <span>{copy.example}</span>
                <input
                  required
                  disabled={!activeDeck}
                  dir="ltr"
                  value={example}
                  onChange={(event) => setExample(event.target.value)}
                  placeholder="Mein Alltag ist jetzt ruhiger."
                />
              </label>
              <label className="form-grid-wide">
                <span>{copy.exampleMeaning}</span>
                <input
                  required
                  disabled={!activeDeck}
                  value={exampleMeaning}
                  onChange={(event) => setExampleMeaning(event.target.value)}
                  placeholder="زندگی روزمره من حالا آرام‌تر است."
                />
              </label>
              <label className="form-grid-wide">
                <span>{copy.pronunciationAudio}</span>
                <input
                  disabled={!activeDeck}
                  dir="ltr"
                  value={pronunciationAudioUrl}
                  onChange={(event) => setPronunciationAudioUrl(event.target.value)}
                  placeholder="/audio/flashcards/a2/alltag.mp3"
                />
              </label>
              <label>
                <span>{copy.notes}</span>
                <input
                  disabled={!activeDeck}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>
            {error ? <div className="feedback wrong">{error}</div> : null}
            <button
              className="primary-button"
              disabled={submittingCard || !activeDeck}
              type="submit"
            >
              <Save size={17} />
              {submittingCard ? "Saving..." : copy.saveCard}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
