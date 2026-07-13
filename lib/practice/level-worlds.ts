import type { PracticeJourneyWorldTone } from "@/lib/practice/journey";

export type LevelWorldConfig = {
  label: string;
  title: string;
  region: string;
  backgroundImage: string;
  tone: PracticeJourneyWorldTone;
  artworkAspectRatio?: string;
  nodeLayout?: "embedded-path" | "generated-path";
};

const levelWorlds: Record<string, LevelWorldConfig> = {
  A1: {
    label: "A1",
    title: "A1 World",
    region: "Dorfleben",
    backgroundImage: "/practice/germany-journey-map.png",
    tone: "village",
    artworkAspectRatio: "768 / 1376",
    nodeLayout: "embedded-path"
  },
  A2: {
    label: "A2",
    title: "A2 World",
    region: "Kleinstadt",
    backgroundImage: "/practice/worlds/a1-world.png",
    tone: "town"
  },
  B1: {
    label: "B1",
    title: "B1 World",
    region: "Grossstadt",
    backgroundImage: "/practice/worlds/a1-world.png",
    tone: "city"
  },
  B2: {
    label: "B2",
    title: "B2 World",
    region: "Die Burg",
    backgroundImage: "/practice/worlds/a1-world.png",
    tone: "castle"
  },
  C1: {
    label: "C1",
    title: "C1 World",
    region: "Bergstadt",
    backgroundImage: "/practice/worlds/a1-world.png",
    tone: "mountain"
  },
  C2: {
    label: "C2",
    title: "C2 World",
    region: "Die Akademie",
    backgroundImage: "/practice/worlds/a1-world.png",
    tone: "academy"
  }
};

export function getLevelWorldConfig(levelLabel: string) {
  return levelWorlds[levelLabel.toUpperCase()] ?? null;
}
