import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";
import { parseResourceInput } from "@/lib/resources/resource-validation";
import { recordAdminAudit } from "@/lib/admin/audit-log";
import { canEditDraftContent, draftRevisionRequiredMessage } from "@/lib/admin/content-editability";
import { PublicationStatus } from "@/lib/generated/prisma/enums";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      resourceSlug: string;
    }>;
  }
) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;

  const { resourceSlug } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseResourceInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const input = parsed.input;
  const db = getPrisma();
  const current = await db.resource.findUnique({
    where: {
      slug: resourceSlug
    }
  });

  if (!current) {
    return NextResponse.json(
      { error: "Resource was not found." },
      { status: 404 }
    );
  }

  if (!canEditDraftContent({ aggregateStatus: current.publicationStatus })) {
    return NextResponse.json({ error: draftRevisionRequiredMessage }, { status: 409 });
  }
  if (input.publicationStatus !== PublicationStatus.DRAFT) {
    return NextResponse.json(
      { error: "Generic Resource editing cannot change Publication Status." },
      { status: 400 }
    );
  }

  if (input.slug !== resourceSlug) {
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
  }

  let levelLabel = input.levelLabel;
  let unitId = input.unitId;

  if (unitId) {
    const unit = await db.unit.findUnique({
      where: { id: unitId },
      include: { level: true }
    });

    if (!unit) {
      return NextResponse.json(
        { error: "Related Unit was not found." },
        { status: 400 }
      );
    }
    levelLabel = unit.level.label;
  }

  if (input.skillId) {
    const skill = await db.skill.findUnique({
      where: { id: input.skillId },
      include: { unit: { include: { level: true } } }
    });

    if (!skill) {
      return NextResponse.json(
        { error: "Related Skill was not found." },
        { status: 400 }
      );
    }
    if (unitId && skill.unitId !== unitId) {
      return NextResponse.json(
        { error: "Related Skill must belong to the selected Unit." },
        { status: 400 }
      );
    }
    unitId = skill.unitId;
    levelLabel = skill.unit.level.label;
  }

  const resource = await db.resource.update({
    where: {
      id: current.id
    },
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      content: input.content,
      url: input.url,
      levelLabel,
      language: input.language,
      thumbnailIcon: input.thumbnailIcon,
      metadata: input.metadata,
      type: input.type,
      unitId,
      skillId: input.skillId
    }
  });

  await recordAdminAudit(request, {
    action: "resource.update",
    entityType: "Resource",
    entityId: resource.id,
    summary: `Updated Resource ${resource.slug}`,
    before: current,
    after: resource
  });

  return NextResponse.json({
    slug: resource.slug
  });
}
