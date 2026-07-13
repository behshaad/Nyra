export type WorldLevelLabel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type WorldMapPoint = {
  x: number;
  y: number;
};

export const DEBUG_WORLD_LAYOUT = false;

export const WORLD_LAYOUT: Record<WorldLevelLabel, WorldMapPoint> = {
  A1: { x: 57, y: 94 },
  A2: { x: 34, y: 72 },
  B1: { x: 58, y: 57 },
  B2: { x: 57, y: 43 },
  C1: { x: 34, y: 34 },
  C2: { x: 69, y: 18 }
};
