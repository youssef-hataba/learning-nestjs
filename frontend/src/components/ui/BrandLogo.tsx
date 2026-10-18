'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export default function BrandLogo({
  size = 'md',
  href = '/',
  className = '',
}: BrandLogoProps) {
  const sizeMap = {
    sm: 'h-9 sm:h-10 w-auto',
    md: 'h-12 sm:h-14 w-auto',
    lg: 'h-14 sm:h-16 w-auto',
    xl: 'h-16 sm:h-20 w-auto',
  };

  const content = (
    <div className={`inline-flex items-center select-none bg-transparent ${className}`}>
      <Image
        src="/planto_green_v2.png"
        alt="Planto"
        width={260}
        height={126}
        priority
        className={`${sizeMap[size] || sizeMap.md} object-contain drop-shadow-xs transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#4e7349]/50 rounded-lg bg-transparent"
      >
        {content}
      </Link>
    );
  }

  return content;
}
