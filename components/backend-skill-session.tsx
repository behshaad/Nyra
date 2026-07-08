"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, ChevronRight, RotateCcw, ShieldCheck } from "lucide-react";
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

export function BackendSkillSession({ skillSlug }: { skillSlug: string }) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [lastFeedback, setLastFeedback] = useState<LastFeedback | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState<string | null>(null);
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
  const completed = session?.status === "COMPLETED" && !lastFeedback;

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
        <div className="hint-box">Starting backend Learning Session...</div>
      </section>
    );
  }

  if (loadState.status === "error") {
    return (
      <section className="app-panel route-panel">
        <div className="feedback wrong">
          <strong>Session could not start.</strong>
          <p>{loadState.message}</p>
          <button className="secondary-button" type="button" onClick={startSession}>
            <RotateCcw size={17} />
            Try again
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
      ? "Final A1 Test"
      : readySession.skill.kind === "UNIT_CHECKPOINT"
        ? "Unit Checkpoint"
        : "Backend Learning Session";

  return (
    <section
      className="app-panel route-panel"
      aria-label={`${readySession.skill.title} backend learning session`}
    >
      <div className="app-panel-header">
        <div>
          <p className="panel-kicker">Backend Learning Session</p>
          <h2>{readySession.skill.title}</h2>
          {isAssessment ? (
            <p className="muted-line">
              {assessmentLabel} · passing score {readySession.skill.passingScore}%
            </p>
          ) : null}
        </div>
        <span className="status-pill">
          {completed && readySession.scorePercent !== null
            ? `${readySession.scorePercent}%`
            : completed
              ? `${readySession.skill.xp} XP earned`
              : `${readySession.skill.xp} XP`}
        </span>
      </div>

      <div className="lesson-card">
        <div className="progress-line">
          <span style={{ width: `${readySession.progressPercent}%` }} />
        </div>
        <div className="question-meta">
          <span>
            {completed ? "Session complete" : displayQuestion?.helper ?? "Question"}
          </span>
          <span>{readySession.progressPercent}%</span>
        </div>

        {completed ? (
          <div className="session-summary">
            <Check size={24} />
            <h3>
              {isAssessment
                ? readySession.passed
                  ? "Assessment passed"
                  : "Review recommended"
                : "Skill complete"}
            </h3>
            <p>
              {isAssessment
                ? "Your score was saved as a soft gate. You can keep learning, and Nyra will mark this area for review when needed."
                : "This completion was handled by the backend Question Engine. Attempts and progress events were persisted in PostgreSQL."}
            </p>
            <dl>
              <div>
                <dt>Attempts</dt>
                <dd>{attemptCount}</dd>
              </div>
              {readySession.scorePercent !== null ? (
                <div>
                  <dt>Score</dt>
                  <dd>{readySession.scorePercent}%</dd>
                </div>
              ) : null}
              <div>
                <dt>XP awarded</dt>
                <dd>{readySession.skill.xp}</dd>
              </div>
            </dl>
            <button className="secondary-button" type="button" onClick={startSession}>
              <RotateCcw size={17} />
              Start another session
            </button>
          </div>
        ) : displayQuestion ? (
          <>
            <h3>{displayQuestion.prompt}</h3>
            <div className="answer-grid" dir="rtl">
              {displayQuestion.choices.map((option) => (
                <button
                  key={option}
                  type="button"
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
                  {submittingAnswer === option ? "Checking..." : option}
                </button>
              ))}
            </div>

            {lastFeedback ? (
              <div className={clsx("feedback", lastFeedback.isCorrect ? "correct" : "wrong")}>
                <strong>{lastFeedback.isCorrect ? "Correct." : "Good mistake to catch."}</strong>
                <p>{lastFeedback.explanation}</p>
                <button className="primary-button compact" type="button" onClick={continueSession}>
                  Continue
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : (
              <div className="hint-box">
                <ShieldCheck size={18} />
                The server evaluates answers and requeues missed Questions.
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
