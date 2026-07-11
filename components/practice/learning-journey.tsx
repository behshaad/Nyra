"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { create } from "zustand";
import {
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronRight,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Lock,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap
} from "lucide-react";
import type {
  PracticeJourneyView,
  PracticeJourneyWorldTone
} from "@/lib/practice/journey";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { WORLD_LAYOUT, type WorldLevelLabel } from "@/components/practice/world-map/worldLayout";

type WorldLevelState = "completed" | "current" | "locked" | "future";

type WorldLevel = {
  label: WorldLevelLabel;
  title: string;
  region: string;
  tone: PracticeJourneyWorldTone;
  href: string;
  completedCount: number;
  totalCount: number;
  xp: number;
  state: WorldLevelState;
};

type JourneyStore = {
  focusedLevelLabel: string | null;
  setFocusedLevelLabel: (label: string) => void;
};

const queryClient = new QueryClient();

const useJourneyStore = create<JourneyStore>((set) => ({
  focusedLevelLabel: null,
  setFocusedLevelLabel: (label) => set({ focusedLevelLabel: label })
}));

const cefrWorlds: Array<{
  label: WorldLevelLabel;
  title: string;
  region: string;
  tone: PracticeJourneyWorldTone;
  subtitle: string;
}> = [
  {
    label: "A1",
    title: "Anfaenger",
    region: "Dorfleben",
    tone: "village",
    subtitle: "Village"
  },
  {
    label: "A2",
    title: "Grundstufe",
    region: "Kleinstadt",
    tone: "town",
    subtitle: "Small town"
  },
  {
    label: "B1",
    title: "Mittelstufe",
    region: "Grossstadt",
    tone: "city",
    subtitle: "City"
  },
  {
    label: "B2",
    title: "Oberstufe",
    region: "Die Burg",
    tone: "castle",
    subtitle: "Castle"
  },
  {
    label: "C1",
    title: "Fortgeschritten",
    region: "Bergstadt",
    tone: "mountain",
    subtitle: "Mountains"
  },
  {
    label: "C2",
    title: "Mastery",
    region: "Die Akademie",
    tone: "academy",
    subtitle: "Academy"
  }
];

const navItems = [
  { href: "/learn", label: "Learn", icon: BookOpenCheck },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/flashcards", label: "Review", icon: ShieldCheck },
  { href: "/resources", label: "Vocabulary", icon: Star },
  { href: "/resources", label: "Grammar", icon: BookOpenCheck },
  { href: "/profile", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Settings", icon: Settings }
];

function formatPercent(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function levelHref(label: string, language: InterfaceLanguageCode) {
  const href = `/practice/${label.toLowerCase()}`;

  return language === "fa" ? href : `${href}?ui=${language}`;
}

function buildWorldLevels(
  journey: PracticeJourneyView,
  language: InterfaceLanguageCode
): WorldLevel[] {
  const byLabel = new Map(journey.levels.map((level) => [level.label, level]));
  const currentLabel =
    journey.currentNode?.levelLabel ??
    journey.levels.find((level) => level.totalCount > level.completedCount)?.label ??
    "A1";
  let currentAssigned = false;

  return cefrWorlds.map((world) => {
    const level = byLabel.get(world.label);
    const completedCount = level?.completedCount ?? 0;
    const totalCount = level?.totalCount ?? 0;
    let state: WorldLevelState = "locked";

    if (totalCount > 0 && completedCount >= totalCount) {
      state = "completed";
    } else if (!currentAssigned && (world.label === currentLabel || totalCount > 0)) {
      state = "current";
      currentAssigned = true;
    } else if (!currentAssigned) {
      state = "future";
    }

    return {
      label: world.label,
      title: level?.title ?? world.title,
      region: world.region,
      tone: level?.worldTone ?? world.tone,
      href: levelHref(world.label, language),
      completedCount,
      totalCount,
      xp:
        level?.units.reduce(
          (total, unit) => total + unit.nodes.reduce((sum, node) => sum + node.xp, 0),
          0
        ) ?? 0,
      state
    };
  });
}

function JourneyProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function LearningJourney({
  initialJourney,
  language
}: {
  initialJourney: PracticeJourneyView;
  language: InterfaceLanguageCode;
}) {
  return (
    <JourneyProviders>
      <PracticeWorld initialJourney={initialJourney} language={language} />
    </JourneyProviders>
  );
}

function PracticeWorld({
  initialJourney,
  language
}: {
  initialJourney: PracticeJourneyView;
  language: InterfaceLanguageCode;
}) {
  const { data: journey } = useQuery({
    queryKey: ["practice-journey", language],
    queryFn: async () => {
      const response = await fetch(`/api/practice-journey?ui=${language}`);

      if (!response.ok) {
        throw new Error("Practice journey could not be loaded.");
      }

      return (await response.json()) as PracticeJourneyView;
    },
    initialData: initialJourney
  });
  const focusedLevelLabel = useJourneyStore((state) => state.focusedLevelLabel);
  const setFocusedLevelLabel = useJourneyStore((state) => state.setFocusedLevelLabel);
  const levels = buildWorldLevels(journey, language);
  const activeLevel =
    levels.find((level) => level.label === focusedLevelLabel) ??
    levels.find((level) => level.state === "current") ??
    levels[0];
  const percent = formatPercent(journey.completedCount, journey.totalCount);
  const dailyXp = Math.min(
    20,
    Math.max(0, Math.round((journey.completedCount / Math.max(1, journey.totalCount)) * 20))
  );

  return (
    <section className="practice-stage world-map-stage" aria-label="Practice world map">
      <PracticeSidebar activeLevel={activeLevel?.label ?? null} language={language} />
      <div className="practice-main">
        <PracticeTopbar journey={journey} language={language} />
        <div className="practice-content world-map-content">
          <WorldMap
            activeLevel={activeLevel}
            levels={levels}
            onFocusLevel={setFocusedLevelLabel}
          />
          <ProgressSidebar
            activeLevel={activeLevel}
            journey={journey}
            percent={percent}
            dailyXp={dailyXp}
          />
        </div>
        <PracticeBottomPanel activeLevel={activeLevel} journey={journey} />
      </div>
    </section>
  );
}

function PracticeSidebar({
  activeLevel,
  language
}: {
  activeLevel: string | null;
  language: InterfaceLanguageCode;
}) {
  return (
    <aside className="practice-sidebar" aria-label="Practice navigation">
      <Link className="practice-brand" href="/">
        <span className="practice-brand-mark">L</span>
        <strong>Lingoix</strong>
      </Link>
      <nav className="practice-side-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = language === "fa" ? item.href : `${item.href}?ui=${language}`;

          return (
            <Link
              className={item.href === "/practice" ? "active" : ""}
              href={href}
              key={`${item.href}-${item.label}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="practice-premium-card">
        <Gem size={28} />
        <strong>Go Premium</strong>
        <span>Unlock all lessons and features</span>
        <Link href={language === "fa" ? "/pricing" : `/pricing?ui=${language}`}>Upgrade</Link>
      </div>
      {activeLevel ? <span className="practice-side-level">Current world {activeLevel}</span> : null}
    </aside>
  );
}

function PracticeTopbar({
  journey,
  language
}: {
  journey: PracticeJourneyView;
  language: InterfaceLanguageCode;
}) {
  return (
    <header className="practice-topbar">
      <div className="practice-topbar-copy">
        <p>{journey.course?.title ?? "German Learning Path"}</p>
        <strong>Dein Weg. <span>Deine Sprache.</span></strong>
      </div>
      <div className="practice-stats">
        <span><Flame size={17} /> 12 <small>Day Streak</small></span>
        <span><Gem size={17} /> {journey.totalXp} <small>XP</small></span>
        <span><Trophy size={17} /> {journey.completedCount} <small>Done</small></span>
        <span className="practice-language">DE</span>
        <Link href={language === "fa" ? "/profile" : `/profile?ui=${language}`} className="practice-avatar">
          <span>L</span>
        </Link>
      </div>
    </header>
  );
}

function WorldMap({
  activeLevel,
  levels,
  onFocusLevel
}: {
  activeLevel?: WorldLevel;
  levels: WorldLevel[];
  onFocusLevel: (label: string) => void;
}) {
  return (
    <section className="journey-camera world-map" aria-label="Germany world map">
      <div className="journey-map-canvas world-map-canvas">
        <Image
          alt=""
          aria-hidden="true"
          className="journey-map-image"
          fill
          priority
          sizes="(max-width: 840px) 100vw, calc(100vw - 344px)"
          src="/practice/germany-journey-map.png"
        />
        <div className="journey-world-light" />
        <div className="journey-ambient-layer" aria-hidden="true">
          <span className="cloud cloud-one" />
          <span className="cloud cloud-two" />
          <span className="fog fog-one" />
          <span className="fog fog-two" />
          <span className="light-ray ray-one" />
          <span className="light-ray ray-two" />
          <span className="water-shimmer shimmer-one" />
        </div>
        <Environment tone={activeLevel?.tone ?? "village"} />
        <div className="journey-title">
          <h1>Dein Weg.<br /><span>Deine Sprache.</span></h1>
          <p>Lerne Deutsch Schritt fuer Schritt und entdecke neue Welten.</p>
        </div>
        <LevelRail levels={levels} activeLabel={activeLevel?.label ?? null} onFocusLevel={onFocusLevel} />
        <div className="journey-node-layer level-node-layer">
          {levels.map((level, index) => (
            <LevelNode
              index={index}
              key={level.label}
              level={level}
              onFocus={() => onFocusLevel(level.label)}
            />
          ))}
        </div>
        <WorldMarkers levels={levels} />
      </div>
    </section>
  );
}

function Environment({ tone }: { tone: PracticeJourneyWorldTone }) {
  return <div className={`journey-background world-${tone}`} aria-hidden="true" />;
}

function LevelRail({
  levels,
  activeLabel,
  onFocusLevel
}: {
  levels: WorldLevel[];
  activeLabel: string | null;
  onFocusLevel: (label: string) => void;
}) {
  return (
    <div className="journey-level-rail" aria-label="Levels">
      {[...levels].reverse().map((level) => (
        <button
          className={level.label === activeLabel ? "active" : ""}
          key={level.label}
          onClick={() => onFocusLevel(level.label)}
          type="button"
        >
          <span />
          <strong>{level.label}</strong>
          <small>{level.title}</small>
        </button>
      ))}
    </div>
  );
}

function LevelNode({
  level,
  index,
  onFocus
}: {
  level: WorldLevel;
  index: number;
  onFocus: () => void;
}) {
  const position = WORLD_LAYOUT[level.label];
  const locked = level.state === "locked" || level.state === "future";
  const current = level.state === "current";
  const completion = level.totalCount > 0 ? `${level.completedCount} / ${level.totalCount}` : "0 / 30";

  return (
    <div
      className={`journey-node-position level-node-position ${current ? "is-current" : ""}`}
      onMouseEnter={onFocus}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <Link href={level.href} aria-label={`Open ${level.label} world`}>
        <motion.span
          animate={
            current
              ? {
                  scale: [1, 1.055, 1],
                  filter: [
                    "drop-shadow(0 0 18px rgba(255, 213, 78, 0.62))",
                    "drop-shadow(0 0 38px rgba(255, 213, 78, 0.94))",
                    "drop-shadow(0 0 18px rgba(255, 213, 78, 0.62))"
                  ]
                }
              : locked
                ? { y: [0, -3, 0] }
                : undefined
          }
          className={`journey-node level-world-node ${level.state} world-${level.tone}`}
          transition={
            current || locked
              ? { duration: current ? 2.4 : 5.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.08 }
              : undefined
          }
          whileHover={{ scale: 1.08, y: -5 }}
        >
          <span className="journey-node-hex">
            {level.state === "completed" ? (
              <Check size={22} />
            ) : locked ? (
              <Lock size={21} />
            ) : (
              <Check size={21} />
            )}
          </span>
          <span className="journey-node-copy">
            <strong>{level.label}</strong>
            <small>{level.title}</small>
            <em>{completion}</em>
          </span>
        </motion.span>
      </Link>
    </div>
  );
}

function WorldMarkers({ levels }: { levels: WorldLevel[] }) {
  return (
    <div className="journey-world-markers" aria-hidden="true">
      {levels.map((level) => {
        const position = WORLD_LAYOUT[level.label];

        return (
          <span
            className="world-region-label"
            key={level.label}
            style={{
              left: `${Math.min(82, position.x + 11)}%`,
              top: `${Math.max(10, position.y - 2)}%`
            }}
          >
            <strong>{level.region}</strong>
          </span>
        );
      })}
    </div>
  );
}

function ProgressSidebar({
  activeLevel,
  journey,
  percent,
  dailyXp
}: {
  activeLevel?: WorldLevel;
  journey: PracticeJourneyView;
  percent: number;
  dailyXp: number;
}) {
  const levelPercent = activeLevel
    ? formatPercent(activeLevel.completedCount, activeLevel.totalCount)
    : percent;

  return (
    <aside className="practice-progress-sidebar" aria-label="Practice progress">
      <div className="progress-orb-card">
        <h2>Dein Fortschritt</h2>
        <div className="progress-orb" style={{ "--progress": `${percent}%` } as CSSProperties}>
          <strong>{percent}%</strong>
        </div>
        <p>{journey.completedCount} / {journey.totalCount} Skills abgeschlossen</p>
        <Link href="/learn">Details ansehen</Link>
      </div>
      <div className="practice-side-card">
        <h2>Tagesziel</h2>
        <div className="daily-goal">
          <Zap size={18} />
          <strong>{dailyXp}</strong>
          <span>/ 20 XP</span>
        </div>
        <div className="daily-bar"><span style={{ width: `${(dailyXp / 20) * 100}%` }} /></div>
        <button type="button">Weiter lernen</button>
      </div>
      <div className="practice-side-card">
        <h2>Aktuelles Level</h2>
        <div className="current-level-chip">
          <strong>{activeLevel?.label ?? "A1"}</strong>
          <span>{activeLevel?.title ?? "Grundstufe"}</span>
        </div>
        <p>{levelPercent}% in dieser Welt abgeschlossen.</p>
      </div>
      <div className="practice-side-card rewards-card">
        <h2>Belohnungen</h2>
        <span><Gem size={16} /> {journey.totalXp} XP</span>
        <span><Crown size={16} /> {activeLevel?.completedCount ?? 0} Levels</span>
        <span><Sparkles size={16} /> Neues Ziel</span>
      </div>
    </aside>
  );
}

function PracticeBottomPanel({
  activeLevel,
  journey
}: {
  activeLevel?: WorldLevel;
  journey: PracticeJourneyView;
}) {
  const achievements = [
    { icon: Flame, value: "12", label: "Day Streak" },
    { icon: Crown, value: String(journey.completedCount), label: "Progress" },
    { icon: Zap, value: String(journey.totalXp), label: "XP gesammelt" },
    { icon: Trophy, value: String(journey.needsReviewCount), label: "Review" }
  ];

  return (
    <footer className="practice-bottom-panel">
      <div className="current-lesson-card">
        <span className="lesson-icon"><BookOpenCheck size={22} /></span>
        <div>
          <small>Aktuelle Welt</small>
          <strong>{activeLevel ? `${activeLevel.label} ${activeLevel.title}` : "Journey complete"}</strong>
          <p>{activeLevel ? `${activeLevel.region} ist dein aktuelles Ziel auf der Deutschlandkarte.` : "Pick a CEFR world to continue."}</p>
          <span>{activeLevel?.completedCount ?? 0} abgeschlossen</span>{" "}
          <span>{activeLevel?.xp ?? 0} XP</span>
        </div>
        {activeLevel ? <Link href={activeLevel.href}>Weiterlernen <ChevronRight size={16} /></Link> : null}
      </div>
      <div className="achievement-strip">
        <div className="achievement-header">
          <strong>Erfolge</strong>
          <Link href="/profile">Alle ansehen</Link>
        </div>
        <div className="achievement-list">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;

            return (
              <span key={achievement.label}>
                <Icon size={24} />
                <strong>{achievement.value}</strong>
                <small>{achievement.label}</small>
              </span>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
