import Image from 'next/image';

interface FloatingLeavesProps {
  variant?: 'hero' | 'section';
}

export default function FloatingLeaves({ variant = 'hero' }: FloatingLeavesProps) {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-75">
        {/* Leaf 1 - Subtle soft float */}
        <div className="absolute top-16 left-6 lg:left-14 w-11 h-18 opacity-18 rotate-[-25deg] animate-sway">
          <Image
            src="/leaves/leaf_1.png"
            alt="Organic leaf"
            fill
            className="object-contain"
          />
        </div>

        {/* Leaf 2 - Top Center-Left */}
        <div className="absolute top-36 left-1/3 w-9 h-15 opacity-12 rotate-[35deg] animate-sway-delayed">
          <Image
            src="/leaves/leaf_2.png"
            alt="Organic leaf"
            fill
            className="object-contain"
          />
        </div>

        {/* Leaf 3 - Mid Right near plant */}
        <div className="absolute top-28 right-8 lg:right-16 w-10 h-16 opacity-18 rotate-[15deg] animate-sway-slow">
          <Image
            src="/leaves/leaf_3.png"
            alt="Organic leaf"
            fill
            className="object-contain"
          />
        </div>

        {/* Leaf 4 - Center Right */}
        <div className="absolute top-96 right-4 lg:right-12 w-12 h-20 opacity-15 rotate-[-40deg] animate-sway">
          <Image
            src="/leaves/leaf_4.png"
            alt="Organic leaf"
            fill
            className="object-contain"
          />
        </div>

        {/* Leaf 5 - Lower Left */}
        <div className="absolute bottom-40 left-10 lg:left-24 w-11 h-18 opacity-14 rotate-[-15deg] animate-sway-delayed">
          <Image
            src="/leaves/leaf_5.png"
            alt="Organic leaf"
            fill
            className="object-contain"
          />
        </div>

        {/* Leaf 6 - Bottom Center-Right near stats */}
        <div className="absolute bottom-16 right-1/4 w-9 h-15 opacity-12 rotate-[50deg] animate-sway-slow">
          <Image
            src="/leaves/leaf_6.png"
            alt="Organic leaf"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  // Section variant: delicate accents on the left & right borders
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="absolute top-1/4 -left-4 w-12 h-20 opacity-30 rotate-[20deg] animate-sway">
        <Image
          src="/leaves/leaf_1.png"
          alt="Organic leaf accent"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute top-2/3 -right-4 w-12 h-20 opacity-30 rotate-[-30deg] animate-sway-delayed">
        <Image
          src="/leaves/leaf_6.png"
          alt="Organic leaf accent"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
