import { PublicationStatus } from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";

export async function getPublishedResourcesFromDb() {
  const db = getPrisma();

  return db.resource.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED
    },
    include: {
      unit: true,
      skill: true
    },
    orderBy: {
      title: "asc"
    }
  });
}

export async function getResourceBySlug(resourceSlug: string) {
  const db = getPrisma();

  return db.resource.findUnique({
    where: {
      slug: resourceSlug
    },
    include: {
      unit: true,
      skill: true
    }
  });
}

export async function getAdminResourcesFromDb() {
  const db = getPrisma();

  return db.resource.findMany({
    include: {
      unit: {
        include: {
          level: true
        }
      },
      skill: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function getResourceFormOptions() {
  const db = getPrisma();

  return db.unit.findMany({
    include: {
      level: true,
      skills: {
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  });
}
