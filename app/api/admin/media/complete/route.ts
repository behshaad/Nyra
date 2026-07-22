import { del } from "@vercel/blob";
import { URL } from "node:url";
import { NextResponse } from "next/server";
import { getAdminActorForRequest, requireAdminApiAccess } from "@/lib/auth/admin-access";
import { recordAdminAudit } from "@/lib/admin/audit-log";
import { getPrisma } from "@/lib/db/prisma";
import { signatureMatchesMediaType, validateMediaUpload } from "@/lib/media/media-policy";

export async function POST(request: Request) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;
  const body = (await request.json()) as Record<string, unknown>;
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const attribution = typeof body.attribution === "string" ? body.attribution.trim() : "";
  const sourceNotes = typeof body.sourceNotes === "string" ? body.sourceNotes.trim() : "";
  const originalFilename = typeof body.originalFilename === "string" ? body.originalFilename : "";
  const pathname = typeof body.pathname === "string" ? body.pathname : "";
  const publicUrl = typeof body.publicUrl === "string" ? body.publicUrl : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "";
  const checksum = typeof body.checksum === "string" ? body.checksum.toLowerCase() : "";
  const byteSize = typeof body.byteSize === "number" ? body.byteSize : 0;
  const validation = validateMediaUpload({ filename: originalFilename, mimeType, byteSize });
  if (!displayName) return NextResponse.json({ error: "Display Name is required." }, { status: 400 });
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });
  if (!/^[a-f0-9]{64}$/.test(checksum)) return NextResponse.json({ error: "Checksum is invalid." }, { status: 400 });
  try {
    const url = new URL(publicUrl);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".public.blob.vercel-storage.com")) throw new Error();
  } catch {
    return NextResponse.json({ error: "Blob URL is invalid." }, { status: 400 });
  }

  const db = getPrisma();
  const duplicate = await db.mediaItem.findUnique({ where: { checksum } });
  if (duplicate) {
    await del(publicUrl).catch(() => undefined);
    return NextResponse.json({ error: "This file already exists.", existing: { id: duplicate.id, displayName: duplicate.displayName } }, { status: 409 });
  }

  const signatureResponse = await fetch(publicUrl, { headers: { Range: "bytes=0-31" }, cache: "no-store" });
  const signature = new Uint8Array(await signatureResponse.arrayBuffer());
  if (!signatureResponse.ok || !signatureMatchesMediaType(mimeType, signature)) {
    await del(publicUrl).catch(() => undefined);
    return NextResponse.json({ error: "Uploaded file signature does not match its declared type." }, { status: 400 });
  }

  const actor = await getAdminActorForRequest(request);
  if (!actor) return NextResponse.json({ error: "Admin Access is required." }, { status: 401 });
  const mediaItem = await db.mediaItem.create({ data: {
    displayName, description: description || null, attribution: attribution || null, sourceNotes: sourceNotes || null,
    originalFilename, pathname, publicUrl, mimeType, kind: validation.kind, byteSize: BigInt(byteSize), checksum,
    uploadedByType: actor.type, uploadedByUserId: actor.authUserId, uploadedByEmail: actor.email
  } });
  await recordAdminAudit(request, { action: "media.create", entityType: "MediaItem", entityId: mediaItem.id, summary: `Uploaded Media Item ${mediaItem.displayName}`, after: { id: mediaItem.id, kind: mediaItem.kind, mimeType, byteSize, checksum } });
  return NextResponse.json({ id: mediaItem.id }, { status: 201 });
}
