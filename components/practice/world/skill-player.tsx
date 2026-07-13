"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type {
  AnswerFeedbackView,
  LearningQuestionView,
  LearningSessionView
} from "@/lib/question-engine";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { interfaceCopy, withInterfaceLanguage } from "@/lib/i18n/interface-language";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; session: LearningSessionView }
  | { status: "error"; message: string };

type LastFeedback = AnswerFeedbackView & {
  submittedAnswer: string;
  answeredQuestion: LearningQuestionView;
};

type AnswerReview = LastFeedback;

type SessionCopy = (typeof interfaceCopy)["fa"]["session"];

function getTextDirection(value: string): "rtl" | "ltr" {
  const hasPersianOrArabic = /[\u0600-\u06FF]/.test(value);
  const hasLatin = /[A-Za-zÄÖÜäöüß]/.test(value);

  return hasLatin && !hasPersianOrArabic ? "ltr" : "rtl";
}

function interfaceDirection(language: InterfaceLanguageCode): "rtl" | "ltr" {
  return language === "fa" ? "rtl" : "ltr";
}

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | { error?: string };

  if (!response.ok) {
    const maybeError = data as { error?: string };

    throw new Error(maybeError.error ? maybeError.error : "Request failed.");
  }

  return data as T;
}

export function SkillPlayer({
  language,
  levelLabel,
  skillSlug
}: {
  language: InterfaceLanguageCode;
  levelLabel: string;
  skillSlug: string;
}) {
  const router = useRouter();
  const copy = interfaceCopy[language].session;
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [lastFeedback, setLastFeedback] = useState<LastFeedback | null>(null);
  const [answerHistory, setAnswerHistory] = useState<AnswerReview[]>([]);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [initialQuestionCount, setInitialQuestionCount] = useState(0);
  const [completionVisible, setCompletionVisible] = useState(false);
  const worldHref = withInterfaceLanguage(`/practice/${levelLabel.toLowerCase()}`, language);

  async function startSession() {
    setLoadState({ status: "loading" });
    setLastFeedback(null);
    setAnswerHistory([]);
    setReviewIndex(null);
    setCompletionVisible(false);

    try {
      const response = await fetch("/api/learning-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ skillSlug })
      });
      const session = await readJson<LearningSessionView>(response);

      setInitialQuestionCount(Math.max(1, session.remainingQuestionCount));
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
  const activeReview =
    reviewIndex === null ? null : answerHistory[reviewIndex] ?? null;
  const displayQuestion = useMemo(
    () => activeReview?.answeredQuestion ?? lastFeedback?.answeredQuestion ?? session?.currentQuestion ?? null,
    [activeReview, lastFeedback, session]
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
  const remainingQuestionCount = session?.remainingQuestionCount ?? initialQuestionCount;
  const currentQuestionNumber = activeReview
    ? reviewIndex === null
      ? 1
      : reviewIndex + 1
    : lastFeedback?.completed
    ? initialQuestionCount
    : Math.min(
        initialQuestionCount,
        Math.max(1, initialQuestionCount - remainingQuestionCount + 1)
      );
  const feedbackForDisplay = activeReview ?? lastFeedback;
  const reviewingPreviousQuestion = Boolean(activeReview);

  useEffect(() => {
    setTypedAnswer("");
    setSelectedTileIds([]);
  }, [displayQuestion?.id]);

  useEffect(() => {
    if (!completionVisible) {
      return;
    }

    const timeout = globalThis.setTimeout(() => {
      router.push(worldHref);
      router.refresh();
    }, 1800);

    return () => globalThis.clearTimeout(timeout);
  }, [completionVisible, router, worldHref]);

  async function submitAnswer(option: string) {
    if (!session || !session.currentQuestion || lastFeedback || activeReview || completionVisible) {
      return;
    }

    setSubmittingAnswer(option);

    try {
      const response = await fetch(`/api/learning-sessions/${session.sessionId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ submittedAnswer: option })
      });
      const feedback = await readJson<AnswerFeedbackView>(response);

      const answeredFeedback = {
        ...feedback,
        submittedAnswer: option,
        answeredQuestion: session.currentQuestion
      };

      setLastFeedback(answeredFeedback);
      setAnswerHistory((current) => [...current, answeredFeedback]);

      if (feedback.completed) {
        globalThis.setTimeout(() => {
          setCompletionVisible(true);
        }, 520);
      }
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
    if (activeReview) {
      setReviewIndex(null);
      return;
    }

    if (!session || !lastFeedback) {
      return;
    }

    const shouldRequeue = session.skill.kind === "REGULAR" && !lastFeedback.isCorrect;
    const remainingQuestionCount = lastFeedback.completed
      ? 0
      : Math.max(0, session.remainingQuestionCount - (shouldRequeue ? 0 : 1));

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

  const reviewPreviousQuestion = () => {
    if (answerHistory.length === 0 || lastFeedback) {
      return;
    }

    setReviewIndex(answerHistory.length - 1);
  };

  const goBackToWorld = () => {
    router.push(worldHref);
    router.refresh();
  };

  if (loadState.status === "loading") {
    return (
      <section className="practice-skill-player-shell">
        <div className="practice-player-card">{copy.loading}</div>
      </section>
    );
  }

  if (loadState.status === "error") {
    return (
      <section className="practice-skill-player-shell">
        <div className="practice-player-card">
          <strong>{copy.errorTitle}</strong>
          <p>{loadState.message}</p>
          <button className="practice-player-button secondary" type="button" onClick={startSession}>
            <RotateCcw size={17} />
            {copy.retry}
          </button>
        </div>
      </section>
    );
  }

  if (!session || !displayQuestion) {
    return null;
  }

  return (
    <section className="practice-skill-player-shell">
      <div className="practice-player-frame">
        <div className="practice-player-topbar">
          <button className="practice-player-back" type="button" onClick={goBackToWorld}>
            <ArrowLeft size={18} />
            <span>World</span>
          </button>
          <div dir={interfaceDirection(language)}>
            <span>{session.skill.title}</span>
            <strong>
              {copy.question} {currentQuestionNumber} / {initialQuestionCount}
            </strong>
          </div>
          <button
            className="practice-player-back"
            disabled={answerHistory.length === 0 || Boolean(lastFeedback) || reviewingPreviousQuestion}
            type="button"
            onClick={reviewPreviousQuestion}
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>
        </div>
        <ProgressBar value={feedbackForDisplay?.progressPercent ?? session.progressPercent} />
        <AnimatePresence mode="wait">
          <QuestionCard
            availableTiles={availableTiles}
            builtWordOrderAnswer={builtWordOrderAnswer}
            copy={copy}
            displayQuestion={displayQuestion}
            key={displayQuestion.id}
            language={language}
            lastFeedback={feedbackForDisplay}
            selectedTileIds={selectedTileIds}
            selectedTileLabels={selectedTileLabels}
            setSelectedTileIds={setSelectedTileIds}
            setTypedAnswer={setTypedAnswer}
            submitAnswer={submitAnswer}
            submitTypedAnswer={submitTypedAnswer}
            submitWordOrderAnswer={submitWordOrderAnswer}
            submittingAnswer={submittingAnswer}
            typedAnswer={typedAnswer}
            reviewingPreviousQuestion={reviewingPreviousQuestion}
          />
        </AnimatePresence>
        {feedbackForDisplay ? (
          <motion.div
            className={clsx("practice-player-feedback", feedbackForDisplay.isCorrect ? "correct" : "wrong")}
            dir={interfaceDirection(language)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <strong>{feedbackForDisplay.isCorrect ? copy.correct : copy.mistake}</strong>
            <p>{feedbackForDisplay.explanation}</p>
            <button
              className="practice-player-button"
              type="button"
              onClick={feedbackForDisplay.completed && !activeReview ? goBackToWorld : continueSession}
            >
              {activeReview ? "Back to current question" : feedbackForDisplay.completed ? "Back to world" : copy.continue}
              <ChevronRight size={17} />
            </button>
          </motion.div>
        ) : null}
      </div>
      <AnimatePresence>
        {completionVisible ? (
          <motion.div
            className="practice-completion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.72, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              <Check size={34} />
              <strong>{copy.skillComplete}</strong>
              <span>{session.skill.xp} XP</span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="practice-player-progress" aria-label={`Progress ${value}%`}>
      <motion.span animate={{ width: `${value}%` }} transition={{ duration: 0.28 }} />
    </div>
  );
}

export function QuestionCard({
  availableTiles,
  builtWordOrderAnswer,
  copy,
  displayQuestion,
  language,
  lastFeedback,
  selectedTileIds,
  selectedTileLabels,
  setSelectedTileIds,
  setTypedAnswer,
  submitAnswer,
  submitTypedAnswer,
  submitWordOrderAnswer,
  submittingAnswer,
  typedAnswer,
  reviewingPreviousQuestion
}: {
  availableTiles: Array<{ id: string; label: string }>;
  builtWordOrderAnswer: string;
  copy: SessionCopy;
  displayQuestion: LearningQuestionView;
  language: InterfaceLanguageCode;
  lastFeedback: LastFeedback | null;
  selectedTileIds: string[];
  selectedTileLabels: string[];
  setSelectedTileIds: (updater: (current: string[]) => string[]) => void;
  setTypedAnswer: (value: string) => void;
  submitAnswer: (option: string) => Promise<void>;
  submitTypedAnswer: (event: FormEvent) => void;
  submitWordOrderAnswer: (event: FormEvent) => void;
  submittingAnswer: string | null;
  typedAnswer: string;
  reviewingPreviousQuestion: boolean;
}) {
  const cardDirection = interfaceDirection(language);
  const reviewAnswer = reviewingPreviousQuestion ? lastFeedback?.submittedAnswer ?? "" : "";

  return (
    <motion.div
      className="practice-question-card"
      dir={cardDirection}
      initial={{ opacity: 0, x: 22 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -22 }}
      transition={{ duration: 0.24 }}
    >
      <span>{displayQuestion.helper ?? copy.question}</span>
      <h2>{displayQuestion.prompt}</h2>
      {reviewAnswer ? (
        <div className="practice-review-answer" dir={getTextDirection(reviewAnswer)}>
          <small>Your answer</small>
          <strong>{reviewAnswer}</strong>
        </div>
      ) : null}
      {displayQuestion.type === "FILL_IN_BLANK" ? (
        <form className="practice-player-form" onSubmit={submitTypedAnswer}>
          <input
            aria-label={displayQuestion.prompt}
            dir={getTextDirection(reviewAnswer || typedAnswer)}
            disabled={Boolean(lastFeedback) || Boolean(submittingAnswer) || reviewingPreviousQuestion}
            onChange={(event) => setTypedAnswer(event.target.value)}
            value={reviewAnswer || typedAnswer}
          />
          <button
            className="practice-player-button"
            disabled={
              Boolean(lastFeedback) ||
              Boolean(submittingAnswer) ||
              reviewingPreviousQuestion ||
              typedAnswer.trim().length === 0
            }
            type="submit"
          >
            {submittingAnswer === typedAnswer ? copy.checking : copy.continue}
          </button>
        </form>
      ) : displayQuestion.type === "WORD_ORDERING" ? (
        <form className="practice-player-form" onSubmit={submitWordOrderAnswer}>
          <div className="practice-word-answer" dir={getTextDirection(builtWordOrderAnswer)}>
            {selectedTileLabels.length > 0 ? (
              selectedTileLabels.map((tile, index) => (
                <button
                  className="practice-word-tile selected"
                  disabled={Boolean(lastFeedback) || Boolean(submittingAnswer) || reviewingPreviousQuestion}
                  key={`${tile}-${index}`}
                  onClick={() =>
                    setSelectedTileIds((current) =>
                      current.filter((_, currentIndex) => currentIndex !== index)
                    )
                  }
                  type="button"
                >
                  {tile}
                </button>
              ))
            ) : (
              <span dir={cardDirection}>{copy.hint}</span>
            )}
          </div>
          <div className="practice-word-bank" dir="ltr">
            {availableTiles.map((tile) => (
              <button
                className="practice-word-tile"
                dir={getTextDirection(tile.label)}
                disabled={Boolean(lastFeedback) || Boolean(submittingAnswer) || reviewingPreviousQuestion}
                key={tile.id}
                onClick={() => setSelectedTileIds((current) => [...current, tile.id])}
                type="button"
              >
                {tile.label}
              </button>
            ))}
          </div>
          <button
            className="practice-player-button"
            disabled={
              Boolean(lastFeedback) ||
              Boolean(submittingAnswer) ||
              reviewingPreviousQuestion ||
              selectedTileIds.length === 0
            }
            type="submit"
          >
            {submittingAnswer === builtWordOrderAnswer ? copy.checking : copy.continue}
          </button>
        </form>
      ) : (
        <div className="practice-answer-grid">
          {displayQuestion.choices.map((option) => (
            <button
              className={clsx(
                "practice-answer-option",
                lastFeedback?.submittedAnswer === option &&
                  (lastFeedback.isCorrect ? "correct" : "wrong")
              )}
              dir={getTextDirection(option)}
              disabled={Boolean(lastFeedback) || Boolean(submittingAnswer) || reviewingPreviousQuestion}
              key={option}
              onClick={() => void submitAnswer(option)}
              type="button"
            >
              {submittingAnswer === option ? copy.checking : option}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
