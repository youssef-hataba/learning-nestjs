'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/features/products/api';
import { Product } from '@/features/products/types';

// Curated starter products for immediate visual preview
const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Minimalist Chrono Watch',
    description: 'Matte black 38mm dial with cream hands and vegetable-tanned leather strap.',
    price: 185,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '1', rating: 5, comment: 'Flawless design.' }],
  },
  {
    id: 'prod-2',
    title: 'Heavyweight Studio Tee',
    description: '300gsm organic combed cotton in vintage washed black with tailored fit.',
    price: 48,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '2', rating: 5, comment: 'Best heavyweight fabric.' }],
  },
  {
    id: 'prod-3',
    title: 'Leather Zip Portfolio',
    description: 'Hand-burnished Italian calfskin with solid brass cream-toned hardware.',
    price: 140,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '3', rating: 4, comment: 'Very durable.' }],
  },
  {
    id: 'prod-4',
    title: 'Ceramic Pour-Over Dripper',
    description: 'Handcrafted stoneware finished in raw cream glaze and dark charcoal base.',
    price: 36,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '4', rating: 5, comment: 'Daily ritual favorite.' }],
  },
  {
    id: 'prod-5',
    title: 'Canvas Weekender Duffle',
    description: '18oz waxed black canvas with cream nylon webbing and waterproof lining.',
    price: 210,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '5', rating: 5, comment: 'Perfect flight bag.' }],
  },
  {
    id: 'prod-6',
    title: 'Over-Ear Wireless Headphones',
    description: 'Custom acoustic tuning with dark anodized aluminum and memory foam cups.',
    price: 260,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '6', rating: 4, comment: 'Clean soundstage.' }],
  },
];

const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Living', 'Audio'];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_DEMO_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const backendProducts = await fetchProducts();
        if (backendProducts && backendProducts.length > 0) {
          setProducts(backendProducts);
          setIsBackendConnected(true);
        } else {
          // Connected but empty or fallback
          setIsBackendConnected(true);
        }
      } catch {
        setIsBackendConnected(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Compact Header / Hero - No giant fonts, simple & balanced */}
      <section className="mb-6 rounded-lg border border-[#21252b] bg-[#121518] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block text-[11px] font-medium uppercase tracking-wider text-[#d8d0c2] bg-[#1b1f24] px-2 py-0.5 rounded border border-[#282d36]">
                Autumn 2026 Edition
              </span>
              {isBackendConnected !== null && (
                <span className="text-[11px] text-[#8e877c]">
                  {isBackendConnected ? '• NestJS Connected' : '• Offline Preview'}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#f5f0e6]">
              Simple, Crafted Essentials
            </h1>
            <p className="mt-1 max-w-xl text-xs text-[#9c9487] leading-relaxed">
              Carefully designed everyday objects built with honest materials. Connected directly to your NestJS REST backend.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-[#f5f0e6] text-[#0d0f11] hover:bg-[#e7ded1] transition-colors"
            >
              Account Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Control Bar: Categories & Search */}
      <section className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#f5f0e6] text-[#0d0f11]'
                    : 'bg-[#14171a] text-[#a39b8e] hover:text-[#f5f0e6] hover:bg-[#1b1f24] border border-[#21252b]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Compact Search Input */}
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#21252b] bg-[#121518] px-3 py-1.5 pl-8 text-xs text-[#f5f0e6] placeholder-[#6e685f] focus:border-[#d8d0c2] focus:outline-none transition-colors"
          />
          <svg
            className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#6e685f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </section>

      {/* Product Grid - Compact cards with balanced spacing */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const imageSrc =
            product.images && product.images.length > 0
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

          return (
            <article
              key={product.id}
              className="group flex flex-col justify-between rounded-lg border border-[#21252b] bg-[#121518] hover:border-[#343a44] transition-all p-3.5"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-[#090a0c] mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={product.title}
                    className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 right-2 rounded bg-[#0d0f11]/80 backdrop-blur-xs px-2 py-0.5 text-[11px] font-semibold text-[#f5f0e6] border border-[#2b3038]">
                    ${product.price}
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-[#f5f0e6] group-hover:text-white transition-colors">
                    {product.title}
                  </h3>
                </div>

                <p className="text-xs text-[#9c9487] line-clamp-2 leading-relaxed mb-3">
                  {product.description}
                </p>
              </div>

              {/* Bottom Card Row */}
              <div className="pt-2 border-t border-[#1c2026] flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-[#a69e92]">
                  <svg className="w-3 h-3 text-[#d8d0c2]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>5.0</span>
                  <span className="text-[#5a554e]">({product.reviews?.length || 1})</span>
                </div>

                <button
                  type="button"
                  className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#1c2026] text-[#f5f0e6] hover:bg-[#f5f0e6] hover:text-[#0d0f11] border border-[#2a2f38] transition-all cursor-pointer"
                >
                  Add to cart
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
