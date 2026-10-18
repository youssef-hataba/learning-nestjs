import React from 'react';
import { IconProps } from './types';

/**
 * BotanicalCartIcon - Luxury Biophilic Planter Tote / Harvest Basket
 * An eye-friendly, artisan-crafted icon designed specifically for a boutique plant sanctuary.
 * Features a soft canvas gardening tote with an emerging Monstera/Philodendron leaf.
 */
export default function BotanicalCartIcon({
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
      {/* Tender Living Botanical Leaf nestled inside the tote */}
      <path
        d="M12.5 10C12.5 5.5 16 4 17.5 5.2C18.8 6.5 17.5 9.5 13.5 10.2"
        fill="currentColor"
        fillOpacity="0.22"
        strokeWidth="1.3"
      />
      {/* Delicate Leaf Central Stem & Vein */}
      <path d="M13.2 9.5C14.2 7.8 16 6.8 17.5 5.2" strokeWidth="1.1" />

      {/* Gentle Arching Vine / Bamboo Tote Handles */}
      <path
        d="M8.2 10.5V6.8C8.2 5 9.8 3.5 11.8 3.5C13.8 3.5 15.4 5 15.4 6.8V10.5"
        strokeWidth={strokeWidth}
      />

      {/* Soft Artisan Canvas / Woven Planter Tote Body */}
      <path
        d="M4.5 10.5H19.5L18.2 18.2C18 19.8 16.6 21 15 21H9C7.4 21 6 19.8 5.8 18.2L4.5 10.5Z"
        strokeWidth={strokeWidth}
      />

      {/* Organic Center Pleat Contour (Gives depth and handcrafted warmth) */}
      <path
        d="M10 14.5C10.5 16.2 11.5 17 12 17C12.5 17 13.5 16.2 14 14.5"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
    </svg>
  );
}
