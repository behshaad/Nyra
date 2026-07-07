"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Check, ChevronRight, RotateCcw, ShieldCheck } from "lucide-react";
import { evaluateAnswer } from "@/lib/question-engine";
import type { SampleQuestion, SampleSkill } from "@/lib/learning/sample-content";

type Attempt = {
  questionId: string;
  submittedAnswer: string;
  isCorrect: boolean;
};

export function SkillSession({ skill }: { skill: SampleSkill }) {
  const [queue, setQueue] = useState(() =>
    skill.questions.filter((question) => question.required).map((question) => question.id)
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState<SampleQuestion | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const currentQuestion = useMemo(
    () => skill.questions.find((question) => question.id === queue[0]) ?? null,
    [queue, skill.questions]
  );
  const displayQuestion = answeredQuestion ?? currentQuestion;
  const completed = queue.length === 0;
  const progressPercent = Math.round(
    ((skill.questions.length - queue.length) / skill.questions.length) * 100
  );

  function submitAnswer(option: string) {
    if (!currentQuestion || answeredQuestion) {
      return;
    }

    const correct = evaluateAnswer(currentQuestion, option);
    const nextQueue = correct ? queue.slice(1) : [...queue.slice(1), currentQuestion.id];

    setSelectedAnswer(option);
    setAnsweredQuestion(currentQuestion);
    setIsCorrect(correct);
    setAttempts((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        submittedAnswer: option,
        isCorrect: correct
      }
    ]);
    setQueue(nextQueue);
  }

  function continueSession() {
    setSelectedAnswer(null);
    setAnsweredQuestion(null);
    setIsCorrect(false);
  }

  function restartSession() {
    setQueue(skill.questions.filter((question) => question.required).map((question) => question.id));
    setSelectedAnswer(null);
    setAnsweredQuestion(null);
    setIsCorrect(false);
    setAttempts([]);
  }

  return (
    <section className="app-panel route-panel" aria-label={`${skill.title} learning session`}>
      <div className="app-panel-header">
        <div>
          <p className="panel-kicker">Learning Session</p>
          <h2>{skill.title}</h2>
        </div>
        <span className="status-pill">{completed ? `${skill.xp} XP earned` : `${skill.xp} XP`}</span>
      </div>

      <div className="lesson-card">
        <div className="progress-line">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="question-meta">
          <span>{completed ? "Session complete" : currentQuestion?.helper}</span>
          <span>{progressPercent}%</span>
        </div>

        {completed && !answeredQuestion ? (
          <div className="session-summary">
            <Check size={24} />
            <h3>Skill complete</h3>
            <p>
              You answered every required question correctly at least once. Wrong attempts stayed in
              the session until they came back later.
            </p>
            <dl>
              <div>
                <dt>Attempts</dt>
                <dd>{attempts.length}</dd>
              </div>
              <div>
                <dt>XP awarded</dt>
                <dd>{skill.xp}</dd>
              </div>
            </dl>
            <button className="secondary-button" type="button" onClick={restartSession}>
              <RotateCcw size={17} />
              Restart session
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
                    selectedAnswer === option &&
                      answeredQuestion &&
                      option === displayQuestion.correctAnswer &&
                      "correct",
                    selectedAnswer === option &&
                      answeredQuestion &&
                      option !== displayQuestion.correctAnswer &&
                      "wrong"
                  )}
                  onClick={() => submitAnswer(option)}
                  disabled={Boolean(answeredQuestion)}
                >
                  {option}
                </button>
              ))}
            </div>

            {answeredQuestion ? (
              <div className={clsx("feedback", isCorrect ? "correct" : "wrong")}>
                <strong>{isCorrect ? "Correct." : "Good mistake to catch."}</strong>
                <p>{answeredQuestion.explanation}</p>
                <button className="primary-button compact" type="button" onClick={continueSession}>
                  Continue
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : (
              <div className="hint-box">
                <ShieldCheck size={18} />
                Mistakes show feedback and return later in the same session.
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
