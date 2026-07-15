"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { PracticeSidebar } from "@/components/practice/learning-journey";
import type {
  PracticeJourneyLevel,
  PracticeJourneyNode,
  PracticeJourneyUnit,
  PracticeJourneyView
} from "@/lib/practice/journey";
import type { LevelWorldConfig } from "@/lib/practice/level-worlds";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { withInterfaceLanguage } from "@/lib/i18n/interface-language";
import {
  DEBUG_WORLD_LAYOUT,
  UNIT_WORLD_LAYOUT,
  type UnitWorldLabel,
  type UnitWorldPoint
} from "@/components/practice/world/unitWorldLayout";

type UnitWorldState = "completed" | "needs_review" | "current" | "locked";

type UnitPoint = {
  unit: PracticeJourneyUnit;
  state: UnitWorldState;
  startSkill: PracticeJourneyNode | null;
  canEnter: boolean;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  layoutLabel: UnitWorldLabel;
};

const WORLD_ENTRY_ROUTE_DELAY_MS = 280;
const WORLD_ENTRY_FLASH_SECONDS = 0.34;
const WORLD_ENTRY_NODE_SECONDS = 0.32;

function localizedNumber(value: number, language: InterfaceLanguageCode) {
  if (language !== "fa") {
    return String(value);
  }

  return new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(value);
}

function lessonLabel(order: number, language: InterfaceLanguageCode) {
  const number = localizedNumber(order, language);

  if (language === "fa") {
    return `درس ${number}`;
  }

  if (language === "de") {
    return `Lektion ${number}`;
  }

  return `Lesson ${number}`;
}

function progressLabel(completedCount: number, totalCount: number, language: InterfaceLanguageCode) {
  const completed = localizedNumber(completedCount, language);
  const total = localizedNumber(totalCount, language);

  if (language === "fa") {
    return `${completed} از ${total}`;
  }

  return `${completed} / ${total}`;
}

function stateLabel(state: UnitWorldState, isAdminPreview: boolean) {
  if (isAdminPreview) {
    return "Admin preview";
  }

  if (state === "completed") {
    return "Complete";
  }

  if (state === "needs_review") {
    return "Review";
  }

  if (state === "current") {
    return "Current";
  }

  return "Locked";
}

function resolveUnitState(unit: PracticeJourneyUnit): UnitWorldState {
  if (unit.needsReviewCount > 0) {
    return "needs_review";
  }

  if (unit.totalCount > 0 && unit.completedCount >= unit.totalCount) {
    return "completed";
  }

  if (unit.nodes.some((node) => node.state === "current")) {
    return "current";
  }

  return "locked";
}

function resolveStartSkill(unit: PracticeJourneyUnit, isAdmin: boolean) {
  return (
    unit.nodes.find((node) => node.state === "needs_review") ??
    unit.nodes.find((node) => node.state === "current") ??
    (isAdmin ? unit.nodes[0] : null) ??
    unit.nodes.find((node) => node.state !== "locked") ??
    unit.nodes[0] ??
    null
  );
}

function unitWorldLabel(order: number): UnitWorldLabel {
  return `Lesson${Math.min(12, Math.max(1, order))}` as UnitWorldLabel;
}

function unitRegionPosition(point: UnitWorldPoint) {
  return {
    labelX: Math.min(86, point.x + 11),
    labelY: Math.max(10, point.y - 2)
  };
}

function formatUnitLayoutForCopy(layout: Record<UnitWorldLabel, UnitWorldPoint>) {
  return Object.entries(layout)
    .map(([label, point]) => `${label}: { x: ${point.x.toFixed(1)}, y: ${point.y.toFixed(1)} }`)
    .join("\n");
}

function buildUnitPoints(
  level: PracticeJourneyLevel,
  isAdmin: boolean,
  layout: Record<UnitWorldLabel, UnitWorldPoint>
): UnitPoint[] {
  return level.units.map((unit, index) => {
    const state = resolveUnitState(unit);
    const startSkill = resolveStartSkill(unit, isAdmin);
    const layoutLabel = unitWorldLabel(index + 1);
    const position = layout[layoutLabel] ?? UNIT_WORLD_LAYOUT.Lesson12;
    const labelPosition = unitRegionPosition(position);

    return {
      unit,
      state,
      startSkill,
      canEnter: Boolean(startSkill && (isAdmin || state !== "locked")),
      layoutLabel,
      ...position,
      ...labelPosition
    };
  });
}

export function WorldPage({
  initialJourney,
  isAdmin,
  levelLabel,
  world,
  language
}: {
  initialJourney: PracticeJourneyView;
  isAdmin: boolean;
  levelLabel: string;
  world: LevelWorldConfig;
  language: InterfaceLanguageCode;
}) {
  const router = useRouter();
  const [focusedUnitSlug, setFocusedUnitSlug] = useState<string | null>(null);
  const [enteringUnitSlug, setEnteringUnitSlug] = useState<string | null>(null);
  const [debugLayout, setDebugLayout] = useState<Record<UnitWorldLabel, UnitWorldPoint>>(
    () => ({ ...UNIT_WORLD_LAYOUT })
  );
  const [draggingUnit, setDraggingUnit] = useState<UnitWorldLabel | null>(null);
  const [layoutPrintRequest, setLayoutPrintRequest] = useState(0);
  const [journey, setJourney] = useState(initialJourney);
  const level = journey.levels.find((candidate) => candidate.label === levelLabel);
  const activeLayout = DEBUG_WORLD_LAYOUT ? debugLayout : UNIT_WORLD_LAYOUT;
  const unitPoints = useMemo(
    () => (level ? buildUnitPoints(level, isAdmin, activeLayout) : []),
    [activeLayout, isAdmin, level]
  );
  const activeUnit =
    unitPoints.find((point) => point.unit.slug === focusedUnitSlug) ??
    unitPoints.find((point) => point.state === "current") ??
    unitPoints.find((point) => point.canEnter) ??
    unitPoints[0];
  const enteringPoint = enteringUnitSlug
    ? unitPoints.find((point) => point.unit.slug === enteringUnitSlug)
    : null;
  const refreshJourney = useCallback(async () => {
    try {
      const response = await fetch(`/api/practice-journey?ui=${language}`, {
        cache: "no-store"
      });

      if (response.ok) {
        setJourney((await response.json()) as PracticeJourneyView);
      }
    } catch {
      // Keep the server-rendered journey when a background refresh fails.
    }
  }, [language]);

  useEffect(() => {
    void refreshJourney();
  }, [refreshJourney]);

  useEffect(() => {
    const refreshOnFocus = () => {
      if (globalThis.document.visibilityState === "visible") {
        void refreshJourney();
      }
    };

    globalThis.addEventListener("focus", refreshJourney);
    globalThis.document.addEventListener("visibilitychange", refreshOnFocus);

    return () => {
      globalThis.removeEventListener("focus", refreshJourney);
      globalThis.document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [refreshJourney]);

  useEffect(() => {
    if (!DEBUG_WORLD_LAYOUT || draggingUnit === null) {
      return;
    }

    const updateDraggedPoint = (clientX: number, clientY: number) => {
      const canvas = globalThis.document?.querySelector(".unit-world-canvas");

      if (!(canvas instanceof globalThis.HTMLElement)) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));

      setDebugLayout((current) => ({
        ...current,
        [draggingUnit]: {
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
      setDraggingUnit(null);
      setLayoutPrintRequest((current) => current + 1);
    };

    globalThis.addEventListener("pointermove", handlePointerMove);
    globalThis.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      globalThis.removeEventListener("pointermove", handlePointerMove);
      globalThis.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingUnit]);

  useEffect(() => {
    if (!DEBUG_WORLD_LAYOUT || draggingUnit !== null || layoutPrintRequest === 0) {
      return;
    }

    console.log(formatUnitLayoutForCopy(debugLayout));
  }, [debugLayout, draggingUnit, layoutPrintRequest]);

  const startDebugDrag = (unit: UnitWorldLabel, event: ReactPointerEvent) => {
    if (!DEBUG_WORLD_LAYOUT) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setDraggingUnit(unit);
    setFocusedUnitSlug(
      unitPoints.find((point) => point.layoutLabel === unit)?.unit.slug ?? focusedUnitSlug
    );
  };

  const enterUnit = (point: UnitPoint) => {
    const startSkill = point.startSkill;

    if (DEBUG_WORLD_LAYOUT || !point.canEnter || !startSkill || enteringUnitSlug) {
      return;
    }

    setEnteringUnitSlug(point.unit.slug);
    setFocusedUnitSlug(point.unit.slug);

    globalThis.setTimeout(() => {
      router.push(
        withInterfaceLanguage(
          `/practice/${levelLabel.toLowerCase()}/${startSkill.slug}`,
          language
        )
      );
    }, WORLD_ENTRY_ROUTE_DELAY_MS);
  };

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="practice-stage world-map-stage level-unit-world-stage"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <PracticeSidebar language={language} />
      <div className="practice-main">
        <div className="practice-content world-map-content">
          <section className="journey-camera world-map unit-world-map" aria-label={`${levelLabel} unit world`}>
            <div
              className={`journey-map-canvas world-map-canvas unit-world-canvas${
                DEBUG_WORLD_LAYOUT ? " is-debugging-world-layout" : ""
              }${
                enteringUnitSlug ? " is-entering-world" : ""
              }`}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="journey-map-image"
                fill
                priority
                sizes="(max-width: 840px) 100vw, calc(100vw - 344px)"
                src={world.backgroundImage}
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
              <div className={`journey-background world-${world.tone}`} aria-hidden="true" />
              {DEBUG_WORLD_LAYOUT ? <div className="world-layout-debug-grid" aria-hidden="true" /> : null}
              <div className="journey-title">
                <h1>Dein Weg.<br /><span>Deine Sprache.</span></h1>
                <p>Lerne Deutsch Schritt fuer Schritt und entdecke neue Welten.</p>
              </div>
              {level && unitPoints.length > 0 ? (
                <>
                  <UnitRail
                    activeSlug={activeUnit?.unit.slug ?? null}
                    language={language}
                    onFocusUnit={setFocusedUnitSlug}
                    units={unitPoints}
                  />
                  <div className="journey-node-layer level-node-layer unit-node-layer">
                    {unitPoints.map((point) => (
                      <UnitNode
                        entering={enteringUnitSlug === point.unit.slug}
                        isAdminPreview={isAdmin && point.state === "locked" && point.canEnter}
                        key={point.unit.slug}
                        language={language}
                        onEnterUnit={enterUnit}
                        onFocus={() => setFocusedUnitSlug(point.unit.slug)}
                        onStartDebugDrag={startDebugDrag}
                        point={point}
                      />
                    ))}
                  </div>
                  <UnitMarkers language={language} units={unitPoints} />
                </>
              ) : (
                <div className="level-world-empty">
                  <Lock size={22} />
                  <strong>This Level World is not available yet.</strong>
                </div>
              )}
              {enteringPoint ? (
                <motion.div
                  aria-hidden="true"
                  className="world-transition-overlay"
                  initial={{ opacity: 0, scale: 0.24 }}
                  animate={{ opacity: [0, 0.84, 1], scale: [0.24, 1.6, 4.8] }}
                  transition={{ duration: WORLD_ENTRY_FLASH_SECONDS, ease: [0.22, 1, 0.36, 1] }}
                  style={{ left: `${enteringPoint.x}%`, top: `${enteringPoint.y}%` }}
                />
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </motion.section>
  );
}

function UnitRail({
  activeSlug,
  language,
  onFocusUnit,
  units
}: {
  activeSlug: string | null;
  language: InterfaceLanguageCode;
  onFocusUnit: (slug: string) => void;
  units: UnitPoint[];
}) {
  return (
    <div className="journey-level-rail unit-world-rail" aria-label="Units">
      {[...units].reverse().map((point) => (
        <button
          className={point.unit.slug === activeSlug ? "active" : ""}
          key={point.unit.slug}
          onClick={() => onFocusUnit(point.unit.slug)}
          type="button"
        >
          <span />
          <strong>U{point.unit.order}</strong>
          <small>{lessonLabel(point.unit.order, language)}</small>
        </button>
      ))}
    </div>
  );
}

function UnitNode({
  entering,
  isAdminPreview,
  language,
  onEnterUnit,
  onFocus,
  onStartDebugDrag,
  point
}: {
  entering: boolean;
  isAdminPreview: boolean;
  language: InterfaceLanguageCode;
  onEnterUnit: (point: UnitPoint) => void;
  onFocus: () => void;
  onStartDebugDrag: (unit: UnitWorldLabel, event: ReactPointerEvent) => void;
  point: UnitPoint;
}) {
  const status = stateLabel(point.state, isAdminPreview);
  const disabled = !point.canEnter;
  const Icon =
    point.state === "completed"
      ? Check
      : point.state === "needs_review"
        ? RotateCcw
        : isAdminPreview
          ? ShieldCheck
          : point.state === "current"
            ? Play
            : Lock;

  return (
    <div
      className={`journey-node-position level-node-position unit-node-position ${
        entering ? "is-entering" : ""
      }`}
      onMouseEnter={onFocus}
      onPointerDown={(event) => onStartDebugDrag(point.layoutLabel, event)}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <button
        aria-label={`${lessonLabel(point.unit.order, language)}: ${point.unit.title}. ${status}`}
        className={`unit-world-node ${point.state}${isAdminPreview ? " admin-preview" : ""}`}
        disabled={DEBUG_WORLD_LAYOUT ? false : disabled}
        onClick={() => onEnterUnit(point)}
        type="button"
      >
        <motion.span
          animate={
            entering
              ? { scale: 1.16, y: -6 }
              : point.state === "current"
                ? { scale: [1, 1.055, 1], y: [0, -3, 0] }
                : undefined
          }
          className="unit-pin"
          transition={
            entering
              ? { duration: WORLD_ENTRY_NODE_SECONDS, ease: [0.22, 1, 0.36, 1] }
              : point.state === "current"
                ? { duration: 2.2, ease: "easeInOut", repeat: Infinity }
                : undefined
          }
          whileHover={disabled ? undefined : { scale: 1.05, y: -3 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
        >
          <span className="unit-pin-number">{localizedNumber(point.unit.order, language)}</span>
          <span className="unit-pin-state" aria-hidden="true">
            <Icon size={12} />
          </span>
        </motion.span>
        <span className="unit-lesson-plate">{lessonLabel(point.unit.order, language)}</span>
        <span className="unit-node-progress">
          {progressLabel(point.unit.completedCount, point.unit.totalCount, language)}
        </span>
        {isAdminPreview ? <span className="unit-admin-badge">Admin preview</span> : null}
      </button>
      {DEBUG_WORLD_LAYOUT ? (
        <span className="world-layout-coordinate">
          {point.layoutLabel}: {point.x.toFixed(1)}, {point.y.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}

function UnitMarkers({
  language,
  units
}: {
  language: InterfaceLanguageCode;
  units: UnitPoint[];
}) {
  return (
    <div className="journey-world-markers unit-world-markers" aria-hidden="true">
      {units.map((point) => (
        <span
          className="world-region-label unit-region-label"
          key={point.unit.slug}
          style={{ left: `${point.labelX}%`, top: `${point.labelY}%` }}
        >
          <strong>{point.unit.title}</strong>
          <small>{lessonLabel(point.unit.order, language)}</small>
        </span>
      ))}
    </div>
  );
}
