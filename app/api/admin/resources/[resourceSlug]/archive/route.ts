import { NextResponse } from "next/server";
import { PublicationStatus } from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";

export async function PATCH(
  _request: Request,
  context: {
    params: Promise<{
      resourceSlug: string;
    }>;
  }
) {
  const { resourceSlug } = await context.params;
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

  await db.resource.update({
    where: {
      id: current.id
    },
    data: {
      publicationStatus: PublicationStatus.ARCHIVED
    }
  });

  return NextResponse.json({
    slug: current.slug,
    publicationStatus: PublicationStatus.ARCHIVED
  });
}
