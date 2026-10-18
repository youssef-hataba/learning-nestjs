import React from 'react';
import Image from 'next/image';

interface BotanicalFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * BotanicalFrame - Elegantly encircles the entire modal dialog with a continuous,
 * seamless botanical vine and leaf garland on all 4 borders and all 4 corners.
 */
export default function BotanicalFrame({
  children,
  className = '',
}: BotanicalFrameProps) {
  return (
    <div className={`relative w-full max-w-lg my-auto ${className}`}>
      {/* ================= 4 CORNERS ================= */}
      {/* Top-Left Corner */}
      <div
        className="absolute -top-6 -left-6 sm:-top-7 sm:-left-7 z-20 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_corner_tl.png"
          alt="Top-Left Foliage Corner"
          fill
          priority
          className="object-contain"
          sizes="96px"
        />
      </div>

      {/* Top-Right Corner */}
      <div
        className="absolute -top-6 -right-6 sm:-top-7 sm:-right-7 z-20 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_corner_tr.png"
          alt="Top-Right Foliage Corner"
          fill
          priority
          className="object-contain"
          sizes="96px"
        />
      </div>

      {/* Bottom-Left Corner */}
      <div
        className="absolute -bottom-6 -left-6 sm:-bottom-7 sm:-left-7 z-20 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_corner_bl.png"
          alt="Bottom-Left Foliage Corner"
          fill
          priority
          className="object-contain"
          sizes="96px"
        />
      </div>

      {/* Bottom-Right Corner */}
      <div
        className="absolute -bottom-6 -right-6 sm:-bottom-7 sm:-right-7 z-20 w-20 sm:w-24 h-20 sm:h-24 pointer-events-none select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_corner_br.png"
          alt="Bottom-Right Foliage Corner"
          fill
          priority
          className="object-contain"
          sizes="96px"
        />
      </div>

      {/* ================= 4 EDGES (CONNECTING BORDERS) ================= */}
      {/* Top Edge Vine */}
      <div
        className="absolute -top-3.5 sm:-top-4.5 left-16 right-16 h-9 sm:h-11 z-20 pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_edge_top.png"
          alt="Top Edge Vine Garland"
          fill
          priority
          className="object-fill"
          sizes="400px"
        />
      </div>

      {/* Bottom Edge Vine */}
      <div
        className="absolute -bottom-3.5 sm:-bottom-4.5 left-16 right-16 h-9 sm:h-11 z-20 pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_edge_bottom.png"
          alt="Bottom Edge Vine Garland"
          fill
          priority
          className="object-fill"
          sizes="400px"
        />
      </div>

      {/* Left Edge Vine */}
      <div
        className="absolute top-16 bottom-16 -left-3.5 sm:-left-4.5 w-9 sm:w-11 z-20 pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_edge_left.png"
          alt="Left Edge Vine Garland"
          fill
          priority
          className="object-fill"
          sizes="44px"
        />
      </div>

      {/* Right Edge Vine */}
      <div
        className="absolute top-16 bottom-16 -right-3.5 sm:-right-4.5 w-9 sm:w-11 z-20 pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
        aria-hidden="true"
      >
        <Image
          src="/frame_edge_right.png"
          alt="Right Edge Vine Garland"
          fill
          priority
          className="object-fill"
          sizes="44px"
        />
      </div>

      {/* Main Wrapped Child Content (Modal Card) */}
      {children}
    </div>
  );
}
