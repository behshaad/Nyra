import {
  PublicationStatus,
  ProgressEventType,
  type SkillKind
} from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";
import { devAuthUserId } from "@/lib/learner/preferences";

type CompletionMetadata = {
  scorePercent?: unknown;
  passed?: unknown;
};

export type SkillProgressState = "completed" | "needs_review" | "current" | "upcoming";

export type PathSkillView = {
  slug: string;
  title: string;
  description: string;
  kind: SkillKind;
  xp: number;
  passingScore: number | null;
  questionCount: number;
  state: SkillProgressState;
  scorePercent: number | null;
  passed: boolean | null;
};

export type PathUnitView = {
  slug: string;
  order: number;
  title: string;
  summary: string;
  skills: PathSkillView[];
  completedCount: number;
  needsReviewCount: number;
  progressPercent: number;
};

export type LearningPathProgressView = {
  units: PathUnitView[];
  nextSkill: PathSkillView | null;
  selectedUnitSlug: string | null;
  completedCount: number;
  totalCount: number;
};

function metadataFrom(value: unknown): CompletionMetadata {
  return value && typeof value === "object" ? (value as CompletionMetadata) : {};
}

type DbSkillForPath = {
  slug: string;
  title: string;
  description: string;
  kind: SkillKind;
  xp: number;
  passingScore: number | null;
  questions: unknown[];
};

type DbUnitForPath = {
  slug: string;
  order: number;
  title: string;
  summary: string;
  skills: DbSkillForPath[];
  levelLabel: string;
};

function skillToFlatView(skill: DbSkillForPath) {
  return {
    slug: skill.slug,
    title: skill.title,
    description: skill.description,
    kind: skill.kind,
    xp: skill.xp,
    passingScore: skill.passingScore,
    questionCount: skill.questions.length
  };
}

async function getA1UnitsFromDb(): Promise<DbUnitForPath[]> {
  const db = getPrisma();
  const units = await db.unit.findMany({
    where: {
      level: {
        label: "A1"
      }
    },
    include: {
      level: true,
      skills: {
        where: {
          publicationStatus: PublicationStatus.PUBLISHED
        },
        include: {
          questions: {
            where: {
              required: true,
              publicationStatus: PublicationStatus.PUBLISHED
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
  });

  return units.map((unit) => ({
    slug: unit.slug,
    order: unit.order,
    title: unit.title,
    summary: unit.summary,
    levelLabel: unit.level.label,
    skills: unit.skills.map((skill) => ({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      kind: skill.kind,
      xp: skill.xp,
      passingScore: skill.passingScore,
      questions: skill.questions
    }))
  }));
}

export async function getFlatA1Skills() {
  const units = await getA1UnitsFromDb();

  return units.flatMap((unit) =>
    unit.skills.map((skill) => ({
      ...skillToFlatView(skill),
      unitSlug: unit.slug,
      unitTitle: unit.title,
      levelLabel: unit.levelLabel
    }))
  );
}

export async function getNextSkillSlug(skillSlug: string) {
  const skills = await getFlatA1Skills();
  const index = skills.findIndex((skill) => skill.slug === skillSlug);

  return index >= 0 ? skills[index + 1]?.slug ?? null : null;
}

export async function getLearningPathProgress(): Promise<LearningPathProgressView> {
  const db = getPrisma();
  const unitsFromDb = await getA1UnitsFromDb();
  const flatSkills = unitsFromDb.flatMap((unit) =>
    unit.skills.map((skill) => ({
      ...skillToFlatView(skill),
      unitSlug: unit.slug,
      unitTitle: unit.title,
      levelLabel: unit.levelLabel
    }))
  );
  const learnerProfile = await db.learnerProfile.findUnique({
    where: {
      authUserId: devAuthUserId
    },
    select: {
      id: true
    }
  });

  const completionBySkillSlug = new Map<
    string,
    { scorePercent: number | null; passed: boolean | null }
  >();

  if (learnerProfile) {
    const events = await db.progressEvent.findMany({
      where: {
        learnerProfileId: learnerProfile.id,
        type: ProgressEventType.SKILL_COMPLETED,
        skill: {
          slug: {
            in: flatSkills.map((skill) => skill.slug)
          }
        }
      },
      include: {
        skill: true
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

  const firstIncompleteSlug = flatSkills.find(
    (skill) => !completionBySkillSlug.has(skill.slug)
  )?.slug;
  let nextSkill: PathSkillView | null = null;

  const units = unitsFromDb.map((unit) => {
    const skills = unit.skills.map((skill) => {
      const completion = completionBySkillSlug.get(skill.slug);
      const needsReview = completion?.passed === false;
      const state: SkillProgressState = completion
        ? needsReview
          ? "needs_review"
          : "completed"
        : skill.slug === firstIncompleteSlug
          ? "current"
          : "upcoming";
      const view: PathSkillView = {
        ...skillToFlatView(skill),
        state,
        scorePercent: completion?.scorePercent ?? null,
        passed: completion?.passed ?? null
      };

      if (state === "current") {
        nextSkill = view;
      }

      return view;
    });
    const completedCount = skills.filter(
      (skill) => skill.state === "completed" || skill.state === "needs_review"
    ).length;
    const needsReviewCount = skills.filter((skill) => skill.state === "needs_review").length;

    return {
      slug: unit.slug,
      order: unit.order,
      title: unit.title,
      summary: unit.summary,
      skills,
      completedCount,
      needsReviewCount,
      progressPercent:
        unit.skills.length === 0
          ? 0
          : Math.round((completedCount / unit.skills.length) * 100)
    };
  });

  const selectedUnitSlug =
    units.find((unit) => unit.skills.some((skill) => skill.state === "current"))?.slug ??
    units.find((unit) => unit.progressPercent < 100)?.slug ??
    units[0]?.slug ??
    null;
  const completedCount = units.reduce((total, unit) => total + unit.completedCount, 0);
  const totalCount = units.reduce((total, unit) => total + unit.skills.length, 0);

  return {
    units,
    nextSkill,
    selectedUnitSlug,
    completedCount,
    totalCount
  };
}
