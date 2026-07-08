import { NextResponse } from "next/server";
import {
  PublicationStatus,
  ResourceType
} from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";

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

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
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
    return NextResponse.json(
      { error: "Title, slug, description, and content are required." },
      { status: 400 }
    );
  }

  if (!isSlug(slug)) {
    return NextResponse.json(
      { error: "Slug must use lowercase letters, numbers, and hyphens." },
      { status: 400 }
    );
  }

  if (!resourceTypes.has(type as ResourceType)) {
    return NextResponse.json(
      { error: "Resource Type is invalid." },
      { status: 400 }
    );
  }

  if (!publicationStatuses.has(publicationStatus as PublicationStatus)) {
    return NextResponse.json(
      { error: "Publication status is invalid." },
      { status: 400 }
    );
  }

  const db = getPrisma();
  const existing = await db.resource.findUnique({
    where: {
      slug
    }
  });

  if (existing) {
    return NextResponse.json(
      { error: "A Resource with this slug already exists." },
      { status: 409 }
    );
  }

  if (unitId) {
    const unit = await db.unit.findUnique({
      where: {
        id: unitId
      }
    });

    if (!unit) {
      return NextResponse.json(
        { error: "Related Unit was not found." },
        { status: 400 }
      );
    }
  }

  if (skillId) {
    const skill = await db.skill.findUnique({
      where: {
        id: skillId
      }
    });

    if (!skill) {
      return NextResponse.json(
        { error: "Related Skill was not found." },
        { status: 400 }
      );
    }
  }

  const resource = await db.resource.create({
    data: {
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
  });

  return NextResponse.json(
    {
      slug: resource.slug
    },
    { status: 201 }
  );
}
