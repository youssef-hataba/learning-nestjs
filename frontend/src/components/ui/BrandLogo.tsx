'use client';

import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export default function BrandLogo({
  size = 'md',
  showTagline = true,
  href = '/',
  className = '',
}: BrandLogoProps) {
  // Size presets
  const sizeMap = {
    sm: {
      mark: 'w-8 h-8',
      svg: 'w-4 h-4',
      title: 'text-base tracking-[0.12em]',
      tagline: 'text-[7px] tracking-[0.22em]',
      gap: 'gap-2',
    },
    md: {
      mark: 'w-10 h-10',
      svg: 'w-5 h-5',
      title: 'text-xl tracking-[0.15em]',
      tagline: 'text-[8px] tracking-[0.26em]',
      gap: 'gap-2.5',
    },
    lg: {
      mark: 'w-12 h-12',
      svg: 'w-6 h-6',
      title: 'text-2xl tracking-[0.16em]',
      tagline: 'text-[9px] tracking-[0.28em]',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`group inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Botanical Gem Insignia Mark */}
      <div
        className={`relative ${currentSize.mark} rounded-xl bg-gradient-to-b from-[#182618] to-[#0c140c] border border-[#b6f076]/35 flex items-center justify-center shadow-[0_0_16px_rgba(182,240,118,0.18)] group-hover:shadow-[0_0_22px_rgba(182,240,118,0.35)] group-hover:border-[#b6f076]/70 transition-all duration-300 overflow-hidden`}
      >
        {/* Subtle Ambient Back-Glow */}
        <div className="absolute inset-0 bg-radial from-[#b6f076]/25 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Chic Organic Botanical Sprout / Leaf Glyph */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.svg} relative z-10 transition-transform duration-300 group-hover:scale-105`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="plantoPrimaryLeaf" x1="4" y1="28" x2="26" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="60%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#b6f076" />
            </linearGradient>
            <linearGradient id="plantoInnerSprout" x1="16" y1="26" x2="28" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#b6f076" />
            </linearGradient>
            <radialGradient id="plantoGlowDot" cx="16" cy="16" r="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ecfccb" />
              <stop offset="100%" stopColor="#b6f076" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Major Botanical Leaf Curve (Graceful arch forming natural silhouette) */}
          <path
            d="M7 25C7 16 12 7 25 7C25 16 20 25 7 25Z"
            fill="url(#plantoPrimaryLeaf)"
            fillOpacity="0.9"
          />

          {/* Intertwining Biophilic Secondary Sprout (Harmonious living organism) */}
          <path
            d="M13 25C13 18.5 17 12 26 12C26 18.5 22 25 13 25Z"
            fill="url(#plantoInnerSprout)"
            fillOpacity="0.85"
          />

          {/* Central Vital Vein Stem */}
          <path
            d="M7 25C13 22 18 17 25 7"
            stroke="#f7fee7"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Luminous Morning Dewdrop / Living Sprout Node */}
          <circle cx="21" cy="11" r="1.8" fill="#ffffff" />
          <circle cx="21" cy="11" r="3.2" fill="url(#plantoGlowDot)" />
        </svg>
      </div>

      {/* Luxury Typography Wordmark */}
      <div className="flex flex-col select-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold ${currentSize.title} text-[#f6ffe4] group-hover:text-white transition-colors uppercase`}
            style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
          >
            Planto
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#b6f076] shadow-[0_0_6px_#b6f076] group-hover:scale-125 transition-transform" />
        </div>

        {showTagline && (
          <span
            className={`font-semibold ${currentSize.tagline} uppercase text-[#b6f076]/85 group-hover:text-[#b6f076] transition-colors`}
          >
            Botanical Sanctuary
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#b6f076]/50 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
