import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

type MoveDirection = "up" | "down";

function parseDirection(value: unknown): MoveDirection | null {
  return value === "up" || value === "down" ? value : null;
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  const { questionId } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const direction = parseDirection(body.direction);

  if (!direction) {
    return NextResponse.json(
      { error: "direction must be up or down." },
      { status: 400 }
    );
  }

  const db = getPrisma();
  const result = await db.$transaction(async (tx) => {
    const current = await tx.question.findUnique({
      where: {
        id: questionId
      },
      include: {
        skill: {
          select: {
            slug: true
          }
        }
      }
    });

    if (!current) {
      return { status: 404 as const, error: "Question was not found." };
    }

    const neighbor = await tx.question.findFirst({
      where: {
        skillId: current.skillId,
        order:
          direction === "up"
            ? {
                lt: current.order
              }
            : {
                gt: current.order
              }
      },
      orderBy: {
        order: direction === "up" ? "desc" : "asc"
      }
    });

    if (!neighbor) {
      return {
        status: 200 as const,
        skillSlug: current.skill.slug,
        moved: false
      };
    }

    const temporaryOrder = -Math.abs(current.order || 1);

    await tx.question.update({
      where: {
        id: current.id
      },
      data: {
        order: temporaryOrder
      }
    });
    await tx.question.update({
      where: {
        id: neighbor.id
      },
      data: {
        order: current.order
      }
    });
    await tx.question.update({
      where: {
        id: current.id
      },
      data: {
        order: neighbor.order
      }
    });

    return {
      status: 200 as const,
      skillSlug: current.skill.slug,
      moved: true
    };
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
