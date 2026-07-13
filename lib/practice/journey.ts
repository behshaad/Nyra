import { PublicationStatus, ProgressEventType, SkillKind } from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";
import { devAuthUserId } from "@/lib/learner/preferences";
import { withInterfaceLanguage, type InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { getLearningPathDisplayCopy } from "@/lib/learning/sample-content";

type CompletionMetadata = {
  scorePercent?: unknown;
  passed?: unknown;
};

export type PracticeJourneyNodeState =
  | "completed"
  | "needs_review"
  | "current"
  | "locked";

export type PracticeJourneyWorldTone = "village" | "town" | "city" | "castle" | "mountain" | "academy";

export type PracticeJourneyNode = {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: SkillKind;
  order: number;
  unitOrder: number;
  levelOrder: number;
  levelLabel: string;
  levelTitle: string;
  unitSlug: string;
  unitTitle: string;
  unitSummary: string;
  xp: number;
  passingScore: number | null;
  questionCount: number;
  state: PracticeJourneyNodeState;
  scorePercent: number | null;
  passed: boolean | null;
  href: string;
};

export type PracticeJourneyUnit = {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  completedCount: number;
  needsReviewCount: number;
  totalCount: number;
  nodes: PracticeJourneyNode[];
};

export type PracticeJourneyLevel = {
  id: string;
  label: string;
  order: number;
  title: string;
  worldTone: PracticeJourneyWorldTone;
  completedCount: number;
  needsReviewCount: number;
  totalCount: number;
  units: PracticeJourneyUnit[];
};

export type PracticeJourneyView = {
  course: {
    id: string;
    slug: string;
    title: string;
    sourceLanguage: string;
    targetLanguage: string;
  } | null;
  currentNode: PracticeJourneyNode | null;
  completedCount: number;
  needsReviewCount: number;
  totalCount: number;
  totalXp: number;
  levels: PracticeJourneyLevel[];
};

export type GetPracticeJourneyInput = {
  authUserId?: string;
  courseSlug?: string;
  interfaceLanguage?: InterfaceLanguageCode;
};

function metadataFrom(value: unknown): CompletionMetadata {
  return value && typeof value === "object" ? (value as CompletionMetadata) : {};
}

function worldToneForOrder(order: number): PracticeJourneyWorldTone {
  const tones: PracticeJourneyWorldTone[] = [
    "village",
    "town",
    "city",
    "castle",
    "mountain",
    "academy"
  ];

  return tones[(Math.max(order, 1) - 1) % tones.length];
}

export async function getPracticeJourney(
  input: GetPracticeJourneyInput = {}
): Promise<PracticeJourneyView> {
  const db = getPrisma();
  const course = await db.course.findFirst({
    where: input.courseSlug
      ? {
          slug: input.courseSlug
        }
      : undefined,
    include: {
      levels: {
        include: {
          units: {
            include: {
              skills: {
                where: {
                  publicationStatus: PublicationStatus.PUBLISHED
                },
                include: {
                  questions: {
                    where: {
                      required: true,
                      publicationStatus: PublicationStatus.PUBLISHED
                    },
                    select: {
                      id: true
                    }
                  }
                },
                orderBy: {
                  order: "asc"
                }
              }
            },
            orderBy: {
              order: "asc"
            }
          }
        },
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  if (!course) {
    return {
      course: null,
      currentNode: null,
      completedCount: 0,
      needsReviewCount: 0,
      totalCount: 0,
      totalXp: 0,
      levels: []
    };
  }

  const flatSkills = course.levels.flatMap((level) =>
    level.units.flatMap((unit) =>
      unit.skills.map((skill) => ({
        skill,
        unit,
        level
      }))
    )
  );
  const displayCopyByLevelLabel = new Map(
    course.levels.map((level) => [
      level.label,
      getLearningPathDisplayCopy(level.label, input.interfaceLanguage ?? "fa")
    ])
  );
  const learnerProfile = await db.learnerProfile.findUnique({
    where: {
      authUserId: input.authUserId ?? devAuthUserId
    },
    select: {
      id: true
    }
  });
  const completionBySkillSlug = new Map<
    string,
    { scorePercent: number | null; passed: boolean | null }
  >();

  if (learnerProfile && flatSkills.length > 0) {
    const events = await db.progressEvent.findMany({
      where: {
        learnerProfileId: learnerProfile.id,
        type: ProgressEventType.SKILL_COMPLETED,
        skill: {
          slug: {
            in: flatSkills.map(({ skill }) => skill.slug)
          }
        }
      },
      include: {
        skill: {
          select: {
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    for (const event of events) {
      if (!event.skill) {
        continue;
      }

      const metadata = metadataFrom(event.metadata);
      completionBySkillSlug.set(event.skill.slug, {
        scorePercent:
          typeof metadata.scorePercent === "number" ? metadata.scorePercent : null,
        passed: typeof metadata.passed === "boolean" ? metadata.passed : null
      });
    }
  }

  const currentSkillSlug = flatSkills.find(
    ({ skill }) => !completionBySkillSlug.has(skill.slug)
  )?.skill.slug;
  const currentSkillSlugByLevel = new Map<string, string>();

  for (const level of course.levels) {
    const currentLevelSkill = level.units
      .flatMap((unit) => unit.skills)
      .find((skill) => !completionBySkillSlug.has(skill.slug));

    if (currentLevelSkill) {
      currentSkillSlugByLevel.set(level.id, currentLevelSkill.slug);
    }
  }

  let currentNode: PracticeJourneyNode | null = null;

  const levels = course.levels.map((level) => {
    const displayLevel = displayCopyByLevelLabel.get(level.label);
    const currentLevelSkillSlug = currentSkillSlugByLevel.get(level.id);
    const units = level.units
      .map((unit) => {
        const displayUnit = displayLevel?.units[unit.slug];
        const nodes = unit.skills.map((skill) => {
          const completion = completionBySkillSlug.get(skill.slug);
          const displaySkill = displayUnit?.skills[skill.slug];
          const needsReview = completion?.passed === false;
          const state: PracticeJourneyNodeState = completion
            ? needsReview
              ? "needs_review"
              : "completed"
            : skill.slug === currentLevelSkillSlug
              ? "current"
              : "locked";
          const node: PracticeJourneyNode = {
            id: skill.id,
            slug: skill.slug,
            title: displaySkill?.title ?? skill.title,
            description: displaySkill?.description ?? skill.description,
            kind: skill.kind,
            order: skill.order,
            unitOrder: unit.order,
            levelOrder: level.order,
            levelLabel: level.label,
            levelTitle: displayLevel?.levelTitle ?? level.title,
            unitSlug: unit.slug,
            unitTitle: displayUnit?.title ?? unit.title,
            unitSummary: displayUnit?.summary ?? unit.summary,
            xp: skill.xp,
            passingScore: skill.passingScore,
            questionCount: skill.questions.length,
            state,
            scorePercent: completion?.scorePercent ?? null,
            passed: completion?.passed ?? null,
            href: withInterfaceLanguage(`/learn/${skill.slug}`, input.interfaceLanguage ?? "fa")
          };

          if (state === "current" && skill.slug === currentSkillSlug) {
            currentNode = node;
          }

          return node;
        });
        const completedCount = nodes.filter(
          (node) => node.state === "completed" || node.state === "needs_review"
        ).length;
        const needsReviewCount = nodes.filter((node) => node.state === "needs_review").length;

        return {
          id: unit.id,
          slug: unit.slug,
          order: unit.order,
          title: displayUnit?.title ?? unit.title,
          summary: displayUnit?.summary ?? unit.summary,
          completedCount,
          needsReviewCount,
          totalCount: nodes.length,
          nodes
        };
      })
      .filter((unit) => unit.totalCount > 0);
    const completedCount = units.reduce((total, unit) => total + unit.completedCount, 0);
    const needsReviewCount = units.reduce((total, unit) => total + unit.needsReviewCount, 0);
    const totalCount = units.reduce((total, unit) => total + unit.totalCount, 0);

    return {
      id: level.id,
      label: level.label,
      order: level.order,
      title: displayLevel?.levelTitle ?? level.title,
      worldTone: worldToneForOrder(level.order),
      completedCount,
      needsReviewCount,
      totalCount,
      units
    };
  });
  const completedCount = levels.reduce((total, level) => total + level.completedCount, 0);
  const needsReviewCount = levels.reduce((total, level) => total + level.needsReviewCount, 0);
  const totalCount = levels.reduce((total, level) => total + level.totalCount, 0);
  const totalXp = flatSkills.reduce((total, { skill }) => total + skill.xp, 0);

  return {
    course: {
      id: course.id,
      slug: course.slug,
      title: course.title,
      sourceLanguage: course.sourceLanguage,
      targetLanguage: course.targetLanguage
    },
    currentNode,
    completedCount,
    needsReviewCount,
    totalCount,
    totalXp,
    levels,
  };
}
