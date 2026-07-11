export type WorldLevelLabel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type WorldMapPoint = {
  x: number;
  y: number;
};

export const DEBUG_WORLD_LAYOUT = false;

export const WORLD_LAYOUT: Record<WorldLevelLabel, WorldMapPoint> = {
  A1: { x: 47, y: 64 },
  A2: { x: 34, y: 52 },
  B1: { x: 61, y: 43 },
  B2: { x: 38, y: 33 },
  C1: { x: 62, y: 26 },
  C2: { x: 50, y: 14 }
};
