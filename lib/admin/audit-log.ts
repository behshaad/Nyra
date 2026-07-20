import { createHash } from "node:crypto";
import { getAdminActorForRequest } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

type AuditValue = Record<string, unknown> | null | undefined;

export type AdminAuditInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  before?: AuditValue;
  after?: AuditValue;
};

const sensitiveKey = /(password|secret|token|authorization|cookie|submittedAnswer)/i;

export function sanitizeAuditValue(value: unknown, depth = 0): unknown {
  if (depth > 4) {
    return "[depth-limited]";
  }

  if (typeof value === "string") {
    return value.length > 2_000 ? `${value.slice(0, 2_000)}…` : value;
  }

  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => sanitizeAuditValue(item, depth + 1));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !sensitiveKey.test(key))
        .slice(0, 100)
        .map(([key, item]) => [key, sanitizeAuditValue(item, depth + 1)])
    );
  }

  return String(value);
}

function requestIpHash(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const secret = process.env.AUDIT_IP_HASH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!ip || !secret) {
    return null;
  }

  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

export async function recordAdminAudit(
  request: Request,
  input: AdminAuditInput
) {
  const actor = await getAdminActorForRequest(request);

  if (!actor) {
    throw new Error("Cannot record an Admin Log without an authorized actor.");
  }

  return getPrisma().adminAuditLog.create({
    data: {
      actorType: actor.type,
      actorAuthUserId: actor.authUserId,
      actorEmail: actor.email,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary: input.summary,
      before: input.before
        ? (sanitizeAuditValue(input.before) as Prisma.InputJsonValue)
        : undefined,
      after: input.after
        ? (sanitizeAuditValue(input.after) as Prisma.InputJsonValue)
        : undefined,
      requestId:
        request.headers.get("x-request-id") ?? request.headers.get("x-vercel-id"),
      ipHash: requestIpHash(request),
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null
    }
  });
}
