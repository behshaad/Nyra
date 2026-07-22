import { getPrisma } from "@/lib/db/prisma";

export async function getAdminMediaItems() {
  return getPrisma().mediaItem.findMany({
    include: { usages: { select: { id: true, protected: true } } },
    orderBy: { createdAt: "desc" }
  });
}

export function isMediaStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
