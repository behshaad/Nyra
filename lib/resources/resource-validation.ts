import { URL } from "node:url";
import {
  PublicationStatus,
  ResourceType
} from "@/lib/generated/prisma/enums";

export type ResourceInput = {
  title: string;
  slug: string;
  description: string;
  content: string;
  url: string | null;
  levelLabel: string;
  language: string;
  thumbnailIcon: string;
  metadata: Record<string, string>;
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
  const url = optionalId(body.url);
  const levelLabel = clean(body.levelLabel) || "A1";
  const language = clean(body.language) || "fa";
  const thumbnailIcon = clean(body.thumbnailIcon) || "book-open";
  const metadataRaw = clean(body.metadata);
  const type = clean(body.type);
  const publicationStatus = clean(body.publicationStatus);
  const unitId = optionalId(body.unitId);
  const skillId = optionalId(body.skillId);

  if (!title || !slug) {
    return {
      ok: false,
      error: "Title and slug are required."
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

  if (url) {
    try {
      if (new URL(url).protocol !== "https:") throw new Error();
    } catch {
      return { ok: false, error: "Resource URL must be a valid HTTPS URL." };
    }
  }

  const metadata = metadataRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((result, line) => {
      const [key, ...valueParts] = line.split(":");
      const value = valueParts.join(":").trim();

      if (key?.trim() && value) {
        result[key.trim()] = value;
      }

      return result;
    }, {});

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
      url,
      levelLabel,
      language,
      thumbnailIcon,
      metadata,
      type: type as ResourceType,
      publicationStatus: publicationStatus as PublicationStatus,
      unitId,
      skillId
    }
  };
}
