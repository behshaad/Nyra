import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/auth/admin-access";
import { researchRoot } from "@/lib/research/adaptive-learning";

export async function GET(request: Request) {
  const denied = await requireAdminApiAccess(request);
  if (denied) return denied;

  try {
    const report = await readFile(path.join(researchRoot, "final_report.md"));
    return new NextResponse(report, {
      headers: {
        "Content-Disposition": 'attachment; filename="adaptive-learning-research-report.md"',
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return NextResponse.json({ error: "Research report was not found." }, { status: 404 });
  }
}
