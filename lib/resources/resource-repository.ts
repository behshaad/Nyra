import {
  MediaKind,
  MediaOperationalState,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";

export async function getPublishedResourcesFromDb() {
  const db = getPrisma();

  const [resources, thumbnails] = await Promise.all([
    db.resource.findMany({
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
    }),
    db.mediaUsage.findMany({
      where: {
        ownerType: "RESOURCE",
        context: "thumbnail"
      },
      include: {
        mediaItem: true
      }
    })
  ]);
  const thumbnailsByResource = new Map(
    thumbnails.map((usage) => [usage.ownerId, usage.mediaItem.publicUrl])
  );

  return resources.map((resource) => ({
    ...resource,
    thumbnailImageUrl: thumbnailsByResource.get(resource.id) ?? null
  }));
}

export async function getResourceBySlug(resourceSlug: string) {
  const db = getPrisma();

  const resource = await db.resource.findUnique({
    where: {
      slug: resourceSlug
    },
    include: {
      unit: true,
      skill: true
    }
  });
  if (!resource) return null;

  const thumbnail = await db.mediaUsage.findFirst({
    where: {
      ownerType: "RESOURCE",
      ownerId: resource.id,
      context: "thumbnail"
    },
    include: {
      mediaItem: true
    }
  });

  return {
    ...resource,
    thumbnailMediaId: thumbnail?.mediaItemId ?? null,
    thumbnailImageUrl: thumbnail?.mediaItem.publicUrl ?? null
  };
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

export async function getResourceImageOptions() {
  return getPrisma().mediaItem.findMany({
    where: {
      kind: MediaKind.IMAGE,
      operationalState: MediaOperationalState.READY
    },
    select: {
      id: true,
      displayName: true,
      publicUrl: true
    },
    orderBy: {
      displayName: "asc"
    }
  });
}
