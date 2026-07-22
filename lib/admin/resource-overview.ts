import { URL } from "node:url";
import type { PublicationStatus, ResourceType } from "@/lib/generated/prisma/enums";

export type AdminResourceRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  type: ResourceType;
  levelLabel: string;
  language: string;
  url: string | null;
  publicationStatus: PublicationStatus;
  updatedAt: Date;
  unit: { id: string; title: string; level?: { label: string } | null } | null;
  skill: { id: string; title: string; unitId?: string } | null;
};

const destinationTypes = new Set<ResourceType>([
  "EXTERNAL_LINK",
  "VIDEO",
  "AUDIO_LESSON"
]);

export function isHttpsUrl(value: string | null) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function resourceReadiness(resource: AdminResourceRecord) {
  const issues: string[] = [];
  if (!resource.title.trim()) issues.push("Missing title");
  if (!resource.description.trim()) issues.push("Missing description");
  if (!resource.content.trim()) issues.push("Missing body content");
  if (destinationTypes.has(resource.type) && !isHttpsUrl(resource.url)) {
    issues.push(
      resource.type === "EXTERNAL_LINK"
        ? "Valid HTTPS destination required"
        : "Valid HTTPS media URL required"
    );
  }
  if (resource.language !== "fa/de/en") issues.push("Needs trilingual localization");
  if (resource.skill && resource.unit && resource.skill.unitId !== resource.unit.id) {
    issues.push("Contradictory hierarchy placement");
  }
  return { ready: issues.length === 0, issues };
}

export function resourcePlacement(resource: AdminResourceRecord) {
  if (resource.skill) return `Skill · ${resource.skill.title}`;
  if (resource.unit) return `Unit · ${resource.unit.title}`;
  return `Level · ${resource.levelLabel}`;
}

export function filterAdminResources(
  resources: AdminResourceRecord[],
  filters: { q?: string; status?: string; type?: string; level?: string }
) {
  const query = filters.q?.trim().toLocaleLowerCase() ?? "";
  return resources.filter((resource) => {
    const matchesQuery =
      !query ||
      [resource.title, resource.slug, resource.description, resource.unit?.title, resource.skill?.title]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(query);
    return (
      matchesQuery &&
      (!filters.status || resource.publicationStatus === filters.status) &&
      (!filters.type || resource.type === filters.type) &&
      (!filters.level || resource.levelLabel === filters.level)
    );
  });
}
