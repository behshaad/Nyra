import clsx from "clsx";
import type { CSSProperties } from "react";

type CircleProgressProps = {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  counterClockwise?: boolean;
  disableAnimation?: boolean;
  getColor?: (progressPercent: number) => string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CircleProgress({
  value,
  maxValue,
  size = 80,
  strokeWidth = 5,
  className,
  counterClockwise = false,
  disableAnimation = false,
  getColor
}: CircleProgressProps) {
  const safeMax = Math.max(maxValue, 1);
  const progressPercent = clamp((value / safeMax) * 100, 0, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
  const progressClassName = getColor?.(progressPercent);

  return (
    <svg
      aria-hidden="true"
      className={clsx("circle-progress", className)}
      height={size}
      style={
        {
          "--circle-progress-size": `${size}px`,
          "--circle-progress-stroke-offset": strokeDashoffset,
          "--circle-progress-circumference": circumference,
          "--circle-progress-direction": counterClockwise ? "scaleX(-1)" : "none"
        } as CSSProperties
      }
      viewBox={`0 0 ${size} ${size}`}
      width={size}
    >
      <circle
        className="circle-progress-track"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className={clsx("circle-progress-value", progressClassName)}
        cx={size / 2}
        cy={size / 2}
        data-disable-animation={disableAnimation ? "true" : undefined}
        fill="none"
        r={radius}
        strokeDasharray={circumference}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
