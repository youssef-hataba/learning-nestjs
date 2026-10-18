'use client';

import { Product } from '@/features/products/types';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
}

export default function ProductCatalog({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  loading,
}: ProductCatalogProps) {
  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-6">
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-widest text-[#4e7349] font-semibold">
            Plant Collection
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight mt-1.5">
            Curated Indoor Plants
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto mt-2">
            Acclimated ornamental plants backed by our 30-day arrive-alive guarantee.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full mt-5">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  type="button"
                  className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-lime)] text-[var(--on-primary)] font-bold shadow-sm'
                      : 'bg-[var(--surface-pill)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-high)] border border-[var(--border)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, species, category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-pill)] px-4 py-2.5 pl-10 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:border-[var(--accent-lime)] focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-faint)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--accent-lime)]">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-sm font-medium">Syncing botanical specimens...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl">
          <p className="text-base font-semibold text-[var(--text-main)] mb-1">No plants match your search</p>
          <p className="text-xs text-[var(--text-muted)]">Try selecting another category or clear the search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
