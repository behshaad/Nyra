"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Volume2, XCircle } from "lucide-react";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import type { Flashcard } from "@/lib/flashcards/sample-flashcards";

const labels = {
  fa: {
    study: "مطالعه",
    review: "مرور",
    level: "سطح",
    skill: "مهارت",
    all: "همه",
    flip: "برگردان",
    known: "بلدم",
    unknown: "نیاز به مرور",
    progress: "پیشرفت",
    pronunciation: "تلفظ",
    example: "مثال",
    difficulty: "سختی",
    reset: "شروع دوباره"
  },
  en: {
    study: "Study",
    review: "Review",
    level: "Level",
    skill: "Skill",
    all: "All",
    flip: "Flip",
    known: "Known",
    unknown: "Unknown",
    progress: "Progress",
    pronunciation: "Pronunciation",
    example: "Example",
    difficulty: "Difficulty",
    reset: "Reset"
  },
  de: {
    study: "Lernen",
    review: "Wiederholen",
    level: "Niveau",
    skill: "Skill",
    all: "Alle",
    flip: "Drehen",
    known: "Bekannt",
    unknown: "Unbekannt",
    progress: "Fortschritt",
    pronunciation: "Aussprache",
    example: "Beispiel",
    difficulty: "Schwierigkeit",
    reset: "Zuruecksetzen"
  }
} satisfies Record<InterfaceLanguageCode, Record<string, string>>;

type CardStatus = "known" | "unknown";

export function FlashcardStudy({
  cards,
  language
}: {
  cards: Flashcard[];
  language: InterfaceLanguageCode;
}) {
  const copy = labels[language];
  const [mode, setMode] = useState<"study" | "review">("study");
  const [level, setLevel] = useState("A1");
  const [skill, setSkill] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<Record<string, CardStatus>>({});

  const skills = useMemo(
    () => [...new Map(cards.map((card) => [card.skillSlug, card.skillTitle])).entries()],
    [cards]
  );

  const filtered = cards.filter((card) => {
    const levelMatch = level === "all" || card.level === level;
    const skillMatch = skill === "all" || card.skillSlug === skill;
    const modeMatch = mode === "study" || status[card.id] !== "known";

    return levelMatch && skillMatch && modeMatch;
  });
  const active = filtered[activeIndex % Math.max(filtered.length, 1)];
  const knownCount = cards.filter((card) => status[card.id] === "known").length;
  const progress = Math.round((knownCount / cards.length) * 100);

  function mark(nextStatus: CardStatus) {
    if (!active) {
      return;
    }

    setStatus((current) => ({
      ...current,
      [active.id]: nextStatus
    }));
    setFlipped(false);
    setActiveIndex((index) => index + 1);
  }

  function pronounce() {
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

  return (
    <section className="flashcard-workspace" aria-label={copy.study}>
      <aside className="app-panel flashcard-sidebar">
        <div className="segmented-control" role="group" aria-label="Flashcard mode">
          <button
            className={mode === "study" ? "active" : undefined}
            type="button"
            onClick={() => {
              setMode("study");
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

        <label>
          <span>{copy.level}</span>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">{copy.all}</option>
            {["A1", "A2", "B1", "B2"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{copy.skill}</span>
          <select value={skill} onChange={(event) => setSkill(event.target.value)}>
            <option value="all">{copy.all}</option>
            {skills.map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </label>

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
        {active ? (
          <>
            <button
              className={`study-card ${flipped ? "flipped" : ""}`}
              type="button"
              onClick={() => setFlipped((value) => !value)}
            >
              <span className="section-label">
                {active.level} · {copy.difficulty}: {active.difficulty}
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
              <button className="secondary-button" type="button" onClick={pronounce}>
                <Volume2 size={18} />
                {copy.pronunciation}
              </button>
              <button className="danger-button" type="button" onClick={() => mark("unknown")}>
                <XCircle size={18} />
                {copy.unknown}
              </button>
              <button className="primary-button" type="button" onClick={() => mark("known")}>
                <CheckCircle2 size={18} />
                {copy.known}
              </button>
            </div>
          </>
        ) : (
          <article className="app-panel empty-state">
            <h2>{copy.progress}: {progress}%</h2>
            <p>{copy.review}</p>
          </article>
        )}
      </div>
    </section>
  );
}
