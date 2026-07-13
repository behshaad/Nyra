"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
};

const unitLayout: Array<{ x: number; y: number; labelX: number; labelY: number }> = [
  { x: 57, y: 94, labelX: 68, labelY: 92 },
  { x: 38, y: 84, labelX: 50, labelY: 83 },
  { x: 62, y: 76, labelX: 73, labelY: 74 },
  { x: 42, y: 68, labelX: 54, labelY: 67 },
  { x: 67, y: 60, labelX: 78, labelY: 59 },
  { x: 48, y: 53, labelX: 60, labelY: 52 },
  { x: 72, y: 46, labelX: 83, labelY: 45 },
  { x: 50, y: 39, labelX: 62, labelY: 38 },
  { x: 69, y: 32, labelX: 80, labelY: 31 },
  { x: 44, y: 25, labelX: 56, labelY: 24 },
  { x: 63, y: 18, labelX: 74, labelY: 17 },
  { x: 78, y: 12, labelX: 85, labelY: 13 }
];

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

function buildUnitPoints(level: PracticeJourneyLevel, isAdmin: boolean): UnitPoint[] {
  return level.units.map((unit, index) => {
    const state = resolveUnitState(unit);
    const startSkill = resolveStartSkill(unit, isAdmin);
    const position = unitLayout[index] ?? unitLayout[unitLayout.length - 1];

    return {
      unit,
      state,
      startSkill,
      canEnter: Boolean(startSkill && (isAdmin || state !== "locked")),
      ...position
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
  const level = initialJourney.levels.find((candidate) => candidate.label === levelLabel);
  const unitPoints = useMemo(
    () => (level ? buildUnitPoints(level, isAdmin) : []),
    [isAdmin, level]
  );
  const activeUnit =
    unitPoints.find((point) => point.unit.slug === focusedUnitSlug) ??
    unitPoints.find((point) => point.state === "current") ??
    unitPoints.find((point) => point.canEnter) ??
    unitPoints[0];
  const enteringPoint = enteringUnitSlug
    ? unitPoints.find((point) => point.unit.slug === enteringUnitSlug)
    : null;

  const enterUnit = (point: UnitPoint) => {
    const startSkill = point.startSkill;

    if (!point.canEnter || !startSkill || enteringUnitSlug) {
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
    }, 620);
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
                  transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
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
  point
}: {
  entering: boolean;
  isAdminPreview: boolean;
  language: InterfaceLanguageCode;
  onEnterUnit: (point: UnitPoint) => void;
  onFocus: () => void;
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
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <button
        aria-label={`${lessonLabel(point.unit.order, language)}: ${point.unit.title}. ${status}`}
        className={`unit-world-node ${point.state}${isAdminPreview ? " admin-preview" : ""}`}
        disabled={disabled}
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
              ? { duration: 0.46, ease: [0.22, 1, 0.36, 1] }
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
          {point.unit.completedCount} / {point.unit.totalCount}
        </span>
        {isAdminPreview ? <span className="unit-admin-badge">Admin preview</span> : null}
      </button>
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
