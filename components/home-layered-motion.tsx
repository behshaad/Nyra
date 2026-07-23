"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export function HomeLayeredMotion({ children }: { children: ReactNode }) {
  const root = useRef<globalThis.HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        "(min-width: 961px) and (prefers-reduced-motion: no-preference)",
        () => {
          const timeline = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.out" }
          });

          timeline
            .from("[data-home-reveal='copy']", {
              autoAlpha: 0,
              x: -28,
              y: 24
            })
            .from(
              "[data-home-reveal='globe']",
              { autoAlpha: 0, scale: 0.9, y: 32 },
              0.08
            )
            .from(
              "[data-home-reveal='panel']",
              { autoAlpha: 0, rotate: 2, scale: 0.96, x: 32, y: 24 },
              0.18
            )
            .from(
              ".layered-home-hero .feature-card",
              { autoAlpha: 0, y: 22, stagger: 0.08, duration: 0.55 },
              0.42
            );

          const layers = gsap.utils.toArray<globalThis.HTMLElement>("[data-home-depth]");
          const container = root.current;

          if (!container) {
            return;
          }

          const moveLayers = (event: PointerEvent) => {
            const bounds = container.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            layers.forEach((layer) => {
              const depth = Number(layer.dataset.homeDepth ?? 0);
              gsap.to(layer, {
                x: x * depth,
                y: y * depth,
                duration: 0.9,
                ease: "power2.out",
                overwrite: "auto"
              });
            });
          };

          const resetLayers = () => {
            gsap.to(layers, {
              x: 0,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              overwrite: "auto"
            });
          };

          container.addEventListener("pointermove", moveLayers);
          container.addEventListener("pointerleave", resetLayers);

          return () => {
            container.removeEventListener("pointermove", moveLayers);
            container.removeEventListener("pointerleave", resetLayers);
          };
        }
      );

      return () => media.revert();
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
