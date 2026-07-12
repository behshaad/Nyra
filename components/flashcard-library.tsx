"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers3,
  MessageCircle,
  PenLine,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
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

export type FlashcardLibraryCard = {
  id: string;
  front: string;
  back: string;
  article: string | null;
  example: string;
  exampleMeaning: string;
  pronunciation: string | null;
  pronunciationAudioUrl: string | null;
  difficulty: FlashcardDifficulty;
  publicationStatus: PublicationStatus;
  isDue: boolean;
  dueAt: string | null;
  intervalStep: number | null;
};

export type FlashcardLibraryDeck = {
  id: string;
  slug: string;
  title: string;
  description: string;
  levelLabel: string;
  category: string;
  iconKey: string;
  colorKey: string;
  ownerType: FlashcardDeckOwnerType;
  publicationStatus: PublicationStatus;
  unitTitle: string | null;
  flashcards: FlashcardLibraryCard[];
};

type DeckResponse = Omit<FlashcardLibraryDeck, "unitTitle" | "flashcards"> & {
  unitId: string | null;
};

type CardResponse = Omit<
  FlashcardLibraryCard,
  "isDue" | "dueAt" | "intervalStep"
> & {
  deckId: string;
};

type CardStatus = "known" | "unknown";
type Layer = "home" | "deck" | "create" | "edit";
type CreateStep = "deck" | "cards" | "finish";
type SessionMode = "study" | "review";

const deckIconKeys = [
  "layers-3",
  "book-open",
  "sparkles",
  "graduation-cap",
  "pen-line",
  "message-circle"
] as const;

const deckColorKeys = ["teal", "rose", "amber", "indigo", "emerald", "slate"] as const;

const deckIcons = {
  "layers-3": Layers3,
  "book-open": BookOpen,
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
  "pen-line": PenLine,
  "message-circle": MessageCircle
};

const labels = {
  fa: {
    readyMade: "فلش‌کارت‌های آماده",
    mine: "فلش‌کارت‌های من",
    emptyMine: "هنوز دسته شخصی نساخته‌ای. از دکمه افزودن شروع کن.",
    addDeck: "افزودن دسته",
    back: "بازگشت",
    study: "مطالعه",
    review: "مرور",
    known: "بلدم",
    unknown: "نیاز به مرور",
    flip: "برگردان",
    due: "موعددار",
    cards: "کارت",
    noCards: "هنوز کارتی ندارد",
    readySubtitle: "دسته‌های آماده Nyra برای مرور هدفمند.",
    mineSubtitle: "دسته‌های شخصی که خودت می‌سازی.",
    createTitle: "ساخت دسته شخصی",
    editTitle: "ویرایش دسته",
    deckName: "نام دسته",
    description: "توضیح اختیاری",
    icon: "آیکن",
    color: "رنگ",
    continue: "ادامه",
    save: "ذخیره",
    finish: "پایان",
    finishEmpty: "پایان بدون کارت",
    stepDeck: "هویت دسته",
    stepCards: "کارت‌ها",
    stepFinish: "آماده است",
    addCard: "افزودن کارت",
    updateCard: "ذخیره کارت",
    front: "آلمانی",
    backText: "پشتیبانی فارسی",
    example: "مثال اختیاری",
    exampleMeaning: "معنی مثال اختیاری",
    article: "آرتیکل اختیاری",
    edit: "ویرایش",
    delete: "حذف",
    settings: "تنظیمات",
    studyNow: "مطالعه کن",
    backHome: "بازگشت به فلش‌کارت‌ها",
    finishBody: "دسته شخصی تو آماده است و در بخش فلش‌کارت‌های من دیده می‌شود.",
    emptyDeck: "اولین کارت را اضافه کن یا بعداً برگرد.",
    reviewComplete: "مرور این دسته کامل شد.",
    noReviewCards: "فعلاً کارتی برای مرور نیست.",
    prepared: "آماده",
    personal: "شخصی",
    confirmDeleteDeck: "این دسته شخصی و همه کارت‌هایش حذف شوند؟",
    confirmDeleteCard: "این کارت حذف شود؟",
    pronunciation: "تلفظ",
    noDescription: "بدون توضیح",
    deckNameRequired: "نام دسته لازم است."
  },
  en: {
    readyMade: "Ready-made Flashcards",
    mine: "My Flashcards",
    emptyMine: "You have not created a personal deck yet. Start with the add button.",
    addDeck: "Add deck",
    back: "Back",
    study: "Study",
    review: "Review",
    known: "Known",
    unknown: "Needs review",
    flip: "Flip",
    due: "due",
    cards: "cards",
    noCards: "No cards yet",
    readySubtitle: "Nyra-prepared decks for focused review.",
    mineSubtitle: "Personal decks you create for your own study.",
    createTitle: "Create personal deck",
    editTitle: "Edit deck",
    deckName: "Deck name",
    description: "Optional description",
    icon: "Icon",
    color: "Color",
    continue: "Continue",
    save: "Save",
    finish: "Finish",
    finishEmpty: "Finish without cards",
    stepDeck: "Deck identity",
    stepCards: "Cards",
    stepFinish: "Ready",
    addCard: "Add card",
    updateCard: "Save card",
    front: "German",
    backText: "Persian support",
    example: "Optional example",
    exampleMeaning: "Optional example meaning",
    article: "Optional article",
    edit: "Edit",
    delete: "Delete",
    settings: "Settings",
    studyNow: "Study now",
    backHome: "Back to Flashcards",
    finishBody: "Your personal deck is ready and visible in My Flashcards.",
    emptyDeck: "Add the first card, or come back later.",
    reviewComplete: "This review is complete.",
    noReviewCards: "No cards are ready for review right now.",
    prepared: "Ready-made",
    personal: "Personal",
    confirmDeleteDeck: "Delete this personal deck and all of its cards?",
    confirmDeleteCard: "Delete this card?",
    pronunciation: "Pronunciation",
    noDescription: "No description",
    deckNameRequired: "Deck name is required."
  },
  de: {
    readyMade: "Fertige Karteikarten",
    mine: "Meine Karteikarten",
    emptyMine: "Du hast noch kein persoenliches Deck erstellt. Starte mit dem Plus.",
    addDeck: "Deck hinzufuegen",
    back: "Zurueck",
    study: "Lernen",
    review: "Wiederholen",
    known: "Bekannt",
    unknown: "Wiederholen",
    flip: "Drehen",
    due: "faellig",
    cards: "Karten",
    noCards: "Noch keine Karten",
    readySubtitle: "Von Nyra vorbereitete Decks fuer gezielte Wiederholung.",
    mineSubtitle: "Persoenliche Decks fuer dein eigenes Lernen.",
    createTitle: "Persoenliches Deck erstellen",
    editTitle: "Deck bearbeiten",
    deckName: "Deckname",
    description: "Optionale Beschreibung",
    icon: "Icon",
    color: "Farbe",
    continue: "Weiter",
    save: "Speichern",
    finish: "Fertig",
    finishEmpty: "Ohne Karten beenden",
    stepDeck: "Deck-Identitaet",
    stepCards: "Karten",
    stepFinish: "Bereit",
    addCard: "Karte hinzufuegen",
    updateCard: "Karte speichern",
    front: "Deutsch",
    backText: "Persische Hilfe",
    example: "Optionales Beispiel",
    exampleMeaning: "Optionale Beispielbedeutung",
    article: "Optionaler Artikel",
    edit: "Bearbeiten",
    delete: "Loeschen",
    settings: "Einstellungen",
    studyNow: "Jetzt lernen",
    backHome: "Zurueck zu Karteikarten",
    finishBody: "Dein persoenliches Deck ist bereit und unter Meine Karteikarten sichtbar.",
    emptyDeck: "Fuege die erste Karte hinzu oder komm spaeter zurueck.",
    reviewComplete: "Diese Wiederholung ist fertig.",
    noReviewCards: "Aktuell sind keine Karten zur Wiederholung bereit.",
    prepared: "Fertig",
    personal: "Persoenlich",
    confirmDeleteDeck: "Dieses persoenliche Deck und alle Karten loeschen?",
    confirmDeleteCard: "Diese Karte loeschen?",
    pronunciation: "Aussprache",
    noDescription: "Keine Beschreibung",
    deckNameRequired: "Deckname ist erforderlich."
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

function derivedColorKey(value: string) {
  const total = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return deckColorKeys[total % deckColorKeys.length];
}

function cleanDeckResponse(deck: DeckResponse): FlashcardLibraryDeck {
  return {
    ...deck,
    unitTitle: null,
    flashcards: []
  };
}

function cleanCardResponse(card: CardResponse): FlashcardLibraryCard {
  return {
    ...card,
    isDue: true,
    dueAt: null,
    intervalStep: null
  };
}

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | { error?: string };

  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? "Request failed.");
  }

  return data as T;
}

export function FlashcardLibrary({
  decks,
  language
}: {
  decks: FlashcardLibraryDeck[];
  units: Array<{ id: string; title: string; levelLabel: string }>;
  language: InterfaceLanguageCode;
}) {
  const copy = labels[language];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const isRtl = language === "fa";
  const [libraryDecks, setLibraryDecks] = useState(decks);
  const [createStep, setCreateStep] = useState<CreateStep>("deck");
  const [sessionMode, setSessionMode] = useState<SessionMode>("study");
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<FlashcardLibraryCard[]>([]);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckIconKey, setDeckIconKey] = useState<(typeof deckIconKeys)[number]>("layers-3");
  const [deckColorKey, setDeckColorKey] = useState<(typeof deckColorKeys)[number]>("teal");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [article, setArticle] = useState("");
  const [example, setExample] = useState("");
  const [exampleMeaning, setExampleMeaning] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const flow = searchParams.get("flow");
  const deckId = searchParams.get("deck") ?? "";
  const layer: Layer = flow === "create" ? "create" : flow === "edit" ? "edit" : deckId ? "deck" : "home";
  const activeDeck = libraryDecks.find((deck) => deck.id === deckId) ?? null;
  const readyDecks = libraryDecks.filter(
    (deck) => deck.ownerType === FlashcardDeckOwnerType.ADMIN
  );
  const personalDecks = libraryDecks.filter(
    (deck) => deck.ownerType === FlashcardDeckOwnerType.LEARNER
  );
  const activeCards =
    sessionMode === "review" ? reviewQueue : activeDeck?.flashcards ?? [];
  const activeCard = activeCards[activeIndex % Math.max(activeCards.length, 1)];
  const canEditActiveDeck =
    activeDeck?.ownerType === FlashcardDeckOwnerType.LEARNER;
  const slideDistance = isRtl ? -42 : 42;
  const layerVariants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        enter: { opacity: 0, x: slideDistance, scale: 0.985 },
        center: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -slideDistance, scale: 0.985 }
      };
  const initialLayerState = hasMounted ? "enter" : false;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const currentUrl = useMemo(() => {
    const params = new globalThis.URLSearchParams(searchParams.toString());

    return (updates: Record<string, string | null>) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const query = params.toString();

      return query ? `${pathname}?${query}` : pathname;
    };
  }, [pathname, searchParams]);

  function goHome() {
    setCreateStep("deck");
    setSessionMode("study");
    setActiveIndex(0);
    setFlipped(false);
    setReviewQueue([]);
    setError(null);
    router.push(currentUrl({ deck: null, flow: null }));
  }

  function openDeck(nextDeckId: string) {
    setSessionMode("study");
    setActiveIndex(0);
    setFlipped(false);
    setReviewQueue([]);
    setError(null);
    router.push(currentUrl({ deck: nextDeckId, flow: null }));
  }

  function startCreate() {
    resetDeckForm();
    resetCardForm();
    setCreateStep("deck");
    router.push(currentUrl({ deck: null, flow: "create" }));
  }

  function startEdit(deck: FlashcardLibraryDeck) {
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setDeckIconKey(normalizeIconKey(deck.iconKey));
    setDeckColorKey(normalizeColorKey(deck.colorKey));
    router.push(currentUrl({ deck: deck.id, flow: "edit" }));
  }

  function resetDeckForm() {
    setDeckTitle("");
    setDeckDescription("");
    setDeckIconKey("layers-3");
    setDeckColorKey("teal");
    setError(null);
  }

  function resetCardForm() {
    setEditingCardId(null);
    setFront("");
    setBack("");
    setArticle("");
    setExample("");
    setExampleMeaning("");
  }

  function normalizeIconKey(value: string) {
    return deckIconKeys.includes(value as (typeof deckIconKeys)[number])
      ? (value as (typeof deckIconKeys)[number])
      : "layers-3";
  }

  function normalizeColorKey(value: string) {
    return deckColorKeys.includes(value as (typeof deckColorKeys)[number])
      ? (value as (typeof deckColorKeys)[number])
      : "teal";
  }

  function updateDecks(updater: (items: FlashcardLibraryDeck[]) => FlashcardLibraryDeck[]) {
    setLibraryDecks((current) => updater(current));
  }

  async function submitDeck(event: FormEvent) {
    event.preventDefault();

    if (!deckTitle.trim()) {
      setError(copy.deckNameRequired);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const titleSlug = slugify(deckTitle) || `personal-${Date.now()}`;
      const deck = cleanDeckResponse(
        await readJson<DeckResponse>(
          await fetch("/api/flashcard-decks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: deckTitle,
              slug: `${titleSlug}-${Date.now().toString(36)}`,
              description: deckDescription,
              levelLabel: "A1",
              category: "Personal",
              iconKey: deckIconKey,
              colorKey: deckColorKey || derivedColorKey(deckTitle),
              ownerType: FlashcardDeckOwnerType.LEARNER,
              publicationStatus: PublicationStatus.PUBLISHED,
              unitId: ""
            })
          })
        )
      );

      updateDecks((items) => [...items, deck]);
      setCreateStep("cards");
      router.push(currentUrl({ deck: deck.id, flow: "create" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save deck.");
    } finally {
      setSaving(false);
    }
  }

  async function updateDeck(event: FormEvent) {
    event.preventDefault();

    if (!activeDeck) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await readJson<DeckResponse>(
        await fetch(`/api/flashcard-decks/${activeDeck.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: deckTitle,
            description: deckDescription,
            iconKey: deckIconKey,
            colorKey: deckColorKey
          })
        })
      );

      updateDecks((items) =>
        items.map((deck) =>
          deck.id === updated.id
            ? {
                ...deck,
                title: updated.title,
                description: updated.description,
                iconKey: updated.iconKey,
                colorKey: updated.colorKey
              }
            : deck
        )
      );
      router.push(currentUrl({ deck: activeDeck.id, flow: null }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update deck.");
    } finally {
      setSaving(false);
    }
  }

  async function submitCard(event: FormEvent) {
    event.preventDefault();

    if (!activeDeck) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        deckId: activeDeck.id,
        front,
        back,
        article,
        example,
        exampleMeaning,
        pronunciationAudioUrl: "",
        difficulty: FlashcardDifficulty.MEDIUM,
        publicationStatus: PublicationStatus.PUBLISHED,
        actorOwnerType: FlashcardDeckOwnerType.LEARNER,
        notes: ""
      };
      const saved = cleanCardResponse(
        await readJson<CardResponse>(
          await fetch(editingCardId ? `/api/flashcards/${editingCardId}` : "/api/flashcards", {
            method: editingCardId ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          })
        )
      );

      updateDecks((items) =>
        items.map((deck) =>
          deck.id === activeDeck.id
            ? {
                ...deck,
                flashcards: editingCardId
                  ? deck.flashcards.map((card) =>
                      card.id === saved.id ? { ...card, ...saved } : card
                    )
                  : [...deck.flashcards, saved]
              }
            : deck
        )
      );
      resetCardForm();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save card.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDeck(deck: FlashcardLibraryDeck) {
    if (!globalThis.confirm(copy.confirmDeleteDeck)) {
      return;
    }

    setDeletingId(deck.id);
    setError(null);

    try {
      await readJson<{ deleted: boolean }>(
        await fetch(`/api/flashcard-decks/${deck.id}`, {
          method: "DELETE"
        })
      );
      updateDecks((items) => items.filter((item) => item.id !== deck.id));
      goHome();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete deck.");
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteCard(card: FlashcardLibraryCard) {
    if (!activeDeck || !globalThis.confirm(copy.confirmDeleteCard)) {
      return;
    }

    setDeletingId(card.id);
    setError(null);

    try {
      await readJson<{ deleted: boolean }>(
        await fetch(`/api/flashcards/${card.id}`, {
          method: "DELETE"
        })
      );
      updateDecks((items) =>
        items.map((deck) =>
          deck.id === activeDeck.id
            ? {
                ...deck,
                flashcards: deck.flashcards.filter((item) => item.id !== card.id)
              }
            : deck
        )
      );
      setReviewQueue((items) => items.filter((item) => item.id !== card.id));
      resetCardForm();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete card.");
    } finally {
      setDeletingId(null);
    }
  }

  function editCard(card: FlashcardLibraryCard) {
    setEditingCardId(card.id);
    setFront(card.front);
    setBack(card.back);
    setArticle(card.article ?? "");
    setExample(card.example);
    setExampleMeaning(card.exampleMeaning);
  }

  function startReview() {
    const nextQueue = (activeDeck?.flashcards ?? [])
      .filter((card) => card.isDue || card.intervalStep === null)
      .slice(0, 20);

    setReviewQueue(nextQueue);
    setSessionMode("review");
    setActiveIndex(0);
    setFlipped(false);
  }

  async function mark(nextStatus: CardStatus) {
    if (!activeCard) {
      return;
    }

    if (sessionMode === "review") {
      try {
        await readJson<{ flashcardId: string; dueAt: string }>(
          await fetch("/api/flashcard-reviews", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              flashcardId: activeCard.id,
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
        return;
      }

      setReviewQueue((current) => {
        const [, ...rest] = current;

        return nextStatus === "unknown" ? [...rest, activeCard] : rest;
      });
      setActiveIndex(0);
    } else {
      setActiveIndex((index) => index + 1);
    }

    setFlipped(false);
  }

  function pronounce(card: FlashcardLibraryCard) {
    if (
      typeof globalThis.speechSynthesis === "undefined" ||
      typeof globalThis.SpeechSynthesisUtterance === "undefined"
    ) {
      return;
    }

    const utterance = new globalThis.SpeechSynthesisUtterance(
      `${card.article ? `${card.article} ` : ""}${card.front}`
    );
    utterance.lang = "de-DE";
    globalThis.speechSynthesis.speak(utterance);
  }

  function renderDeckTile(deck: FlashcardLibraryDeck) {
    const Icon = deckIcons[normalizeIconKey(deck.iconKey)];
    const dueCount = deck.flashcards.filter((card) => card.isDue).length;

    return (
      <button
        className={clsx("flashcard-library-card", `flashcard-accent-${normalizeColorKey(deck.colorKey)}`)}
        key={deck.id}
        type="button"
        onClick={() => openDeck(deck.id)}
      >
        <span className="flashcard-library-icon">
          <Icon size={20} />
        </span>
        <span>
          <strong>{deck.title}</strong>
          <small>{deck.description || copy.noDescription}</small>
        </span>
        <span className="flashcard-library-meta">
          {deck.flashcards.length > 0 ? `${deck.flashcards.length} ${copy.cards}` : copy.noCards}
          {dueCount > 0 ? ` · ${dueCount} ${copy.due}` : ""}
        </span>
      </button>
    );
  }

  function renderDeckForm(mode: "create" | "edit") {
    return (
      <form className="flashcard-layer-form" onSubmit={mode === "create" ? submitDeck : updateDeck}>
        <div className="flashcard-step-band">
          <span>{copy.stepDeck}</span>
          <h2>{mode === "create" ? copy.createTitle : copy.editTitle}</h2>
        </div>

        <label>
          <span>{copy.deckName}</span>
          <input
            required
            value={deckTitle}
            onChange={(event) => {
              const value = event.target.value;
              setDeckTitle(value);
              if (!deckColorKey) {
                setDeckColorKey(derivedColorKey(value));
              }
            }}
          />
        </label>
        <label>
          <span>{copy.description}</span>
          <textarea
            rows={3}
            value={deckDescription}
            onChange={(event) => setDeckDescription(event.target.value)}
          />
        </label>

        <fieldset className="flashcard-choice-field">
          <legend>{copy.icon}</legend>
          <div>
            {deckIconKeys.map((key) => {
              const Icon = deckIcons[key];

              return (
                <button
                  aria-label={key}
                  className={deckIconKey === key ? "active" : undefined}
                  key={key}
                  type="button"
                  onClick={() => setDeckIconKey(key)}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flashcard-choice-field">
          <legend>{copy.color}</legend>
          <div>
            {deckColorKeys.map((key) => (
              <button
                aria-label={key}
                className={clsx(deckColorKey === key && "active", `flashcard-swatch-${key}`)}
                key={key}
                type="button"
                onClick={() => setDeckColorKey(key)}
              />
            ))}
          </div>
        </fieldset>

        {error ? <div className="feedback wrong">{error}</div> : null}

        <div className="flashcard-layer-actions">
          <button className="secondary-button" type="button" onClick={mode === "create" ? goHome : () => activeDeck && openDeck(activeDeck.id)}>
            <ArrowLeft size={17} />
            {copy.back}
          </button>
          <button className="primary-button" disabled={saving} type="submit">
            <Save size={17} />
            {mode === "create" ? copy.continue : copy.save}
          </button>
        </div>
      </form>
    );
  }

  function renderCardComposer() {
    const cards = activeDeck?.flashcards ?? [];

    return (
      <div className="flashcard-card-builder">
        <form className="flashcard-layer-form" onSubmit={submitCard}>
          <div className="flashcard-step-band">
            <span>{copy.stepCards}</span>
            <h2>{editingCardId ? copy.updateCard : copy.addCard}</h2>
          </div>
          <div className="flashcard-two-fields">
            <label>
              <span>{copy.front}</span>
              <input
                required
                dir={getTextDirection(front)}
                value={front}
                onChange={(event) => setFront(event.target.value)}
              />
            </label>
            <label>
              <span>{copy.backText}</span>
              <input
                required
                dir={getTextDirection(back)}
                value={back}
                onChange={(event) => setBack(event.target.value)}
              />
            </label>
          </div>
          <div className="flashcard-two-fields">
            <label>
              <span>{copy.article}</span>
              <input value={article} onChange={(event) => setArticle(event.target.value)} />
            </label>
            <label>
              <span>{copy.example}</span>
              <input dir="ltr" value={example} onChange={(event) => setExample(event.target.value)} />
            </label>
          </div>
          <label>
            <span>{copy.exampleMeaning}</span>
            <input
              dir={getTextDirection(exampleMeaning)}
              value={exampleMeaning}
              onChange={(event) => setExampleMeaning(event.target.value)}
            />
          </label>

          {error ? <div className="feedback wrong">{error}</div> : null}

          <div className="flashcard-layer-actions">
            {editingCardId ? (
              <button className="secondary-button" type="button" onClick={resetCardForm}>
                <XCircle size={17} />
                {copy.back}
              </button>
            ) : null}
            <button className="primary-button" disabled={saving} type="submit">
              <Save size={17} />
              {editingCardId ? copy.updateCard : copy.addCard}
            </button>
          </div>
        </form>

        <section className="flashcard-card-list" aria-label={copy.stepCards}>
          {cards.length === 0 ? (
            <div className="flashcard-empty-card">
              <Sparkles size={22} />
              <p>{copy.emptyDeck}</p>
            </div>
          ) : (
            cards.map((card) => (
              <article className="flashcard-mini-card" key={card.id}>
                <div>
                  <strong dir="ltr">{card.front}</strong>
                  <span>{card.back}</span>
                </div>
                <div className="flashcard-mini-actions">
                  <button className="icon-button" aria-label={copy.edit} type="button" onClick={() => editCard(card)}>
                    <PenLine size={16} />
                  </button>
                  <button
                    className="icon-button danger-icon"
                    aria-label={copy.delete}
                    disabled={deletingId === card.id}
                    type="button"
                    onClick={() => void deleteCard(card)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    );
  }

  return (
    <section className="flashcard-layer-shell" aria-label={copy.readyMade}>
      <AnimatePresence mode="wait">
        {layer === "home" ? (
          <motion.div
            animate="center"
            className="flashcard-layer"
            exit="exit"
            initial={initialLayerState}
            key="home"
            transition={{ duration: 0.24, ease: "easeOut" }}
            variants={layerVariants}
          >
            <section className="flashcard-library-section">
              <div className="flashcard-library-heading">
                <div>
                  <h2>{copy.readyMade}</h2>
                  <p>{copy.readySubtitle}</p>
                </div>
              </div>
              <div className="flashcard-library-grid">
                {readyDecks.map(renderDeckTile)}
              </div>
            </section>

            <section className="flashcard-library-section">
              <div className="flashcard-library-heading">
                <div>
                  <h2>{copy.mine}</h2>
                  <p>{copy.mineSubtitle}</p>
                </div>
                <button className="flashcard-add-button" type="button" aria-label={copy.addDeck} onClick={startCreate}>
                  <Plus size={19} />
                </button>
              </div>
              {personalDecks.length === 0 ? (
                <div className="flashcard-empty-library">
                  <p>{copy.emptyMine}</p>
                </div>
              ) : (
                <div className="flashcard-library-grid">
                  {personalDecks.map(renderDeckTile)}
                </div>
              )}
            </section>
          </motion.div>
        ) : null}

        {layer === "deck" && activeDeck ? (
          <motion.div
            animate="center"
            className="flashcard-layer"
            exit="exit"
            initial={initialLayerState}
            key={`deck-${activeDeck.id}`}
            transition={{ duration: 0.24, ease: "easeOut" }}
            variants={layerVariants}
          >
            <div className={clsx("flashcard-focused-heading", `flashcard-accent-${normalizeColorKey(activeDeck.colorKey)}`)}>
              <button className="secondary-button compact" type="button" onClick={goHome}>
                <ArrowLeft size={17} />
                {copy.back}
              </button>
              <div>
                <span className="section-label">
                  {activeDeck.ownerType === FlashcardDeckOwnerType.ADMIN ? copy.prepared : copy.personal}
                </span>
                <h2>{activeDeck.title}</h2>
                <p>{activeDeck.description || copy.noDescription}</p>
              </div>
              {canEditActiveDeck ? (
                <button className="icon-button" aria-label={copy.settings} type="button" onClick={() => startEdit(activeDeck)}>
                  <Settings2 size={18} />
                </button>
              ) : null}
            </div>

            <div className="flashcard-mode-row">
              <div className="segmented-control" role="group" aria-label="Flashcard mode">
                <button
                  className={sessionMode === "study" ? "active" : undefined}
                  type="button"
                  onClick={() => {
                    setSessionMode("study");
                    setActiveIndex(0);
                    setFlipped(false);
                  }}
                >
                  {copy.study}
                </button>
                <button
                  className={sessionMode === "review" ? "active" : undefined}
                  type="button"
                  onClick={startReview}
                >
                  {copy.review}
                </button>
              </div>
              {canEditActiveDeck ? (
                <button className="secondary-button compact" type="button" onClick={() => {
                  setCreateStep("cards");
                  router.push(currentUrl({ deck: activeDeck.id, flow: "create" }));
                }}>
                  <Plus size={17} />
                  {copy.addCard}
                </button>
              ) : null}
            </div>

            {activeCard ? (
              <>
                <button
                  className="study-card flashcard-focused-card"
                  type="button"
                  onClick={() => setFlipped((value) => !value)}
                >
                  <span className="section-label">
                    {activeDeck.levelLabel} · {activeCard.difficulty.toLowerCase()}
                  </span>
                  <div className={clsx("study-card-face", flipped && "is-hidden")}>
                    <h2 dir="ltr">
                      {activeCard.article ? <small>{activeCard.article}</small> : null}
                      {activeCard.front}
                    </h2>
                    <p>{copy.flip}</p>
                  </div>
                  <div className={clsx("study-card-back", flipped && "is-visible")}>
                    <h2>{activeCard.back}</h2>
                    {activeCard.example ? (
                      <p>
                        <strong>{copy.example}</strong>
                        <span dir="ltr">{activeCard.example}</span>
                        {activeCard.exampleMeaning ? <small>{activeCard.exampleMeaning}</small> : null}
                      </p>
                    ) : null}
                  </div>
                </button>
                <div className="flashcard-actions">
                  <button className="secondary-button" type="button" onClick={() => pronounce(activeCard)}>
                    <Volume2 size={18} />
                    {copy.pronunciation}
                  </button>
                  <button className="danger-button" type="button" onClick={() => void mark("unknown")}>
                    <XCircle size={18} />
                    {copy.unknown}
                  </button>
                  <button className="primary-button" type="button" onClick={() => void mark("known")}>
                    <CheckCircle2 size={18} />
                    {copy.known}
                  </button>
                </div>
              </>
            ) : (
              <article className="app-panel empty-state">
                <h2>{sessionMode === "review" ? copy.reviewComplete : copy.noCards}</h2>
                <p>{sessionMode === "review" ? copy.noReviewCards : copy.emptyDeck}</p>
              </article>
            )}
          </motion.div>
        ) : null}

        {layer === "create" ? (
          <motion.div
            animate="center"
            className="flashcard-layer"
            exit="exit"
            initial={initialLayerState}
            key={`create-${createStep}-${activeDeck?.id ?? "new"}`}
            transition={{ duration: 0.24, ease: "easeOut" }}
            variants={layerVariants}
          >
            {createStep === "deck" ? renderDeckForm("create") : null}
            {createStep === "cards" && activeDeck ? (
              <>
                {renderCardComposer()}
                <div className="flashcard-layer-actions">
                  <button className="secondary-button" type="button" onClick={() => setCreateStep("finish")}>
                    {activeDeck.flashcards.length === 0 ? copy.finishEmpty : copy.finish}
                  </button>
                </div>
              </>
            ) : null}
            {createStep === "finish" && activeDeck ? (
              <section className="flashcard-finish-layer">
                <Sparkles size={30} />
                <span className="section-label">{copy.stepFinish}</span>
                <h2>{activeDeck.title}</h2>
                <p>{copy.finishBody}</p>
                <div className="flashcard-layer-actions">
                  <button className="secondary-button" type="button" onClick={goHome}>
                    {copy.backHome}
                  </button>
                  <button className="primary-button" type="button" onClick={() => openDeck(activeDeck.id)}>
                    {copy.studyNow}
                  </button>
                </div>
              </section>
            ) : null}
          </motion.div>
        ) : null}

        {layer === "edit" && activeDeck ? (
          <motion.div
            animate="center"
            className="flashcard-layer"
            exit="exit"
            initial={initialLayerState}
            key={`edit-${activeDeck.id}`}
            transition={{ duration: 0.24, ease: "easeOut" }}
            variants={layerVariants}
          >
            {renderDeckForm("edit")}
            <div className="flashcard-layer-actions danger-zone">
              <button
                className="danger-button"
                disabled={deletingId === activeDeck.id}
                type="button"
                onClick={() => void deleteDeck(activeDeck)}
              >
                <Trash2 size={17} />
                {copy.delete}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
