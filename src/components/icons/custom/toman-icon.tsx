/**
 * Custom SVG icon: Toman (﷼) currency symbol.
 *
 * Props satisfy `AppIcon` — accepts className, size, color, and all standard
 * SVG attributes, so it is a drop-in replacement anywhere an AppIcon is used.
 */

import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number | string };

export function TomanIcon({ size = 24, width, height, ...props }: Props) {
  const resolvedSize = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? resolvedSize}
      height={height ?? resolvedSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Replace the path below with your actual Toman SVG path */}
      <text x="4" y="18" fontSize="16" fontWeight="bold" stroke="none" fill="currentColor">
        ت
      </text>
    </svg>
  );
}
