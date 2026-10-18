import React from 'react';
import { IconProps } from './types';

/**
 * PlantCareSunIcon - Calming morning sun with radiating photosynthesis rays
 */
export default function PlantCareSunIcon({
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
      <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 2.5V4.5" />
      <path d="M12 19.5V21.5" />
      <path d="M4.5 12H2.5" />
      <path d="M21.5 12H19.5" />
      <path d="M18.7 5.3L17.3 6.7" />
      <path d="M6.7 17.3L5.3 18.7" />
      <path d="M5.3 5.3L6.7 6.7" />
      <path d="M17.3 17.3L18.7 18.7" />
    </svg>
  );
}
