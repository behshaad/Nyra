import { PublicationStatus } from "@/lib/generated/prisma/enums";

export type SkillInput = {
  title: string;
  description: string;
  xp: number;
  publicationStatus: PublicationStatus;
};

const publicationStatuses = new Set(Object.values(PublicationStatus));

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseSkillInput(body: Record<string, unknown>):
  | { ok: true; input: SkillInput }
  | { ok: false; error: string } {
  const title = clean(body.title);
  const description = clean(body.description);
  const publicationStatus = clean(body.publicationStatus);
  const rawXp = typeof body.xp === "number" ? body.xp : Number(clean(body.xp));

  if (!title || !description) {
    return {
      ok: false,
      error: "Title and description are required."
    };
  }

  if (!Number.isInteger(rawXp) || rawXp < 0 || rawXp > 1000) {
    return {
      ok: false,
      error: "XP must be an integer between 0 and 1000."
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
      description,
      xp: rawXp,
      publicationStatus: publicationStatus as PublicationStatus
    }
  };
}
