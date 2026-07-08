import {
  PublicationStatus,
  ResourceType
} from "@/lib/generated/prisma/enums";

export type ResourceInput = {
  title: string;
  slug: string;
  description: string;
  content: string;
  levelLabel: string;
  type: ResourceType;
  publicationStatus: PublicationStatus;
  unitId: string | null;
  skillId: string | null;
};

const resourceTypes = new Set(Object.values(ResourceType));
const publicationStatuses = new Set(Object.values(PublicationStatus));

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalId(value: unknown) {
  const cleaned = clean(value);
  return cleaned.length > 0 ? cleaned : null;
}

function isSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function parseResourceInput(body: Record<string, unknown>):
  | { ok: true; input: ResourceInput }
  | { ok: false; error: string } {
  const title = clean(body.title);
  const slug = clean(body.slug).toLowerCase();
  const description = clean(body.description);
  const content = clean(body.content);
  const levelLabel = clean(body.levelLabel) || "A1";
  const type = clean(body.type);
  const publicationStatus = clean(body.publicationStatus);
  const unitId = optionalId(body.unitId);
  const skillId = optionalId(body.skillId);

  if (!title || !slug || !description || !content) {
    return {
      ok: false,
      error: "Title, slug, description, and content are required."
    };
  }

  if (!isSlug(slug)) {
    return {
      ok: false,
      error: "Slug must use lowercase letters, numbers, and hyphens."
    };
  }

  if (!resourceTypes.has(type as ResourceType)) {
    return {
      ok: false,
      error: "Resource Type is invalid."
    };
  }

  if (!publicationStatuses.has(publicationStatus as PublicationStatus)) {
    return {
      ok: false,
      error: "Publication status is invalid."
    };
  }

  return {
    ok: true,
    input: {
      title,
      slug,
      description,
      content,
      levelLabel,
      type: type as ResourceType,
      publicationStatus: publicationStatus as PublicationStatus,
      unitId,
      skillId
    }
  };
}
