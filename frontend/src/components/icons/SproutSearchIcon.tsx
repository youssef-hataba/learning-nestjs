import React from 'react';
import { IconProps } from './types';

/**
 * SproutSearchIcon - Minimalist Botanical Inspection Loupe
 * Features a circular optical ring with a living sprout stem handle.
 */
export default function SproutSearchIcon({
  size = 24,
  strokeWidth = 1.7,
  className = '',
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      {...props}
    >
      {/* Loupe Optical Lens Ring */}
      <circle cx="10.5" cy="10.5" r="6.5" strokeWidth={strokeWidth} />

      {/* Gentle Morning Dew Lens Reflection Sparkle */}
      <path
        d="M8.5 7.5A4 4 0 0 1 12.5 7.5"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />

      {/* Natural Organic Stem Handle */}
      <path d="M15.5 15.5L20.5 20.5" strokeWidth={strokeWidth} />

      {/* Tender Leaf Bud branching gracefully off the handle tip */}
      <path
        d="M17.5 17.5C18 15.5 20.2 15.2 21 16.5C21.2 18 19.5 19 17.5 17.5Z"
        fill="currentColor"
        fillOpacity="0.22"
        strokeWidth="1.2"
      />
    </svg>
  );
}
