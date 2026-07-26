import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getAdaptiveLearningResearch,
  resolveResearchArtifact
} from "@/lib/research/adaptive-learning";

describe("Adaptive Learning Research artifacts", () => {
  it("loads the latest portable research snapshot", async () => {
    const research = await getAdaptiveLearningResearch();

    expect(research.manifest).toMatchObject({
      seed: 42,
      learners: 100,
      report: "outputs/final_report.md"
    });
    expect(research.figures).toContain("learning_trend.png");
    expect(research.tables.classification_results.length).toBeGreaterThan(0);
  });

  it("resolves allowlisted artifacts inside the research root", () => {
    expect(resolveResearchArtifact("tables", "classification_results.csv"))
      .toMatch(/outputs\/tables\/classification_results\.csv$/);
    expect(resolveResearchArtifact("figures", "learning_trend.png"))
      .toMatch(/outputs\/figures\/learning_trend\.png$/);
  });

  it("rejects traversal, unknown groups, and unsupported extensions", () => {
    expect(resolveResearchArtifact("tables", "../manifest.json")).toBeNull();
    expect(resolveResearchArtifact("unknown", "learners.csv")).toBeNull();
    expect(resolveResearchArtifact("figures", "manifest.json")).toBeNull();
  });
});
