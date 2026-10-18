'use client';

import Link from 'next/link';
import { Product } from '@/features/products/types';
import { notify } from '@/lib/notifications';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://res.cloudinary.com/dmohzjxxd/image/upload/v1792344863/planto/products/monstera_deliciosa_transparent.png';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    notify.success(`${product.title} has been added to your collection.`, 'Added to Botanical Bag');
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative glass-panel glass-panel-hover rounded-3xl p-6 pt-14 flex flex-col justify-between transition-all hover:-translate-y-2"
    >
      {/* Floating Plant Visual */}
      <div className="-mt-24 w-full h-56 flex items-center justify-center relative mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={product.title}
          className="max-h-full max-w-[88%] object-contain rounded-xl filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Pet Friendly Badge */}
        {product.isPetFriendly && (
          <span className="absolute top-2 left-0 px-2.5 py-0.5 rounded-full bg-[var(--surface-pill)]/90 backdrop-blur-md border border-[var(--border)] text-[10px] font-semibold text-[var(--accent-lime)] flex items-center gap-1 shadow-sm">
            🐾 Pet Safe
          </span>
        )}

        {/* Stock Pill */}
        <span className="absolute top-2 right-0 px-2.5 py-0.5 rounded-full bg-[var(--surface-pill)]/90 backdrop-blur-md border border-[var(--border)] text-[10px] text-[var(--text-muted)] shadow-sm">
          {product.stock} in stock
        </span>
      </div>

      <div>
        {/* Category & Care Level */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold text-[var(--accent-lime)] uppercase tracking-wider">
            {product.category || 'Houseplants'}
          </span>
          {product.careLevel && (
            <span className="text-[10px] text-[var(--text-muted)] border-l border-[var(--border)] pl-2">
              Care: {product.careLevel}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--accent-lime)] transition-colors">
          {product.title}
        </h3>
        {product.scientificName && (
          <p className="text-xs italic text-[var(--text-muted)] mb-2">
            {product.scientificName}
          </p>
        )}

        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>
      </div>

      {/* Card Footer: Price & Quick Bag Action */}
      <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Price</span>
          <span className="text-lg font-extrabold text-[var(--accent-lime)]">${product.price}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--accent-lime)] group-hover:underline mr-1">
            Details &rarr;
          </span>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-9 h-9 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] hover:border-[var(--accent-lime)] hover:bg-[var(--accent-lime)] hover:text-[var(--on-primary)] text-[var(--text-main)] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Add to cart"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
