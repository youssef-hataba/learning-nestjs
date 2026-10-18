import React from 'react';
import Image from 'next/image';

interface VerticalLeafOrnamentProps {
  side?: 'left' | 'right';
  className?: string;
  top?: string;
  height?: number;
  width?: number;
  opacity?: string;
}

/**
 * VerticalLeafOrnament - Elegant vertical botanical vine garland
 * Derived from the section leaf divider for natural side decoration.
 */
export default function VerticalLeafOrnament({
  side = 'left',
  className = '',
  top = 'top-12',
  height = 540,
  width = 64,
  opacity = 'opacity-70',
}: VerticalLeafOrnamentProps) {
  const sideClasses =
    side === 'left'
      ? '-left-2 sm:left-1 lg:left-3 xl:left-6'
      : '-right-2 sm:right-1 lg:right-3 xl:right-6 -scale-x-100';

  return (
    <div
      className={`absolute ${top} ${sideClasses} z-10 pointer-events-none select-none ${opacity} transition-opacity duration-300 ${className}`}
      aria-hidden="true"
    >
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        <Image
          src="/leaf_border_vertical.png"
          alt="Botanical Vine Decoration"
          fill
          className="object-contain object-top drop-shadow-[0_4px_12px_rgba(32,49,35,0.08)]"
          sizes={`${width}px`}
        />
      </div>
    </div>
  );
}
