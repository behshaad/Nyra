"use client";

import { Globe2 } from "lucide-react";
import { GlobeLabels } from "@/components/ui/cobe-globe-labels";

export function HomeGlobeShowcase({
  ariaLabel,
  body,
  direction,
  kicker
}: {
  ariaLabel: string;
  body: string;
  direction: "rtl" | "ltr";
  kicker: string;
}) {
  return (
    <section className="home-globe-showcase" aria-label={ariaLabel} dir={direction}>
      <div className="home-globe-stage">
        <GlobeLabels />
      </div>
      <div className="home-globe-copy">
        <span className="globe-kicker">
          {kicker}
          <Globe2 size={16} />
        </span>
        <p>{body}</p>
      </div>
    </section>
  );
}
