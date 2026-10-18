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
    <section id="top-selling" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-12">
        {/* Architectural Brackets Title Accent */}
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
            ┌ [ Living Botanical Nursery ] ┘
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#f6ffe4] tracking-tight mt-2">
            Curated Indoor Ecosystem
          </h2>
          <p className="text-sm text-[#c2c9b5] max-w-xl mx-auto mt-3">
            Explore our 10 nursery specimens. Every plant is pre-conditioned for indoor microclimates and backed by a 30-day health guarantee.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full mt-8">
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
                      ? 'bg-[#b6f076] text-[#121812] font-bold shadow-[0_0_12px_rgba(182,240,118,0.3)]'
                      : 'bg-[#1a211a] text-[#c2c9b5] hover:text-[#f6ffe4] hover:bg-[#252c24] border border-white/5'
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
              className="w-full rounded-full border border-white/10 bg-[#1a211a] px-4 py-2.5 pl-10 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/40 focus:border-[#b6f076]/60 focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-[#c2c9b5]/60"
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
        <div className="flex items-center justify-center py-20 text-[#b6f076]">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-sm font-medium">Syncing botanical specimens...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl">
          <p className="text-base font-semibold text-[#f6ffe4] mb-1">No plants match your search</p>
          <p className="text-xs text-[#c2c9b5]">Try selecting another category or clear the search query.</p>
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
