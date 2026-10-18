import Link from 'next/link';
import { Product } from '@/features/products/types';

interface ProductBreadcrumbsProps {
  product: Product;
}

export default function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--accent-lime)] transition-colors">
          Nursery Catalog
        </Link>
        <span>/</span>
        <span className="text-[var(--accent-lime)] font-medium">{product.category || 'Houseplants'}</span>
        <span>/</span>
        <span className="text-[var(--text-main)] font-semibold truncate">{product.title}</span>
      </div>
    </div>
  );
}
