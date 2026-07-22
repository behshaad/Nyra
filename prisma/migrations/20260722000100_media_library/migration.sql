CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO');
CREATE TYPE "MediaOperationalState" AS ENUM ('UPLOADING', 'READY', 'FAILED', 'QUARANTINED');

CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "attribution" TEXT,
    "sourceNotes" TEXT,
    "originalFilename" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "byteSize" BIGINT NOT NULL,
    "checksum" TEXT NOT NULL,
    "operationalState" "MediaOperationalState" NOT NULL DEFAULT 'READY',
    "uploadedByType" "AdminActorType" NOT NULL,
    "uploadedByUserId" TEXT,
    "uploadedByEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaUsage" (
    "id" TEXT NOT NULL,
    "mediaItemId" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "revisionId" TEXT,
    "context" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaUsage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaItem_pathname_key" ON "MediaItem"("pathname");
CREATE UNIQUE INDEX "MediaItem_publicUrl_key" ON "MediaItem"("publicUrl");
CREATE UNIQUE INDEX "MediaItem_checksum_key" ON "MediaItem"("checksum");
CREATE INDEX "MediaItem_kind_operationalState_idx" ON "MediaItem"("kind", "operationalState");
CREATE INDEX "MediaItem_createdAt_idx" ON "MediaItem"("createdAt");
CREATE UNIQUE INDEX "MediaUsage_mediaItemId_ownerType_ownerId_revisionId_context_key" ON "MediaUsage"("mediaItemId", "ownerType", "ownerId", "revisionId", "context");
CREATE INDEX "MediaUsage_ownerType_ownerId_idx" ON "MediaUsage"("ownerType", "ownerId");
ALTER TABLE "MediaUsage" ADD CONSTRAINT "MediaUsage_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
