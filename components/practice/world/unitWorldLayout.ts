export type UnitWorldLabel =
  | "Lesson1"
  | "Lesson2"
  | "Lesson3"
  | "Lesson4"
  | "Lesson5"
  | "Lesson6"
  | "Lesson7"
  | "Lesson8"
  | "Lesson9"
  | "Lesson10"
  | "Lesson11"
  | "Lesson12";

export type UnitWorldPoint = {
  x: number;
  y: number;
};

export const DEBUG_WORLD_LAYOUT = false;

export const UNIT_WORLD_LAYOUT: Record<UnitWorldLabel, UnitWorldPoint> = {
  Lesson1: { x: 57, y: 94 },
  Lesson2: { x: 38, y: 84 },
  Lesson3: { x: 62, y: 76 },
  Lesson4: { x: 42, y: 68 },
  Lesson5: { x: 67, y: 60 },
  Lesson6: { x: 48, y: 53 },
  Lesson7: { x: 72, y: 46 },
  Lesson8: { x: 50, y: 39 },
  Lesson9: { x: 69, y: 32 },
  Lesson10: { x: 44, y: 25 },
  Lesson11: { x: 63, y: 18 },
  Lesson12: { x: 78, y: 12 }
};
