"use client";

import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export function SparklesPreview() {
  return (
    <section className="sparkles-preview" aria-label="Practice spotlight">
      <h2>practice</h2>
      <div className="sparkles-preview-beam">
        <div className="sparkles-gradient sparkles-gradient-indigo-soft" />
        <div className="sparkles-gradient sparkles-gradient-indigo" />
        <div className="sparkles-gradient sparkles-gradient-sky-soft" />
        <div className="sparkles-gradient sparkles-gradient-sky" />

        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="sparkles-canvas"
          particleColor="#FFFFFF"
        />

        <div className="sparkles-mask" />
      </div>
    </section>
  );
}

export function SparklesPreviewDark() {
  return (
    <section className="sparkles-preview sparkles-preview-dark" aria-label="Build faster spotlight">
      <div className="sparkles-fullscreen-layer">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="sparkles-canvas"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>
      <h2>Build faster</h2>
    </section>
  );
}

export function SparklesPreviewColorful() {
  return (
    <section className="sparkles-preview sparkles-preview-colorful" aria-label="Future spotlight">
      <div className="sparkles-fullscreen-layer">
        <SparklesCore
          id="tsparticlescolorful"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="sparkles-canvas"
          particleColor="#00ff00"
          speed={0.5}
        />
      </div>
      <div className="sparkles-copy">
        <h2>The Future</h2>
        <p>is brighter than you think</p>
      </div>
    </section>
  );
}
