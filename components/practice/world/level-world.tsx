"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { PracticeSidebar } from "@/components/practice/learning-journey";
import type {
  PracticeJourneyLevel,
  PracticeJourneyNode,
  PracticeJourneyView
} from "@/lib/practice/journey";
import type { LevelWorldConfig } from "@/lib/practice/level-worlds";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { withInterfaceLanguage } from "@/lib/i18n/interface-language";

type SkillPoint = PracticeJourneyNode & {
  pathIndex: number;
  x: number;
  y: number;
};

function statusLabel(skill: PracticeJourneyNode) {
  if (skill.state === "completed") {
    return "Complete";
  }

  if (skill.state === "needs_review") {
    return "Review";
  }

  if (skill.state === "current") {
    return "Current";
  }

  return "Locked";
}

function skillIcon(skill: PracticeJourneyNode) {
  if (skill.state === "completed") {
    return Check;
  }

  if (skill.state === "needs_review") {
    return RotateCcw;
  }

  if (skill.state === "locked") {
    return Lock;
  }

  return skill.kind === "REGULAR" ? Play : ShieldCheck;
}

function buildSkillPoints(level: PracticeJourneyLevel): SkillPoint[] {
  const nodes = level.units.flatMap((unit) => unit.nodes);
  const count = Math.max(nodes.length, 1);

  return nodes.map((node, index) => {
    const progress = count === 1 ? 0 : index / (count - 1);
    const wave = Math.sin(progress * Math.PI * 3.35);
    const alternate = index % 2 === 0 ? -5 : 5;

    return {
      ...node,
      pathIndex: index,
      x: Math.min(74, Math.max(24, 49 + wave * 18 + alternate)),
      y: 91 - progress * 78
    };
  });
}

function pathDataFrom(points: SkillPoint[]) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];
      const controlY = (previous.y + point.y) / 2;

      return `C ${previous.x} ${controlY}, ${point.x} ${controlY}, ${point.x} ${point.y}`;
    })
    .join(" ");
}

export function WorldPage({
  initialJourney,
  levelLabel,
  world,
  language
}: {
  initialJourney: PracticeJourneyView;
  levelLabel: string;
  world: LevelWorldConfig;
  language: InterfaceLanguageCode;
}) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [enteringSkillSlug, setEnteringSkillSlug] = useState<string | null>(null);
  const level = initialJourney.levels.find((candidate) => candidate.label === levelLabel);
  const skillPoints = useMemo(() => (level ? buildSkillPoints(level) : []), [level]);
  const pathData = useMemo(() => pathDataFrom(skillPoints), [skillPoints]);
  const completedCount = level?.completedCount ?? 0;
  const totalCount = level?.totalCount ?? 0;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const returnToJourney = () => {
    setLeaving(true);
    globalThis.setTimeout(() => {
      router.push(withInterfaceLanguage("/practice", language));
    }, 360);
  };

  const enterSkill = (skill: SkillPoint) => {
    if (skill.state === "locked" || enteringSkillSlug) {
      return;
    }

    setEnteringSkillSlug(skill.slug);
    globalThis.setTimeout(() => {
      router.push(
        withInterfaceLanguage(`/practice/${levelLabel.toLowerCase()}/${skill.slug}`, language)
      );
    }, 460);
  };

  return (
    <motion.section
      animate={{ opacity: leaving ? 0 : 1 }}
      className="practice-stage level-world-stage"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <PracticeSidebar language={language} />
      <div className="practice-main level-world-main">
        <WorldBackground world={world} />
        <div className="level-world-topbar">
          <button className="world-back-button" type="button" onClick={returnToJourney}>
            <ArrowLeft size={18} />
            <span>Journey</span>
          </button>
          <div>
            <span>{world.region}</span>
            <h1>{level?.title ?? world.title}</h1>
          </div>
          <div className="world-progress-indicator">
            <strong>{progressPercent}%</strong>
            <span>{completedCount} / {totalCount} Skills</span>
          </div>
        </div>
        {level && skillPoints.length > 0 ? (
          <LessonPath
            enteringSkillSlug={enteringSkillSlug}
            language={language}
            levelLabel={levelLabel}
            onEnterSkill={enterSkill}
            pathData={pathData}
            skillPoints={skillPoints}
          />
        ) : (
          <div className="level-world-empty">
            <Lock size={22} />
            <strong>This Level World is not available yet.</strong>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export function WorldBackground({ world }: { world: LevelWorldConfig }) {
  return (
    <div className={`level-world-background world-${world.tone}`} aria-hidden="true">
      <Image
        alt=""
        className="level-world-background-image"
        fill
        priority
        sizes="(max-width: 840px) 100vw, calc(100vw - 136px)"
        src={world.backgroundImage}
      />
      <div className="level-world-vignette" />
    </div>
  );
}

export function LessonPath({
  enteringSkillSlug,
  language,
  levelLabel,
  onEnterSkill,
  pathData,
  skillPoints
}: {
  enteringSkillSlug: string | null;
  language: InterfaceLanguageCode;
  levelLabel: string;
  onEnterSkill: (skill: SkillPoint) => void;
  pathData: string;
  skillPoints: SkillPoint[];
}) {
  return (
    <div className="level-world-path-layer">
      <svg className="level-world-path-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path className="level-world-path-shadow" d={pathData} />
        <path className="level-world-path-line" d={pathData} />
      </svg>
      {skillPoints.map((skill) => (
        <LessonNode
          entering={enteringSkillSlug === skill.slug}
          key={skill.slug}
          language={language}
          levelLabel={levelLabel}
          onEnterSkill={onEnterSkill}
          skill={skill}
        />
      ))}
      {enteringSkillSlug ? (
        <motion.div
          aria-hidden="true"
          className="skill-transition-fade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.46, ease: "easeOut" }}
        />
      ) : null}
    </div>
  );
}

export function LessonNode({
  entering,
  language,
  levelLabel,
  onEnterSkill,
  skill
}: {
  entering: boolean;
  language: InterfaceLanguageCode;
  levelLabel: string;
  onEnterSkill: (skill: SkillPoint) => void;
  skill: SkillPoint;
}) {
  const Icon = skillIcon(skill);
  const locked = skill.state === "locked";
  const node = (
    <motion.span
      animate={
        entering
          ? { scale: 1.16, y: -8 }
          : skill.state === "current"
            ? { scale: [1, 1.06, 1], y: [0, -4, 0] }
            : undefined
      }
      className={`level-skill-node ${skill.state} ${
        skill.kind === "REGULAR" ? "regular" : "assessment"
      }`}
      transition={
        entering
          ? { duration: 0.46, ease: [0.22, 1, 0.36, 1] }
          : skill.state === "current"
            ? { duration: 2.2, ease: "easeInOut", repeat: Infinity }
            : undefined
      }
      whileHover={locked ? undefined : { scale: 1.05, y: -4 }}
      whileTap={locked ? undefined : { scale: 0.98 }}
    >
      <span className="level-skill-gem">
        <Icon size={20} />
      </span>
      <span className="level-skill-copy">
        <strong>{skill.pathIndex + 1}. {skill.title}</strong>
        <small>{statusLabel(skill)} · {skill.xp} XP · {skill.questionCount} Questions</small>
      </span>
    </motion.span>
  );

  return (
    <div
      className="level-skill-node-position"
      style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
    >
      {locked ? (
        <span aria-label={`${skill.title} is locked`}>{node}</span>
      ) : (
        <Link
          aria-label={`Open ${skill.title}`}
          href={withInterfaceLanguage(
            `/practice/${levelLabel.toLowerCase()}/${skill.slug}`,
            language
          )}
          onClick={(event) => {
            event.preventDefault();
            onEnterSkill(skill);
          }}
        >
          {node}
        </Link>
      )}
      {skill.state === "current" ? (
        <span className="current-skill-ring" aria-hidden="true">
          <Sparkles size={14} />
        </span>
      ) : null}
      {skill.kind !== "REGULAR" ? (
        <span className="assessment-star" aria-hidden="true">
          <Star size={14} />
        </span>
      ) : null}
    </div>
  );
}
