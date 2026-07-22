import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { getPrisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;
  const body = (await request.json()) as { checksum?: unknown };
  const checksum = typeof body.checksum === "string" ? body.checksum.toLowerCase() : "";
  if (!/^[a-f0-9]{64}$/.test(checksum)) return NextResponse.json({ error: "Checksum is invalid." }, { status: 400 });
  const existing = await getPrisma().mediaItem.findUnique({ where: { checksum }, select: { id: true, displayName: true, publicUrl: true } });
  return NextResponse.json({ existing });
}
