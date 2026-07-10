"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, RotateCcw, ShieldCheck } from "lucide-react";
import {
  interfaceCopy,
  type InterfaceLanguageCode,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import type {
  AnswerFeedbackView,
  LearningQuestionView,
  LearningSessionView
} from "@/lib/question-engine";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; session: LearningSessionView }
  | { status: "error"; message: string };

type LastFeedback = AnswerFeedbackView & {
  submittedAnswer: string;
  answeredQuestion: LearningQuestionView;
};

type NextSkillLink = {
  slug: string;
  title: string;
} | null;

function getTextDirection(value: string): "rtl" | "ltr" {
  const hasPersianOrArabic = /[\u0600-\u06FF]/.test(value);
  const hasLatin = /[A-Za-zÄÖÜäöüß]/.test(value);

  return hasLatin && !hasPersianOrArabic ? "ltr" : "rtl";
}

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | { error?: string };

  if (!response.ok) {
    const maybeError = data as { error?: string };

    throw new Error(
      maybeError.error ? maybeError.error : "Request failed."
    );
  }

  return data as T;
}

export function BackendSkillSession({
  skillSlug,
  nextSkill,
  unitSlug,
  language
}: {
  skillSlug: string;
  nextSkill: NextSkillLink;
  unitSlug: string;
  language: InterfaceLanguageCode;
}) {
  const copy = interfaceCopy[language].session;
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [lastFeedback, setLastFeedback] = useState<LastFeedback | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);

  async function startSession() {
    setLoadState({ status: "loading" });
    setLastFeedback(null);
    setAttemptCount(0);

    try {
      const response = await fetch("/api/learning-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ skillSlug })
      });
      const session = await readJson<LearningSessionView>(response);
      setLoadState({ status: "ready", session });
    } catch (error) {
      setLoadState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to start session."
      });
    }
  }

  useEffect(() => {
    void startSession();
  }, [skillSlug]);

  const session = loadState.status === "ready" ? loadState.session : null;
  const displayQuestion = useMemo(
    () => lastFeedback?.answeredQuestion ?? session?.currentQuestion ?? null,
    [lastFeedback, session]
  );
  const wordTiles = useMemo(
    () =>
      (displayQuestion?.tiles ?? []).map((tile, index) => ({
        id: `${index}-${tile}`,
        label: tile
      })),
    [displayQuestion]
  );
  const selectedTileLabels = selectedTileIds
    .map((tileId) => wordTiles.find((tile) => tile.id === tileId)?.label)
    .filter((tile): tile is string => Boolean(tile));
  const builtWordOrderAnswer = selectedTileLabels.join(" ");
  const availableTiles = wordTiles.filter((tile) => !selectedTileIds.includes(tile.id));
  const completed = session?.status === "COMPLETED" && !lastFeedback;

  useEffect(() => {
    setTypedAnswer("");
    setSelectedTileIds([]);
  }, [displayQuestion?.id]);

  async function submitAnswer(option: string) {
    if (!session || !session.currentQuestion || lastFeedback) {
      return;
    }

    setSubmittingAnswer(option);

    try {
      const response = await fetch(
        `/api/learning-sessions/${session.sessionId}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ submittedAnswer: option })
        }
      );
      const feedback = await readJson<AnswerFeedbackView>(response);

      setLastFeedback({
        ...feedback,
        submittedAnswer: option,
        answeredQuestion: session.currentQuestion
      });
      setAttemptCount((current) => current + 1);
    } catch (error) {
      setLoadState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to submit answer."
      });
    } finally {
      setSubmittingAnswer(null);
    }
  }

  function submitTypedAnswer(event: FormEvent) {
    event.preventDefault();

    if (typedAnswer.trim()) {
      void submitAnswer(typedAnswer);
    }
  }

  function submitWordOrderAnswer(event: FormEvent) {
    event.preventDefault();

    if (builtWordOrderAnswer) {
      void submitAnswer(builtWordOrderAnswer);
    }
  }

  function continueSession() {
    if (!session || !lastFeedback) {
      return;
    }

    const shouldRequeue =
      session.skill.kind === "REGULAR" && !lastFeedback.isCorrect;
    const remainingQuestionCount = lastFeedback.completed
      ? 0
      : Math.max(
          0,
          session.remainingQuestionCount - (shouldRequeue ? 0 : 1)
        );

    setLoadState({
      status: "ready",
      session: {
        ...session,
        status: lastFeedback.completed ? "COMPLETED" : "ACTIVE",
        currentQuestion: lastFeedback.nextQuestion,
        progressPercent: lastFeedback.progressPercent,
        remainingQuestionCount,
        scorePercent: lastFeedback.scorePercent,
        passed: lastFeedback.passed
      }
    });
    setLastFeedback(null);
  }

  if (loadState.status === "loading") {
    return (
      <section className="app-panel route-panel">
        <div className="hint-box">{copy.loading}</div>
      </section>
    );
  }

  if (loadState.status === "error") {
    return (
      <section className="app-panel route-panel">
        <div className="feedback wrong">
          <strong>{copy.errorTitle}</strong>
          <p>{loadState.message}</p>
          <button className="secondary-button" type="button" onClick={startSession}>
            <RotateCcw size={17} />
            {copy.retry}
          </button>
        </div>
      </section>
    );
  }

  const readySession = session;

  if (!readySession) {
    return null;
  }

  const isAssessment = readySession.skill.kind !== "REGULAR";
  const assessmentLabel =
    readySession.skill.kind === "FINAL_TEST"
      ? copy.finalTest
      : readySession.skill.kind === "UNIT_CHECKPOINT"
        ? copy.checkpoint
        : copy.practice;

  return (
    <section
      className="app-panel route-panel"
      aria-label={`${readySession.skill.title} backend learning session`}
    >
      <div className="app-panel-header">
        <div>
          <p className="panel-kicker">{assessmentLabel}</p>
          <h2>{readySession.skill.title}</h2>
          {isAssessment ? (
            <p className="muted-line">
              {copy.passingScore(readySession.skill.passingScore)}
            </p>
          ) : null}
        </div>
        <span className="status-pill">
          {completed && readySession.scorePercent !== null
            ? `${readySession.scorePercent}%`
            : completed
              ? copy.points(readySession.skill.xp)
              : copy.points(readySession.skill.xp)}
        </span>
      </div>

      <div className="lesson-card">
        <div className="progress-line">
          <span style={{ width: `${readySession.progressPercent}%` }} />
        </div>
        <div className="question-meta">
          <span>
            {completed ? copy.complete : displayQuestion?.helper ?? copy.question}
          </span>
          <span>{readySession.progressPercent}%</span>
        </div>

        {completed ? (
          <div className="session-summary">
            <Check size={24} />
            <h3>
              {isAssessment
                ? readySession.passed
                  ? copy.passed
                  : copy.reviewRecommended
                : copy.skillComplete}
            </h3>
            <p>
              {isAssessment
                ? copy.assessmentBody
                : copy.skillBody}
            </p>
            <dl>
              <div>
                <dt>{copy.attempts}</dt>
                <dd>{attemptCount}</dd>
              </div>
              {readySession.scorePercent !== null ? (
                <div>
                  <dt>{copy.score}</dt>
                  <dd>{readySession.scorePercent}%</dd>
                </div>
              ) : null}
              <div>
                <dt>{copy.xp}</dt>
                <dd>{readySession.skill.xp}</dd>
              </div>
            </dl>
            <div className="next-actions">
              {nextSkill ? (
                <Link
                  className="primary-button"
                  href={withInterfaceLanguage(`/learn/${nextSkill.slug}`, language)}
                >
                  {nextSkill.title ? copy.continueTo(nextSkill.title) : copy.continueNext}
                  <ArrowLeft size={17} />
                </Link>
              ) : (
                <Link className="primary-button" href={withInterfaceLanguage("/learn", language)}>
                  {copy.backToPath}
                  <ArrowLeft size={17} />
                </Link>
              )}
              <Link
                className="secondary-button"
                href={withInterfaceLanguage(`/learn?unit=${unitSlug}`, language)}
              >
                {copy.backToUnit}
              </Link>
              <button className="secondary-button" type="button" onClick={startSession}>
                <RotateCcw size={17} />
                {copy.practiceAgain}
              </button>
            </div>
          </div>
        ) : displayQuestion ? (
          <>
            <h3>{displayQuestion.prompt}</h3>
            {displayQuestion.type === "FILL_IN_BLANK" ? (
              <form className="typed-answer-form" onSubmit={submitTypedAnswer}>
                <input
                  dir={getTextDirection(typedAnswer)}
                  value={typedAnswer}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  disabled={Boolean(lastFeedback) || Boolean(submittingAnswer)}
                  aria-label={displayQuestion.prompt}
                />
                <button
                  className="primary-button compact"
                  type="submit"
                  disabled={
                    Boolean(lastFeedback) ||
                    Boolean(submittingAnswer) ||
                    typedAnswer.trim().length === 0
                  }
                >
                  {submittingAnswer === typedAnswer ? copy.checking : copy.continue}
                </button>
              </form>
            ) : displayQuestion.type === "WORD_ORDERING" ? (
              <form className="word-order-form" onSubmit={submitWordOrderAnswer}>
                <div
                  className={clsx(
                    "word-order-answer",
                    lastFeedback && (lastFeedback.isCorrect ? "correct" : "wrong")
                  )}
                  dir={getTextDirection(builtWordOrderAnswer)}
                >
                  {selectedTileLabels.length > 0 ? (
                    selectedTileLabels.map((tile, index) => (
                      <button
                        className="word-tile selected"
                        key={`${tile}-${index}`}
                        type="button"
                        disabled={Boolean(lastFeedback) || Boolean(submittingAnswer)}
                        onClick={() =>
                          setSelectedTileIds((current) =>
                            current.filter((_, currentIndex) => currentIndex !== index)
                          )
                        }
                      >
                        {tile}
                      </button>
                    ))
                  ) : (
                    <span>{copy.hint}</span>
                  )}
                </div>
                <div className="word-tile-bank">
                  {availableTiles.map((tile) => (
                    <button
                      className="word-tile"
                      key={tile.id}
                      type="button"
                      dir={getTextDirection(tile.label)}
                      disabled={Boolean(lastFeedback) || Boolean(submittingAnswer)}
                      onClick={() =>
                        setSelectedTileIds((current) => [...current, tile.id])
                      }
                    >
                      {tile.label}
                    </button>
                  ))}
                </div>
                <button
                  className="primary-button compact"
                  type="submit"
                  disabled={
                    Boolean(lastFeedback) ||
                    Boolean(submittingAnswer) ||
                    selectedTileIds.length === 0
                  }
                >
                  {submittingAnswer === builtWordOrderAnswer ? copy.checking : copy.continue}
                </button>
              </form>
            ) : (
              <div className="answer-grid">
                {displayQuestion.choices.map((option) => (
                  <button
                    key={option}
                    type="button"
                    dir={getTextDirection(option)}
                    className={clsx(
                      "answer-option",
                      lastFeedback?.submittedAnswer === option &&
                        lastFeedback.isCorrect &&
                        "correct",
                      lastFeedback?.submittedAnswer === option &&
                        !lastFeedback.isCorrect &&
                        "wrong"
                    )}
                    onClick={() => submitAnswer(option)}
                    disabled={Boolean(lastFeedback) || Boolean(submittingAnswer)}
                  >
                    {submittingAnswer === option ? copy.checking : option}
                  </button>
                ))}
              </div>
            )}

            {lastFeedback ? (
              <div className={clsx("feedback", lastFeedback.isCorrect ? "correct" : "wrong")}>
                <strong>{lastFeedback.isCorrect ? copy.correct : copy.mistake}</strong>
                <p>{lastFeedback.explanation}</p>
                {!lastFeedback.isCorrect &&
                lastFeedback.suggestedFlashcards.length > 0 ? (
                  <div className="suggested-flashcards">
                    <strong>{copy.suggestedFlashcards}</strong>
                    <div className="suggested-flashcard-grid">
                      {lastFeedback.suggestedFlashcards.map((card) => (
                        <article className="suggested-flashcard" key={card.id}>
                          <span>{card.deckTitle}</span>
                          <h4 dir="ltr">
                            {card.article ? `${card.article} ` : ""}
                            {card.front}
                          </h4>
                          <p>{card.back}</p>
                          <small dir="ltr">{card.example}</small>
                        </article>
                      ))}
                    </div>
                    <Link
                      className="secondary-button compact"
                      href={withInterfaceLanguage("/flashcards", language)}
                    >
                      {copy.reviewInFlashcards}
                    </Link>
                  </div>
                ) : null}
                <button className="primary-button compact" type="button" onClick={continueSession}>
                  {copy.continue}
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : (
              <div className="hint-box">
                <ShieldCheck size={18} />
                {copy.hint}
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
