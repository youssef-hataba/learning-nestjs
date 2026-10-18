import Image from 'next/image';

interface LeafDividerProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function LeafDivider({
  className = '',
  width = 180,
  height = 46,
}: LeafDividerProps) {
  return (
    <div className={`flex items-center justify-center py-2 select-none pointer-events-none opacity-75 ${className}`}>
      <div className="flex items-center gap-4 w-full max-w-lg px-4">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#A8C3A0]/40 to-[#A8C3A0]/60" />
        <div className="relative shrink-0">
          <Image
            src="/leaf_divider.png"
            alt="Botanical Divider"
            width={width}
            height={height}
            className="object-contain w-auto h-auto"
          />
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#A8C3A0]/40 to-[#A8C3A0]/60" />
      </div>
    </div>
  );
}
