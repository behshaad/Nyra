import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";
import { parseResourceInput } from "@/lib/resources/resource-validation";

export async function POST(request: Request) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;

  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseResourceInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const input = parsed.input;
  const db = getPrisma();
  const existing = await db.resource.findUnique({
    where: {
      slug: input.slug
    }
  });

  if (existing) {
    return NextResponse.json(
      { error: "A Resource with this slug already exists." },
      { status: 409 }
    );
  }

  if (input.unitId) {
    const unit = await db.unit.findUnique({
      where: {
        id: input.unitId
      }
    });

    if (!unit) {
      return NextResponse.json(
        { error: "Related Unit was not found." },
        { status: 400 }
      );
    }
  }

  if (input.skillId) {
    const skill = await db.skill.findUnique({
      where: {
        id: input.skillId
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
      title: input.title,
      slug: input.slug,
      description: input.description,
      content: input.content,
      levelLabel: input.levelLabel,
      language: input.language,
      thumbnailIcon: input.thumbnailIcon,
      metadata: input.metadata,
      type: input.type,
      publicationStatus: input.publicationStatus,
      unitId: input.unitId,
      skillId: input.skillId
    }
  });

  return NextResponse.json(
    {
      slug: resource.slug
    },
    { status: 201 }
  );
}
