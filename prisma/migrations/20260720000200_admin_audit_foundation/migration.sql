-- CreateEnum
CREATE TYPE "AdminActorType" AS ENUM ('AUTH_USER', 'BASIC_AUTH_ADMIN');

-- CreateEnum
CREATE TYPE "ErrorSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginIpHash" TEXT,
ADD COLUMN     "lastLoginProvider" TEXT;

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorType" "AdminActorType" NOT NULL,
    "actorAuthUserId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "requestId" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationErrorLog" (
    "id" TEXT NOT NULL,
    "severity" "ErrorSeverity" NOT NULL DEFAULT 'ERROR',
    "fingerprint" TEXT NOT NULL,
    "route" TEXT,
    "method" TEXT,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" JSONB,
    "requestId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorAuthUserId_createdAt_idx" ON "AdminAuditLog"("actorAuthUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityType_entityId_createdAt_idx" ON "AdminAuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_createdAt_idx" ON "AdminAuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationErrorLog_createdAt_idx" ON "ApplicationErrorLog"("createdAt");

-- CreateIndex
CREATE INDEX "ApplicationErrorLog_severity_createdAt_idx" ON "ApplicationErrorLog"("severity", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationErrorLog_fingerprint_createdAt_idx" ON "ApplicationErrorLog"("fingerprint", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicationErrorLog_resolvedAt_createdAt_idx" ON "ApplicationErrorLog"("resolvedAt", "createdAt");
