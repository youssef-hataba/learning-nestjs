import Link from 'next/link';
import { Product } from '@/features/products/types';

interface ProductBreadcrumbsProps {
  product: Product;
}

export default function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 text-xs text-[#c2c9b5]/70">
        <Link href="/" className="hover:text-[#b6f076] transition-colors">
          Nursery Catalog
        </Link>
        <span>/</span>
        <span className="text-[#b6f076]">{product.category || 'Houseplants'}</span>
        <span>/</span>
        <span className="text-[#f6ffe4] font-medium truncate">{product.title}</span>
      </div>
    </div>
  );
}
