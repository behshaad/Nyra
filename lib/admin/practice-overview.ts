export type AdminPublicationStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type AdminSkillKind = "REGULAR" | "UNIT_CHECKPOINT" | "FINAL_TEST";
export type AdminPracticeHealth =
  | "available"
  | "needs_attention"
  | "in_preparation"
  | "archived_only"
  | "empty";

export type AdminPracticeQuestionInput = {
  id: string;
  required: boolean;
  publicationStatus: AdminPublicationStatus;
};

export type AdminPracticeSkillInput = {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  kind: AdminSkillKind;
  publicationStatus: AdminPublicationStatus;
  questions: AdminPracticeQuestionInput[];
};

export type AdminPracticeUnitInput = {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  skills: AdminPracticeSkillInput[];
};

export type AdminPracticeLevelInput = {
  id: string;
  label: string;
  order: number;
  title: string;
  units: AdminPracticeUnitInput[];
};

export type AdminPracticeCourseInput = {
  id: string;
  slug: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  levels: AdminPracticeLevelInput[];
};

export type AdminPracticeSkill = AdminPracticeSkillInput & {
  health: Exclude<AdminPracticeHealth, "archived_only" | "empty"> | "archived_only";
  learnerAvailable: boolean;
  requiredPublishedQuestionCount: number;
  questionTarget: number;
  issue: "not_runnable" | "below_target" | null;
  canEdit: boolean;
};

export type AdminPracticeUnit = Omit<AdminPracticeUnitInput, "skills"> & {
  health: AdminPracticeHealth;
  learnerAvailable: boolean;
  skills: AdminPracticeSkill[];
};

export type AdminPracticeLevel = Omit<AdminPracticeLevelInput, "units"> & {
  health: AdminPracticeHealth;
  learnerAvailable: boolean;
  units: AdminPracticeUnit[];
};

export type AdminPracticeOverview = Omit<AdminPracticeCourseInput, "levels"> & {
  levels: AdminPracticeLevel[];
  metrics: {
    levels: { authored: number; learnerAvailable: number };
    units: { authored: number; learnerAvailable: number };
    skills: { authored: number; learnerAvailable: number; needsAttention: number };
    questions: { authored: number; learnerAvailableRequired: number };
  };
};

export function questionTargetForSkill(kind: AdminSkillKind) {
  if (kind === "UNIT_CHECKPOINT") return 12;
  if (kind === "FINAL_TEST") return 40;
  return 8;
}

function projectSkill(skill: AdminPracticeSkillInput): AdminPracticeSkill {
  const requiredPublishedQuestionCount = skill.questions.filter(
    (question) => question.required && question.publicationStatus === "PUBLISHED"
  ).length;
  const questionTarget = questionTargetForSkill(skill.kind);
  const learnerAvailable =
    skill.publicationStatus === "PUBLISHED" && requiredPublishedQuestionCount > 0;
  const issue =
    skill.publicationStatus === "PUBLISHED" && requiredPublishedQuestionCount === 0
      ? "not_runnable"
      : skill.publicationStatus === "PUBLISHED" &&
          requiredPublishedQuestionCount < questionTarget
        ? "below_target"
        : null;
  const health: AdminPracticeSkill["health"] =
    skill.publicationStatus === "ARCHIVED"
      ? "archived_only"
      : skill.publicationStatus === "PUBLISHED"
        ? issue
          ? "needs_attention"
          : "available"
        : "in_preparation";

  return {
    ...skill,
    health,
    learnerAvailable,
    requiredPublishedQuestionCount,
    questionTarget,
    issue,
    canEdit: skill.publicationStatus === "DRAFT"
  };
}

function healthFromSkills(skills: AdminPracticeSkill[]): AdminPracticeHealth {
  if (skills.length === 0) return "empty";
  if (skills.some((skill) => skill.health === "needs_attention")) return "needs_attention";
  if (skills.some((skill) => skill.learnerAvailable)) return "available";
  if (skills.some((skill) => skill.publicationStatus !== "ARCHIVED")) {
    return "in_preparation";
  }
  return "archived_only";
}

function projectUnit(unit: AdminPracticeUnitInput): AdminPracticeUnit {
  const skills = unit.skills.map(projectSkill);

  return {
    ...unit,
    skills,
    health: healthFromSkills(skills),
    learnerAvailable: skills.some((skill) => skill.learnerAvailable)
  };
}

function healthFromUnits(units: AdminPracticeUnit[]): AdminPracticeHealth {
  if (units.length === 0 || units.every((unit) => unit.health === "empty")) return "empty";
  if (units.some((unit) => unit.health === "needs_attention")) return "needs_attention";
  if (units.some((unit) => unit.learnerAvailable)) return "available";
  if (units.some((unit) => unit.health === "in_preparation")) return "in_preparation";
  return "archived_only";
}

export function projectAdminPracticeOverview(
  course: AdminPracticeCourseInput
): AdminPracticeOverview {
  const levels = course.levels.map((level) => {
    const units = level.units.map(projectUnit);

    return {
      ...level,
      units,
      health: healthFromUnits(units),
      learnerAvailable: units.some((unit) => unit.learnerAvailable)
    };
  });
  const units = levels.flatMap((level) => level.units);
  const skills = units.flatMap((unit) => unit.skills);
  const questions = skills.flatMap((skill) => skill.questions);

  return {
    ...course,
    levels,
    metrics: {
      levels: {
        authored: levels.length,
        learnerAvailable: levels.filter((level) => level.learnerAvailable).length
      },
      units: {
        authored: units.length,
        learnerAvailable: units.filter((unit) => unit.learnerAvailable).length
      },
      skills: {
        authored: skills.length,
        learnerAvailable: skills.filter((skill) => skill.learnerAvailable).length,
        needsAttention: skills.filter((skill) => skill.health === "needs_attention").length
      },
      questions: {
        authored: questions.length,
        learnerAvailableRequired: questions.filter(
          (question) => question.required && question.publicationStatus === "PUBLISHED"
        ).length
      }
    }
  };
}
