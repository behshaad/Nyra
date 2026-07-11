"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { create } from "zustand";
import {
  BookOpenCheck,
  Castle,
  Check,
  ChevronRight,
  Crown,
  Flame,
  Gem,
  GraduationCap,
  Lock,
  Mountain,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  BarChart3,
  Bot,
  Dumbbell,
  Settings,
  Trophy,
  Zap
} from "lucide-react";
import type {
  PracticeJourneyLevel,
  PracticeJourneyNode,
  PracticeJourneyView,
  PracticeJourneyWorldTone
} from "@/lib/practice/journey";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";

type JourneyStore = {
  activeLevelLabel: string | null;
  setActiveLevelLabel: (label: string) => void;
};

const queryClient = new QueryClient();

const useJourneyStore = create<JourneyStore>((set) => ({
  activeLevelLabel: null,
  setActiveLevelLabel: (label) => set({ activeLevelLabel: label })
}));

const worldCopy: Record<
  PracticeJourneyWorldTone,
  {
    title: string;
    subtitle: string;
  }
> = {
  village: { title: "Village", subtitle: "Windmill fields" },
  town: { title: "Small town", subtitle: "Station and river" },
  city: { title: "Large city", subtitle: "Urban fluency" },
  castle: { title: "Castle", subtitle: "Highlands" },
  mountain: { title: "Mountain", subtitle: "Alpine mastery" },
  academy: { title: "Academy", subtitle: "Scholar path" }
};

const navItems = [
  { href: "/learn", label: "Learn", icon: BookOpenCheck },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/flashcards", label: "Review", icon: ShieldCheck },
  { href: "/resources", label: "Vocabulary", icon: Star },
  { href: "/resources", label: "Grammar", icon: BookOpenCheck },
  { href: "/profile", label: "Progress", icon: BarChart3 },
  { href: "/admin", label: "Community", icon: Bot },
  { href: "/profile", label: "Settings", icon: Settings }
];

function formatPercent(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function getLevelOrigin(index: number) {
  return {
    x: index % 2 === 0 ? 42 : 58,
    y: 320 + index * 620
  };
}

function getNodePosition(index: number, mapHeight: number) {
  const x = 34 + Math.sin(index * 0.48) * 18 + Math.sin(index * 1.08) * 5;
  const y = mapHeight - 320 - index * 88;

  return {
    x: Math.max(16, Math.min(76, x)),
    y: Math.max(220, y)
  };
}

function flattenNodes(levels: PracticeJourneyLevel[]) {
  return levels.flatMap((level) => level.units.flatMap((unit) => unit.nodes));
}

function JourneyProviders({
  children
}: {
  children: ReactNode;
}) {
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
      <LearningJourneyContent initialJourney={initialJourney} language={language} />
    </JourneyProviders>
  );
}

function LearningJourneyContent({
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
  const activeLevelLabel = useJourneyStore((state) => state.activeLevelLabel);
  const setActiveLevelLabel = useJourneyStore((state) => state.setActiveLevelLabel);
  const activeLevel =
    journey.levels.find((level) => level.label === activeLevelLabel) ??
    journey.levels.find((level) =>
      level.units.some((unit) => unit.nodes.some((node) => node.state === "current"))
    ) ??
    journey.levels[0];
  const nodes = flattenNodes(activeLevel ? [activeLevel] : journey.levels);
  const currentNode = journey.currentNode ?? nodes.find((node) => node.state === "current") ?? null;
  const percent = formatPercent(journey.completedCount, journey.totalCount);
  const dailyXp = Math.min(20, Math.max(0, Math.round((journey.completedCount / Math.max(1, journey.totalCount)) * 20)));

  useEffect(() => {
    const node = globalThis.document?.querySelector(".journey-node-position.is-current");
    const camera = globalThis.document?.querySelector(".journey-camera");

    if (
      !(node instanceof globalThis.HTMLElement) ||
      !(camera instanceof globalThis.HTMLElement)
    ) {
      return;
    }

    camera.scrollTo({
      behavior: "smooth",
      top: Math.max(0, node.offsetTop - camera.clientHeight / 2)
    });
  }, [currentNode?.id]);

  return (
    <section className="practice-stage" aria-label="Practice learning journey">
      <PracticeSidebar activeLevel={activeLevel?.label ?? null} language={language} />
      <div className="practice-main">
        <PracticeTopbar journey={journey} language={language} />
        <div className="practice-content">
          <JourneyCamera
            activeLevel={activeLevel}
            levels={journey.levels}
            mapHeight={Math.max(2200, 920 + nodes.length * 88)}
            nodes={nodes}
            currentNode={currentNode}
            onSelectLevel={setActiveLevelLabel}
          />
          <ProgressSidebar
            activeLevel={activeLevel}
            journey={journey}
            percent={percent}
            dailyXp={dailyXp}
          />
        </div>
        <PracticeBottomPanel currentNode={currentNode} journey={journey} />
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
            <Link className={item.href === "/practice" ? "active" : ""} href={href} key={item.href}>
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="practice-premium-card">
        <Gem size={28} />
        <strong>Premium</strong>
        <span>Unlock all features and lessons.</span>
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
      <div>
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

function JourneyCamera({
  activeLevel,
  levels,
  mapHeight,
  nodes,
  currentNode,
  onSelectLevel
}: {
  activeLevel?: PracticeJourneyLevel;
  levels: PracticeJourneyLevel[];
  mapHeight: number;
  nodes: PracticeJourneyNode[];
  currentNode: PracticeJourneyNode | null;
  onSelectLevel: (label: string) => void;
}) {
  return (
    <section className="journey-camera" aria-label="German world map">
      <div className="journey-map-canvas" style={{ height: mapHeight }}>
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
        <JourneyBackground tone={activeLevel?.worldTone ?? "village"} />
        <div className="journey-title">
          <h1>Dein Weg.<br /><span>Deine Sprache.</span></h1>
          <p>Lerne Deutsch Schritt fuer Schritt und entdecke neue Welten.</p>
        </div>
        <LevelRail levels={levels} activeLabel={activeLevel?.label ?? null} onSelectLevel={onSelectLevel} />
        <JourneyPath mapHeight={mapHeight} nodes={nodes} />
        <div className="journey-node-layer">
          {nodes.map((node, index) => (
            <JourneyNode
              index={index}
              key={node.id}
              node={node}
              position={getNodePosition(index, mapHeight)}
              isCurrent={currentNode?.id === node.id}
              mapHeight={mapHeight}
            />
          ))}
        </div>
        <WorldMarkers
          activeLabel={activeLevel?.label ?? null}
          levels={levels}
          mapHeight={mapHeight}
          onSelectLevel={onSelectLevel}
        />
      </div>
    </section>
  );
}

function JourneyBackground({ tone }: { tone: PracticeJourneyWorldTone }) {
  const Icon =
    tone === "academy"
      ? GraduationCap
      : tone === "mountain"
        ? Mountain
        : tone === "castle"
          ? Castle
          : Crown;

  return (
    <div className={`journey-background world-${tone}`} aria-hidden="true">
      <div className="journey-river" />
      <div className="journey-mountains" />
      <div className="journey-forest forest-left" />
      <div className="journey-forest forest-right" />
      <div className="journey-village village-low" />
      <div className="journey-village village-mid" />
      <div className="journey-castle">
        <Icon size={74} />
      </div>
      <div className="journey-windmill" />
      <div className="journey-train" />
    </div>
  );
}

function LevelRail({
  levels,
  activeLabel,
  onSelectLevel
}: {
  levels: PracticeJourneyLevel[];
  activeLabel: string | null;
  onSelectLevel: (label: string) => void;
}) {
  return (
    <div className="journey-level-rail" aria-label="Levels">
      {levels.map((level) => (
        <button
          className={level.label === activeLabel ? "active" : ""}
          key={level.id}
          onClick={() => onSelectLevel(level.label)}
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

function JourneyPath({
  mapHeight,
  nodes
}: {
  mapHeight: number;
  nodes: PracticeJourneyNode[];
}) {
  const points = nodes.map((_, index) => getNodePosition(index, mapHeight)).reverse();
  const path = points.reduce((draft, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlY = previous.y + (point.y - previous.y) * 0.5;

    return `${draft} C ${previous.x} ${controlY}, ${point.x} ${controlY}, ${point.x} ${point.y}`;
  }, "");

  return (
    <svg className="journey-path" viewBox={`0 0 100 ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="journey-path-shadow" d={path} />
      <motion.path
        className="journey-path-core"
        d={path}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <path className="journey-path-lights" d={path} />
    </svg>
  );
}

function JourneyNode({
  node,
  position,
  index,
  isCurrent,
  mapHeight
}: {
  node: PracticeJourneyNode;
  position: { x: number; y: number };
  index: number;
  isCurrent: boolean;
  mapHeight: number;
}) {
  const isLocked = node.state === "locked";
  const isCheckpoint = node.kind !== "REGULAR";
  const content = (
    <motion.span
      className={`journey-node ${node.state} ${isCheckpoint ? "assessment" : ""}`}
      whileHover={isLocked ? undefined : { scale: 1.08, y: -5 }}
      animate={
        isCurrent
          ? {
              scale: [1, 1.05, 1],
              filter: [
                "drop-shadow(0 0 16px rgba(143, 224, 80, 0.55))",
                "drop-shadow(0 0 34px rgba(143, 224, 80, 0.92))",
                "drop-shadow(0 0 16px rgba(143, 224, 80, 0.55))"
              ]
            }
          : isLocked
            ? { y: [0, -4, 0] }
            : undefined
      }
      transition={
        isCurrent || isLocked
          ? { duration: isCurrent ? 2.3 : 4.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.08 }
          : undefined
      }
    >
      <span className="journey-node-hex">
        {node.state === "completed" || node.state === "needs_review" ? (
          <Check size={22} />
        ) : isLocked ? (
          <Lock size={21} />
        ) : (
          <Play size={21} />
        )}
      </span>
      <span className="journey-node-copy">
        <strong>{node.levelLabel}</strong>
        <small>{node.kind === "FINAL_TEST" ? "Final Test" : node.kind === "UNIT_CHECKPOINT" ? "Checkpoint" : node.title}</small>
        <em>{node.questionCount} Q / {node.xp} XP</em>
      </span>
    </motion.span>
  );

  return (
    <div
      className={`journey-node-position ${isCurrent ? "is-current" : ""}`}
      style={{
        left: `${position.x}%`,
        top: Math.min(mapHeight - 170, position.y)
      }}
    >
      {isLocked ? (
        <span aria-label={`${node.title} locked`}>{content}</span>
      ) : (
        <Link href={node.href} aria-label={`Open ${node.title}`}>
          {content}
        </Link>
      )}
    </div>
  );
}

function WorldMarkers({
  levels,
  activeLabel,
  mapHeight,
  onSelectLevel
}: {
  levels: PracticeJourneyLevel[];
  activeLabel: string | null;
  mapHeight: number;
  onSelectLevel: (label: string) => void;
}) {
  return (
    <div className="journey-world-markers" aria-hidden="true">
      {levels.map((level, index) => {
        const origin = getLevelOrigin(index);
        const top = Math.min(mapHeight - 120, origin.y);
        const copy = worldCopy[level.worldTone];

        return (
          <button
            className={level.label === activeLabel ? "active" : ""}
            key={level.id}
            onClick={() => onSelectLevel(level.label)}
            style={{ left: `${origin.x}%`, top }}
            type="button"
          >
            <strong>{level.label}</strong>
            <span>{copy.title}</span>
            <small>{copy.subtitle}</small>
          </button>
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
  activeLevel?: PracticeJourneyLevel;
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
        <Link href="/learn">Uebersicht</Link>
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
        <span><Crown size={16} /> {activeLevel?.completedCount ?? 0} Skills</span>
        <span><Sparkles size={16} /> Neues Dorf</span>
      </div>
    </aside>
  );
}

function PracticeBottomPanel({
  currentNode,
  journey
}: {
  currentNode: PracticeJourneyNode | null;
  journey: PracticeJourneyView;
}) {
  const achievements = [
    { icon: Flame, value: "12", label: "Day Streak" },
    { icon: Crown, value: String(journey.completedCount), label: "Skills" },
    { icon: Zap, value: String(journey.totalXp), label: "XP gesammelt" },
    { icon: Trophy, value: String(journey.needsReviewCount), label: "Review" }
  ];

  return (
    <footer className="practice-bottom-panel">
      <div className="current-lesson-card">
        <span className="lesson-icon"><BookOpenCheck size={22} /></span>
        <div>
          <small>Aktuelle Lektion</small>
          <strong>{currentNode?.title ?? "Journey complete"}</strong>
          <p>{currentNode?.description ?? "Pick any completed Skill to review again."}</p>
          <span>{currentNode?.questionCount ?? 0} Fragen</span>
          <span>{currentNode?.xp ?? 0} XP</span>
        </div>
        {currentNode ? <Link href={currentNode.href}>Weiterlernen <ChevronRight size={16} /></Link> : null}
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
