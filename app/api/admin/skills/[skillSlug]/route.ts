import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { parseSkillInput } from "@/lib/admin/skill-validation";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      skillSlug: string;
    }>;
  }
) {
  const { skillSlug } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parseSkillInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getPrisma();
  const current = await db.skill.findUnique({
    where: {
      slug: skillSlug
    }
  });

  if (!current) {
    return NextResponse.json(
      { error: "Skill was not found." },
      { status: 404 }
    );
  }

  const skill = await db.skill.update({
    where: {
      id: current.id
    },
    data: parsed.input
  });

  return NextResponse.json({
    slug: skill.slug
  });
}
