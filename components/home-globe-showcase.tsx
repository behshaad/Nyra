"use client";

import { Globe2 } from "lucide-react";
import { GlobeLabels } from "@/components/ui/cobe-globe-labels";

export function HomeGlobeShowcase() {
  return (
    <div className="home-globe-showcase" aria-label="Global learning preview">
      <div className="home-globe-copy">
        <span className="globe-kicker">
          <Globe2 size={16} />
          Global practice
        </span>
        <p>Spin through the places language can take you while Nyra keeps the next step clear.</p>
      </div>
      <div className="home-globe-stage">
        <GlobeLabels />
      </div>
    </div>
  );
}
