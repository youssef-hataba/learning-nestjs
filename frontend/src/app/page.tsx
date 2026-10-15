'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/features/products/api';
import { Product } from '@/features/products/types';

// Curated starter botanical products matching the Biophilic Noir design system
const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-calathea',
    title: 'Calathea Orbifolia',
    description: 'Vibrant patterned leaves that fold in prayer at night, purifying indoor living spaces.',
    price: 359,
    images: ['/plants/calathea.png'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '1', rating: 5, comment: 'Pristine botanical health and packaging.' }],
  },
  {
    id: 'prod-snake',
    title: 'Sansevieria Trifasciata',
    description: 'Architectural snake plant known as the ultimate bedroom nocturnal oxygen producer.',
    price: 359,
    images: ['/plants/snake-plant.png'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '2', rating: 5, comment: 'Thrives effortlessly with minimal light.' }],
  },
  {
    id: 'prod-monstera',
    title: 'Monstera Deliciosa',
    description: 'Iconic Swiss Cheese plant featuring deep glossy fenestrations and lush tropical presence.',
    price: 899,
    images: ['/plants/monstera.png'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '3', rating: 5, comment: 'Massive, healthy leaves.' }],
  },
  {
    id: 'prod-haworthia',
    title: 'Zebra Haworthia Succulent',
    description: 'Compact succulent with striking white architectural ridges, ideal for modern office desks.',
    price: 299,
    images: ['/plants/haworthia.png'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '4', rating: 5, comment: 'Perfect desk companion.' }],
  },
  {
    id: 'prod-ficus',
    title: 'Ficus Elastica Robusta',
    description: 'Bold rubber tree with deep nocturnal burgundy tones and robust air-filtering capacity.',
    price: 499,
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '5', rating: 5, comment: 'Very lush and healthy.' }],
  },
  {
    id: 'prod-spathiphyllum',
    title: 'Peace Lily Sensation',
    description: 'Broad emerald foliage with porcelain-white blooms that eliminate airborne toxics.',
    price: 420,
    images: ['https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ id: '6', rating: 5, comment: 'Blooms continuously.' }],
  },
];

const CATEGORIES = ['All', 'Air Purifying', 'Succulents', 'Floor Plants', 'Desk Botanical'];

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
    <div className="relative w-full overflow-hidden pt-20">
      {/* Ambient Chlorophyll Glows */}
      <div className="absolute top-10 left-1/4 w-[32rem] h-[32rem] bg-[#b6f076]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-80 right-10 w-[30rem] h-[30rem] bg-[#2e4732]/25 rounded-full blur-[160px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-14 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col z-10">
            {/* Status indicator pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a211a] border border-[#b6f076]/30 w-fit mb-6">
              <span className="h-2 w-2 rounded-full bg-[#b6f076] animate-pulse" />
              <span className="text-xs font-medium text-[#f6ffe4] tracking-wide">
                Biophilic Noir Collection
              </span>
              {isBackendConnected && (
                <span className="text-[10px] text-[#c2c9b5]/70 pl-1 border-l border-white/10">
                  NestJS Connected
                </span>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f6ffe4] leading-[1.08] mb-6">
              Breath Natural
            </h1>

            <p className="text-base sm:text-lg text-[#c2c9b5] max-w-xl leading-relaxed mb-10">
              Discover a curated ecosystem of architectural houseplants cultivated for heightened indoor air quality and mindful living sanctuaries.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#top-selling"
                className="px-8 py-3.5 rounded-full bg-[#b6f076] text-[#121812] font-semibold text-sm tracking-wide hover:bg-[#c7f88f] hover:shadow-[0_0_24px_rgba(182,240,118,0.4)] transition-all"
              >
                Explore Catalog
              </a>
              <button
                type="button"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#1a211a]/80 border border-white/10 text-[#f6ffe4] hover:border-[#b6f076]/50 text-sm font-medium transition-all group"
              >
                <span className="w-7 h-7 rounded-full bg-[#b6f076] text-[#121812] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>Live Demo</span>
              </button>
            </div>

            {/* Floating Testimonial Pill */}
            <div className="w-fit max-w-sm p-4 rounded-2xl bg-[#1a211a]/70 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#252c24] border border-[#b6f076]/40 flex items-center justify-center text-xs font-bold text-[#b6f076]">
                  AP
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#f6ffe4]">Alina Patel</div>
                  <div className="flex items-center gap-1 text-[#9be650] text-xs">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#c2c9b5]/80 leading-relaxed">
                "The air purification difference in my home office is palpable. Delivered fresh, healthy, and stunning."
              </p>
            </div>
          </div>

          {/* Right Column: Hero Plant Showcase Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Radial backdrop */}
            <div className="absolute w-72 h-72 bg-[#2e4732]/40 rounded-full blur-3xl pointer-events-none" />

            {/* Frosted Arched Card */}
            <div className="relative z-10 w-full max-w-[340px] rounded-t-[60px] rounded-b-[36px] bg-[#1a211a]/75 backdrop-blur-2xl border border-white/15 p-6 pt-4 flex flex-col items-center shadow-2xl transition-transform hover:-translate-y-1">
              {/* Overhanging Plant */}
              <div className="-mt-16 w-56 h-56 flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/plants/calathea.png"
                  alt="Calathea Plant"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-300"
                />
              </div>

              <span className="text-[11px] font-semibold text-[#c2c9b5]/70 uppercase tracking-widest mt-2">
                Trendy House Plant
              </span>
              <h3 className="text-lg font-bold text-[#f6ffe4] mt-1">Calathea plant</h3>

              <div className="w-full mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#c2c9b5]/70 block">Price</span>
                  <span className="text-base font-bold text-[#b6f076]">Rs. 359/-</span>
                </div>
                <button
                  type="button"
                  className="px-5 py-2 rounded-full bg-[#b6f076] text-[#121812] text-xs font-semibold hover:bg-[#c7f88f] transition-colors shadow-[0_0_12px_rgba(182,240,118,0.25)]"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDY PLANTS BANNER ROW */}
      <section id="trending" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-10">
          <span className="text-sm font-semibold text-[#b6f076] tracking-widest uppercase">
            ◄ Our Trendy plants ►
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#b6f076] font-semibold">
                Air Purifying Desk Plant
              </span>
              <h3 className="text-xl font-bold text-[#f6ffe4]">For Small Desk: O2 Plant</h3>
              <p className="text-xs text-[#c2c9b5] leading-relaxed">
                Oxygen-enriched botanical cultivated specifically for compact home workspaces and study nooks.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-bold text-[#b6f076]">Rs. 599/-</span>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-[#1a211a] border border-[#b6f076]/40 text-[#f6ffe4] hover:bg-[#b6f076] hover:text-[#121812] text-xs font-semibold transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-36 h-36 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/plants/snake-plant.png"
                alt="Snake Plant"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#b6f076] font-semibold">
                Sculptural Botanical
              </span>
              <h3 className="text-xl font-bold text-[#f6ffe4]">Zebra Haworthia Collection</h3>
              <p className="text-xs text-[#c2c9b5] leading-relaxed">
                Hardy succulents with deep chlorophyll foliage and striking white tactile variegation.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-bold text-[#b6f076]">Rs. 499/-</span>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-[#1a211a] border border-[#b6f076]/40 text-[#f6ffe4] hover:bg-[#b6f076] hover:text-[#121812] text-xs font-semibold transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-36 h-36 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/plants/haworthia.png"
                alt="Haworthia"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TOP SELLING PRODUCTS CATALOG */}
      <section id="top-selling" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          {/* Architectural Brackets Title Accent */}
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
              ┌ [ Our Top Selling ] ┘
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f6ffe4] tracking-tight mt-2">
              Curated Botanical Nursery
            </h2>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mt-6">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    type="button"
                    className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#b6f076] text-[#121812] shadow-[0_0_12px_rgba(182,240,118,0.3)]'
                        : 'bg-[#1a211a] text-[#c2c9b5] hover:text-[#f6ffe4] hover:bg-[#252c24] border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search plants, varieties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-[#1a211a] px-4 py-2 pl-9 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/40 focus:border-[#b6f076]/60 focus:outline-none transition-colors"
              />
              <svg
                className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#c2c9b5]/60"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const imageSrc =
              product.images && product.images.length > 0
                ? product.images[0]
                : '/plants/calathea.png';

            return (
              <article
                key={product.id}
                className="group relative glass-panel glass-panel-hover rounded-3xl p-6 pt-12 flex flex-col justify-between"
              >
                {/* Floating Plant Visual */}
                <div className="-mt-20 w-full h-48 flex items-center justify-center relative mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={product.title}
                    className="max-h-full max-w-[85%] object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#f6ffe4] group-hover:text-white transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#c2c9b5]/75 line-clamp-2 leading-relaxed mt-1 mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Card Footer: Price & Quick Bag Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#c2c9b5]/60 uppercase tracking-wider block">Price</span>
                    <span className="text-base font-bold text-[#b6f076]">Rs. {product.price}/-</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#9be650] text-xs">
                      ★ 5.0
                    </div>

                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-[#1a211a] border border-white/10 hover:border-[#b6f076] hover:bg-[#b6f076] hover:text-[#121812] text-[#f6ffe4] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      aria-label="Add to cart"
                    >
                      <svg
                        className="w-4 h-4 fill-none stroke-current"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
            ◄ Customer Review ►
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f6ffe4] mt-2">
            Trusted by Plant Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Maxx Joel',
              avatar: 'MJ',
              text: 'The Calathea arrived impeccably wrapped with zero leaf distress. Transforms the humidity and aura of my living room.',
            },
            {
              name: 'Alina Cherian',
              avatar: 'AC',
              text: 'Biophilic design done right. The ceramics and plant quality are five levels above any ordinary local garden center.',
            },
            {
              name: 'Marc Robinson',
              avatar: 'MR',
              text: 'The nocturnal oxygen Snake Plant made my sleep tracking scores noticeably jump within the very first week.',
            },
          ].map((rev) => (
            <div key={rev.name} className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#252c24] border border-[#b6f076]/40 flex items-center justify-center text-xs font-bold text-[#b6f076]">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#f6ffe4]">{rev.name}</h4>
                  <div className="flex items-center gap-0.5 text-[#9be650] text-xs">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#c2c9b5]/80 leading-relaxed">
                "{rev.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR BEST O2 SECTION */}
      <section id="best-o2" className="mx-auto max-w-7xl px-4 py-16 pb-28 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[36px] p-8 lg:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#b6f076]/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-72 h-72 sm:w-80 sm:h-80 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/plants/monstera.png"
                  alt="Monstera Deliciosa O2"
                  className="w-full h-full object-contain filter drop-shadow-[0_24px_36px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
                ◄ Our Best O2 ►
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f6ffe4] leading-tight">
                We Have Small And Best O2 Plants Collection's
              </h2>
              <p className="text-xs sm:text-sm text-[#c2c9b5] leading-relaxed max-w-xl">
                Curated botanical specimens selected for high carbon absorption and continuous nocturnal oxygen release. Bring balance, calm, and biophilic serenity to your personal living sanctuary.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <a
                  href="#top-selling"
                  className="px-6 py-2.5 rounded-full bg-[#b6f076] text-[#121812] text-xs font-semibold hover:bg-[#c7f88f] transition-all shadow-[0_0_16px_rgba(182,240,118,0.3)]"
                >
                  Explore O2 Plants
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
