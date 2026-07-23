"use client";

import { Globe2 } from "lucide-react";
import { GlobeLabels } from "@/components/ui/cobe-globe-labels";

export function HomeGlobeShowcase({ layered = false }: { layered?: boolean }) {
  return (
    <section
      className={`home-globe-showcase${layered ? " home-globe-showcase--layered" : ""}`}
      aria-label="Global learning preview"
    >
      <div className="home-globe-stage">
        <GlobeLabels />
      </div>
      <div className="home-globe-copy">
        <span className="globe-kicker">
          Global practice
          <Globe2 size={16} />
        </span>
        <p>Spin through the places language can take you while Nyra keeps the next step clear.</p>
      </div>
    </section>
  );
}
