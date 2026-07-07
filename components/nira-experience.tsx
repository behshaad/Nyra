"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Lock,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import {
  adminQueue,
  coursePath,
  featureCards,
  flashcards,
  lessonQuestions,
  resourceCards,
  stats,
  strengths,
  type StudyArea
} from "@/lib/nira-data";

const tabs: StudyArea[] = ["Learn", "Flashcards", "Admin", "Analytics"];

export function NiraExperience() {
  const [activeTab, setActiveTab] = useState<StudyArea>("Learn");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const question = lessonQuestions[questionIndex];
  const isCorrect = answered && selectedAnswer === question.answer;
  const progressPercent = useMemo(
    () => Math.round(((questionIndex + (answered ? 1 : 0)) / lessonQuestions.length) * 100),
    [answered, questionIndex]
  );

  function submitAnswer(option: string) {
    setSelectedAnswer(option);
    setAnswered(true);
  }

  function nextQuestion() {
    setAnswered(false);
    setSelectedAnswer(null);
    setQuestionIndex((current) => (current + 1) % lessonQuestions.length);
  }

  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Nira home">
          <span className="brand-mark">N</span>
          <span>
            <strong>Nira</strong>
            <small>Persian-first German</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#learn">Learn</a>
          <a href="#content">Content</a>
          <a href="#premium">Premium</a>
          <a href="#admin">Admin</a>
        </nav>

        <div className="topbar-actions">
          <a className="ghost-button" href="#admin">
            Admin Preview
          </a>
          <a className="primary-button compact" href="#learn">
            Start learning
          </a>
          <button
            className="icon-button mobile-only"
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-expanded={mobileNavOpen}
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileNavOpen ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#learn" onClick={() => setMobileNavOpen(false)}>
            Learn
          </a>
          <a href="#content" onClick={() => setMobileNavOpen(false)}>
            Content
          </a>
          <a href="#premium" onClick={() => setMobileNavOpen(false)}>
            Premium
          </a>
          <a href="#admin" onClick={() => setMobileNavOpen(false)}>
            Admin
          </a>
        </nav>
      ) : null}

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Modern German learning for Persian speakers
          </div>
          <h1>Nira makes German feel guided, friendly, and possible.</h1>
          <p>
            A premium learning experience with CEFR structure, Persian-first
            explanations, smart flashcards, and human-reviewed educational
            content.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#learn">
              Open learning studio
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="#content">
              Explore system
            </a>
          </div>
        </div>

        <section id="learn" className="app-panel" aria-label="Nira learning studio">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Today&apos;s path</p>
              <h2>A1 · Family basics</h2>
            </div>
            <span className="status-pill">12 day streak</span>
          </div>

          <div className="tab-list" role="tablist" aria-label="Nira preview sections">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={clsx("tab-button", activeTab === tab && "active")}
                type="button"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Learn" ? (
            <LearningPanel
              answered={answered}
              isCorrect={isCorrect}
              nextQuestion={nextQuestion}
              progressPercent={progressPercent}
              question={question}
              selectedAnswer={selectedAnswer}
              submitAnswer={submitAnswer}
            />
          ) : null}

          {activeTab === "Flashcards" ? <FlashcardPanel /> : null}
          {activeTab === "Admin" ? <AdminPanel /> : null}
          {activeTab === "Analytics" ? <AnalyticsPanel /> : null}
        </section>
      </section>

      <section className="stats-strip" aria-label="Student progress stats">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <stat.icon size={22} />
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section id="content" className="section-grid">
        <div className="section-copy">
          <span className="section-label">Learning system</span>
          <h2>Built around clarity, repetition, and real progress.</h2>
          <p>
            Nira keeps the Duolingo-like momentum people enjoy, but the
            product language is original: calmer visuals, stronger Persian
            support, and content that stays educator-controlled.
          </p>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <feature.icon size={22} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="premium" className="premium-section">
        <div>
          <span className="section-label">Premium without pressure</span>
          <h2>No hearts. No forced waiting. No ads.</h2>
          <p>
            Free learners can experience the product deeply. Premium unlocks
            the full path, complete flashcards, resources, and advanced
            learning insights without making mistakes feel expensive.
          </p>
        </div>
        <div className="pricing-card">
          <span className="status-pill bright">Recommended</span>
          <h3>Nira Premium</h3>
          <p>Full CEFR path, complete review system, and priority access to new features.</p>
          <ul>
            <li>
              <Check size={18} /> A1-B2 learning path
            </li>
            <li>
              <Check size={18} /> Complete flashcard library
            </li>
            <li>
              <Check size={18} /> Advanced analytics
            </li>
            <li>
              <Check size={18} /> Future AI learning coach
            </li>
          </ul>
        </div>
      </section>

      <section id="admin" className="admin-section">
        <div className="section-copy">
          <span className="section-label">Admin-first content</span>
          <h2>Educational quality stays controlled by humans.</h2>
          <p>
            Admins can draft, review, publish, and archive learning content.
            AI can help generate drafts later, but Nira never auto-publishes
            educational material.
          </p>
        </div>
        <div className="resource-rail">
          {resourceCards.map((resource) => (
            <article className="resource-card" key={resource.title}>
              <resource.icon size={20} />
              <span>{resource.label}</span>
              <strong>{resource.title}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LearningPanel({
  answered,
  isCorrect,
  nextQuestion,
  progressPercent,
  question,
  selectedAnswer,
  submitAnswer
}: {
  answered: boolean;
  isCorrect: boolean;
  nextQuestion: () => void;
  progressPercent: number;
  question: (typeof lessonQuestions)[number];
  selectedAnswer: string | null;
  submitAnswer: (option: string) => void;
}) {
  return (
    <div className="learn-layout">
      <div className="path-column">
        {coursePath.map((skill, index) => (
          <article className={clsx("skill-node", skill.state)} key={skill.title}>
            <span className="node-icon">
              {skill.state === "complete" ? (
                <Check size={17} />
              ) : skill.state === "locked" ? (
                <Lock size={17} />
              ) : (
                <Play size={17} />
              )}
            </span>
            <div>
              <small>Unit {index + 1}</small>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </div>
            <strong>{skill.xp} XP</strong>
          </article>
        ))}
      </div>

      <div className="lesson-card">
        <div className="progress-line">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="question-meta">
          <span>{question.helper}</span>
          <span>{progressPercent}%</span>
        </div>
        <h3>{question.prompt}</h3>
        <div className="answer-grid" dir="rtl">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              className={clsx(
                "answer-option",
                selectedAnswer === option && answered && option === question.answer && "correct",
                selectedAnswer === option && answered && option !== question.answer && "wrong"
              )}
              onClick={() => submitAnswer(option)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>

        {answered ? (
          <div className={clsx("feedback", isCorrect ? "correct" : "wrong")}>
            <strong>{isCorrect ? "Correct. Nice rhythm." : "Good mistake to catch."}</strong>
            <p>{question.explanation}</p>
            <button className="primary-button compact" type="button" onClick={nextQuestion}>
              Continue
              <ChevronRight size={17} />
            </button>
          </div>
        ) : (
          <div className="hint-box">
            <ShieldCheck size={18} />
            Mistakes show explanations and return later in the session.
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardPanel() {
  return (
    <div className="mini-panel-grid">
      {flashcards.map((card) => (
        <article className="flashcard" key={card.front}>
          <div>
            <span>{card.due}</span>
            <h3>{card.front}</h3>
            <p dir="rtl">{card.back}</p>
          </div>
          <div className="mini-progress">
            <span style={{ width: `${card.strength}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="admin-preview">
      {adminQueue.map((item) => (
        <article className="admin-row" key={item.item}>
          <Circle size={12} />
          <div>
            <h3>{item.item}</h3>
            <p>{item.owner}</p>
          </div>
          <span>{item.status}</span>
        </article>
      ))}
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div className="analytics-grid">
      {strengths.map((strength) => (
        <article className="meter-card" key={strength.label}>
          <div>
            <strong>{strength.label}</strong>
            <span>{strength.value}%</span>
          </div>
          <div className="mini-progress">
            <span style={{ width: `${strength.value}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

function AnimatedBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="glow one" />
      <span className="glow two" />
      <span className="grid-glow" />
    </div>
  );
}
