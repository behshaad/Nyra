"use client";

import { useEffect, useRef } from "react";

interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  drift: number;
  twinkle: number;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function SparklesCore({
  id,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  className = "",
  particleColor = "#FFFFFF",
  speed = 1
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const targetCanvas = canvas;
    const targetContext = context;
    const media = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    function resize() {
      const rect = targetCanvas.getBoundingClientRect();
      const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      targetCanvas.width = Math.floor(width * pixelRatio);
      targetCanvas.height = Math.floor(height * pixelRatio);
      targetContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.max(12, Math.floor((width * height * particleDensity) / 160000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: randomBetween(minSize, maxSize),
        alpha: randomBetween(0.24, 0.92),
        drift: randomBetween(-0.18, 0.18) * speed,
        twinkle: randomBetween(0.006, 0.018) * speed
      }));
    }

    function draw() {
      targetContext.clearRect(0, 0, width, height);
      targetContext.fillStyle = background;
      if (background !== "transparent") {
        targetContext.fillRect(0, 0, width, height);
      }

      for (const particle of particles) {
        particle.alpha += particle.twinkle;
        if (particle.alpha > 0.95 || particle.alpha < 0.18) {
          particle.twinkle *= -1;
        }

        if (!media.matches) {
          particle.x += particle.drift;
          particle.y -= 0.04 * speed;
        }

        if (particle.x < -4) particle.x = width + 4;
        if (particle.x > width + 4) particle.x = -4;
        if (particle.y < -4) particle.y = height + 4;

        targetContext.globalAlpha = particle.alpha;
        targetContext.fillStyle = particleColor;
        targetContext.beginPath();
        targetContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        targetContext.fill();
      }

      targetContext.globalAlpha = 1;
      animationFrame = globalThis.requestAnimationFrame(draw);
    }

    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(targetCanvas);

    return () => {
      resizeObserver.disconnect();
      globalThis.cancelAnimationFrame(animationFrame);
    };
  }, [background, maxSize, minSize, particleColor, particleDensity, speed]);

  return <canvas aria-hidden="true" className={className} id={id} ref={canvasRef} />;
}
