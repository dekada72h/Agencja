"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  width?: number;
  height?: number;
  cr?: number;
  className?: string;
  glow?: boolean;
};

/**
 * SVG Dot pattern background. Use as absolute fill behind hero or section.
 * Apply mask via className (e.g. radial-gradient mask) for soft edges.
 */
export function DotPattern({
  width = 24,
  height = 24,
  cr = 1.2,
  className,
  glow = false,
}: Props) {
  const id = useId();
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-gray-300/60",
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          x={0}
          y={0}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={width / 2} cy={height / 2} r={cr} fill="currentColor" />
          {glow && (
            <circle
              cx={width / 2}
              cy={height / 2}
              r={cr * 2.5}
              fill="currentColor"
              opacity={0.25}
            />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
