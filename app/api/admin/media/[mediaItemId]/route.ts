import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { recordAdminAudit } from "@/lib/admin/audit-log";
import { getPrisma } from "@/lib/db/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ mediaItemId: string }> }) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;
  const { mediaItemId } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  if (!displayName) return NextResponse.json({ error: "Display Name is required." }, { status: 400 });
  const db = getPrisma();
  const current = await db.mediaItem.findUnique({ where: { id: mediaItemId } });
  if (!current) return NextResponse.json({ error: "Media Item was not found." }, { status: 404 });
  const optional = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
  const updated = await db.mediaItem.update({ where: { id: current.id }, data: { displayName, description: optional(body.description), attribution: optional(body.attribution), sourceNotes: optional(body.sourceNotes) } });
  await recordAdminAudit(request, { action: "media.update", entityType: "MediaItem", entityId: current.id, summary: `Updated Media Item ${updated.displayName}`, before: current, after: updated });
  return NextResponse.json({ updated: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ mediaItemId: string }> }) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Media storage is not configured." }, { status: 503 });
  const { mediaItemId } = await params;
  const db = getPrisma();
  const item = await db.mediaItem.findUnique({ where: { id: mediaItemId }, include: { usages: true } });
  if (!item) return NextResponse.json({ error: "Media Item was not found." }, { status: 404 });
  if (item.usages.length > 0) return NextResponse.json({ error: "Referenced Media Items cannot be deleted." }, { status: 409 });
  await del(item.publicUrl);
  await db.mediaItem.delete({ where: { id: item.id } });
  await recordAdminAudit(request, { action: "media.delete", entityType: "MediaItem", entityId: item.id, summary: `Deleted unused Media Item ${item.displayName}`, before: { id: item.id, kind: item.kind, checksum: item.checksum } });
  return NextResponse.json({ deleted: true });
}
