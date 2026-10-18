import React from 'react';
import { IconProps } from './types';

/**
 * DewdropHeartIcon - Biophilic Wishlist Heart
 * Formed by two graceful living leaves curling toward each other with a morning dewdrop.
 */
export default function DewdropHeartIcon({
  size = 24,
  strokeWidth = 1.7,
  filled = false,
  className = '',
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      {...props}
    >
      {/* Biophilic Heart Contour formed by two organic botanical leaves */}
      <path
        d="M12 20.5C12 20.5 4 15.5 4 9.5C4 6.5 6.5 4.5 9.5 4.5C11.2 4.5 12 5.5 12 5.5C12 5.5 12.8 4.5 14.5 4.5C17.5 4.5 20 6.5 20 9.5C20 15.5 12 20.5 12 20.5Z"
        fill={filled ? 'currentColor' : 'none'}
      />

      {/* Gentle Botanical Leaf Vein arching inside */}
      {!filled && (
        <>
          <path
            d="M12 8.5C11.5 11.5 9.5 14 7.5 15"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
          <circle cx="12" cy="5.8" r="0.8" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
