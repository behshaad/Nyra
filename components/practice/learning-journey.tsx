"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { create } from "zustand";
import {
  BarChart3,
  BookOpenCheck,
  Check,
  Dumbbell,
  Lock,
  Settings,
  ShieldCheck,
  Star
} from "lucide-react";
import type {
  PracticeJourneyView,
  PracticeJourneyWorldTone
} from "@/lib/practice/journey";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import {
  DEBUG_WORLD_LAYOUT,
  WORLD_LAYOUT,
  type WorldLevelLabel,
  type WorldMapPoint
} from "@/components/practice/world-map/worldLayout";

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

function levelHref(label: string, language: InterfaceLanguageCode) {
  const href = `/practice/${label.toLowerCase()}`;

  return language === "fa" ? href : `${href}?ui=${language}`;
}

function formatLayoutForCopy(layout: Record<WorldLevelLabel, WorldMapPoint>) {
  return cefrWorlds
    .map((world) => {
      const point = layout[world.label];

      return `${world.label}: { x: ${point.x.toFixed(1)}, y: ${point.y.toFixed(1)} }`;
    })
    .join("\n");
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

  return (
    <section className="practice-stage world-map-stage" aria-label="Practice world map">
      <PracticeSidebar language={language} />
      <div className="practice-main">
        <div className="practice-content world-map-content">
          <WorldMap
            activeLevel={activeLevel}
            levels={levels}
            onFocusLevel={setFocusedLevelLabel}
          />
        </div>
      </div>
    </section>
  );
}

function PracticeSidebar({
  language
}: {
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
    </aside>
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
  const [debugLayout, setDebugLayout] = useState<Record<WorldLevelLabel, WorldMapPoint>>(
    () => ({ ...WORLD_LAYOUT })
  );
  const [draggingLevel, setDraggingLevel] = useState<WorldLevelLabel | null>(null);
  const [layoutPrintRequest, setLayoutPrintRequest] = useState(0);
  const activeLayout = DEBUG_WORLD_LAYOUT ? debugLayout : WORLD_LAYOUT;
  const debugClassName = DEBUG_WORLD_LAYOUT ? " is-debugging-world-layout" : "";

  useEffect(() => {
    if (!DEBUG_WORLD_LAYOUT || draggingLevel === null) {
      return;
    }

    const updateDraggedPoint = (clientX: number, clientY: number) => {
      const canvas = globalThis.document?.querySelector(".world-map-canvas");

      if (!(canvas instanceof globalThis.HTMLElement)) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));

      setDebugLayout((current) => ({
        ...current,
        [draggingLevel]: {
          x: Number(x.toFixed(1)),
          y: Number(y.toFixed(1))
        }
      }));
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      event.preventDefault();
      updateDraggedPoint(event.clientX, event.clientY);
    };

    const handlePointerUp = (event: globalThis.PointerEvent) => {
      event.preventDefault();
      updateDraggedPoint(event.clientX, event.clientY);
      setDraggingLevel(null);
      setLayoutPrintRequest((current) => current + 1);
    };

    globalThis.addEventListener("pointermove", handlePointerMove);
    globalThis.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      globalThis.removeEventListener("pointermove", handlePointerMove);
      globalThis.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingLevel]);

  useEffect(() => {
    if (!DEBUG_WORLD_LAYOUT || draggingLevel !== null || layoutPrintRequest === 0) {
      return;
    }

    console.log(formatLayoutForCopy(debugLayout));
  }, [debugLayout, draggingLevel, layoutPrintRequest]);

  const startDebugDrag = (level: WorldLevelLabel, event: ReactPointerEvent) => {
    if (!DEBUG_WORLD_LAYOUT) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setDraggingLevel(level);
  };

  return (
    <section className="journey-camera world-map" aria-label="Germany world map">
      <div className={`journey-map-canvas world-map-canvas${debugClassName}`}>
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
        {DEBUG_WORLD_LAYOUT ? <div className="world-layout-debug-grid" aria-hidden="true" /> : null}
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
              layout={activeLayout}
              level={level}
              onFocus={() => onFocusLevel(level.label)}
              onStartDebugDrag={startDebugDrag}
            />
          ))}
        </div>
        <WorldMarkers layout={activeLayout} levels={levels} />
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
  layout,
  onFocus,
  onStartDebugDrag
}: {
  level: WorldLevel;
  index: number;
  layout: Record<WorldLevelLabel, WorldMapPoint>;
  onFocus: () => void;
  onStartDebugDrag: (level: WorldLevelLabel, event: ReactPointerEvent) => void;
}) {
  const position = layout[level.label];
  const locked = level.state === "locked" || level.state === "future";
  const current = level.state === "current";
  const completion = level.totalCount > 0 ? `${level.completedCount} / ${level.totalCount}` : "0 / 30";
  const content = (
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
      whileTap={{ scale: 0.96 }}
    >
      <span className="journey-node-aura" aria-hidden="true" />
      <span className="journey-node-hex">
        <span className="journey-node-core">
          {level.state === "completed" ? (
            <Check size={22} />
          ) : locked ? (
            <Lock size={21} />
          ) : (
            <Check size={21} />
          )}
        </span>
      </span>
      <span className="journey-node-copy">
        <strong>{level.label}</strong>
        <small>{level.title}</small>
        <em>{completion}</em>
      </span>
    </motion.span>
  );

  return (
    <div
      className={`journey-node-position level-node-position ${current ? "is-current" : ""}`}
      onMouseEnter={onFocus}
      onPointerDown={(event) => onStartDebugDrag(level.label, event)}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      {DEBUG_WORLD_LAYOUT ? (
        <>
          <span aria-label={`Move ${level.label} world`}>{content}</span>
          <span className="world-layout-coordinate">
            {level.label}: {position.x.toFixed(1)}, {position.y.toFixed(1)}
          </span>
        </>
      ) : (
        <Link href={level.href} aria-label={`Open ${level.label} world`}>
          {content}
        </Link>
      )}
    </div>
  );
}

function WorldMarkers({
  layout,
  levels
}: {
  layout: Record<WorldLevelLabel, WorldMapPoint>;
  levels: WorldLevel[];
}) {
  return (
    <div className="journey-world-markers" aria-hidden="true">
      {levels.map((level) => {
        const position = layout[level.label];

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
