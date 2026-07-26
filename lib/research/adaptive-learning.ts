import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type ResearchRow = Record<string, string | number>;

export type ResearchManifest = {
  seed: number;
  learners: number;
  interactions: number;
  report: string;
  data_dir: string;
  table_dir: string;
  figure_dir: string;
};

export type AdaptiveLearningResearch = {
  manifest: ResearchManifest;
  reportMarkdown: string;
  figures: string[];
  tables: Record<string, ResearchRow[]>;
};

export const researchRoot = path.join(
  process.cwd(),
  "research",
  "adaptive_learning",
  "outputs"
);

export const researchArtifactGroups = ["data", "figures", "tables"] as const;

function parseCsv(source: string): ResearchRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers = [], ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(
      headers.map((header, index) => {
        const raw = record[index] ?? "";
        const numeric = raw !== "" && Number.isFinite(Number(raw)) ? Number(raw) : raw;
        return [header, numeric];
      })
    )
  );
}

async function readTable(fileName: string) {
  return parseCsv(
    await readFile(path.join(researchRoot, "tables", fileName), "utf8")
  );
}

export async function getAdaptiveLearningResearch(): Promise<AdaptiveLearningResearch> {
  const [manifestSource, reportMarkdown, figures, tableFiles] = await Promise.all([
    readFile(path.join(researchRoot, "manifest.json"), "utf8"),
    readFile(path.join(researchRoot, "final_report.md"), "utf8"),
    readdir(path.join(researchRoot, "figures")),
    readdir(path.join(researchRoot, "tables"))
  ]);
  const tableEntries = await Promise.all(
    tableFiles
      .filter((fileName) => fileName.endsWith(".csv"))
      .map(async (fileName) => [
        fileName.replace(/\.csv$/, ""),
        await readTable(fileName)
      ] as const)
  );

  return {
    manifest: JSON.parse(manifestSource) as ResearchManifest,
    reportMarkdown,
    figures: figures.filter((fileName) => fileName.endsWith(".png")).sort(),
    tables: Object.fromEntries(tableEntries)
  };
}

export function resolveResearchArtifact(group: string, fileName: string) {
  if (
    !researchArtifactGroups.includes(group as (typeof researchArtifactGroups)[number]) ||
    path.basename(fileName) !== fileName
  ) {
    return null;
  }

  const allowedExtensions = {
    data: [".csv"],
    figures: [".png"],
    tables: [".csv"]
  } as const;
  const extension = path.extname(fileName).toLowerCase();
  if (!allowedExtensions[group as keyof typeof allowedExtensions].includes(extension as never)) {
    return null;
  }

  return path.join(researchRoot, group, fileName);
}
