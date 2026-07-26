import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { resolveResearchArtifact } from "@/lib/research/adaptive-learning";

const contentTypes: Record<string, string> = {
  csv: "text/csv; charset=utf-8",
  png: "image/png"
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ group: string; fileName: string }> }
) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;

  const { group, fileName } = await params;
  const artifactPath = resolveResearchArtifact(group, fileName);
  if (!artifactPath) {
    return NextResponse.json({ error: "Research Artifact was not found." }, { status: 404 });
  }

  try {
    const body = await readFile(artifactPath);
    const extension = fileName.split(".").pop() ?? "";
    return new NextResponse(body, {
      headers: {
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return NextResponse.json({ error: "Research Artifact was not found." }, { status: 404 });
  }
}
