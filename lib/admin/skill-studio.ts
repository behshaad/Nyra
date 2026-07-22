import { questionTargetForSkill } from "@/lib/admin/practice-overview";
import type { PublicationStatus, SkillKind } from "@/lib/generated/prisma/enums";

export type SkillStudioSkill = {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  kind: SkillKind;
  publicationStatus: PublicationStatus;
  xp: number;
  questions: Array<{ required: boolean; publicationStatus: PublicationStatus }>;
};

export type SkillStudioUnit = {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  level: { id: string; label: string; order: number; title: string };
  skills: SkillStudioSkill[];
};

export type SkillReadiness = "ready" | "needs_attention" | "in_preparation" | "archived";

export function skillStudioReadiness(skill: SkillStudioSkill) {
  const publishedRequiredQuestions = skill.questions.filter(
    (question) => question.required && question.publicationStatus === "PUBLISHED"
  ).length;
  const target = questionTargetForSkill(skill.kind);
  const learnerAvailable = skill.publicationStatus === "PUBLISHED" && publishedRequiredQuestions > 0;
  const readiness: SkillReadiness =
    skill.publicationStatus === "ARCHIVED"
      ? "archived"
      : skill.publicationStatus !== "PUBLISHED"
        ? "in_preparation"
        : publishedRequiredQuestions < target
          ? "needs_attention"
          : "ready";

  return { learnerAvailable, publishedRequiredQuestions, target, readiness };
}

export function filterSkillStudioUnits(
  units: SkillStudioUnit[],
  filters: { q?: string; status?: string; kind?: string; level?: string; readiness?: string }
) {
  const query = filters.q?.trim().toLocaleLowerCase() ?? "";

  return units
    .map((unit) => ({
      ...unit,
      skills: unit.skills.filter((skill) => {
        const readiness = skillStudioReadiness(skill).readiness;
        const matchesQuery =
          !query ||
          [skill.title, skill.slug, unit.title, unit.slug, unit.level.title, unit.level.label]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query);
        return (
          matchesQuery &&
          (!filters.status || skill.publicationStatus === filters.status) &&
          (!filters.kind || skill.kind === filters.kind) &&
          (!filters.level || unit.level.label === filters.level) &&
          (!filters.readiness || readiness === filters.readiness)
        );
      })
    }))
    .filter((unit) => unit.skills.length > 0);
}

export function groupSkillStudioByLevel(units: SkillStudioUnit[]) {
  const levels = new Map<string, { id: string; label: string; order: number; title: string; units: SkillStudioUnit[] }>();
  for (const unit of units) {
    const level = levels.get(unit.level.id) ?? { ...unit.level, units: [] };
    level.units.push(unit);
    levels.set(unit.level.id, level);
  }
  return [...levels.values()]
    .sort((a, b) => a.order - b.order)
    .map((level) => ({ ...level, units: level.units.sort((a, b) => a.order - b.order) }));
}

