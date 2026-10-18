'use client';

import { Product } from '@/features/products/types';

interface ProductBuyBoxProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  selectedPlanter: 'alabaster' | 'slate' | 'terracotta';
  onSelectPlanter: (planter: 'alabaster' | 'slate' | 'terracotta') => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductBuyBox({
  product,
  quantity,
  onQuantityChange,
  selectedPlanter,
  onSelectPlanter,
  onAddToCart,
  onBuyNow,
}: ProductBuyBoxProps) {
  // Format light level indicator
  const getLightBars = () => {
    switch (product.lightRequirement) {
      case 'DIRECT_SUN':
        return { text: 'Direct Sun', level: 3, icon: '☀️☀️☀️' };
      case 'LOW_LIGHT':
        return { text: 'Low / Shade', level: 1, icon: '⛅' };
      case 'INDIRECT_BRIGHT':
      default:
        return { text: 'Bright Indirect', level: 2, icon: '☀️⛅' };
    }
  };

  // Format watering indicator
  const getWaterDrops = () => {
    switch (product.wateringFrequency) {
      case 'LOW':
        return { text: 'Every 2-3 Wks', desc: 'Drought Hardy' };
      case 'HIGH':
        return { text: '2x Weekly', desc: 'Moist Soil' };
      case 'MODERATE':
      default:
        return { text: 'Every 7-10 Days', desc: 'When Top Dry' };
    }
  };

  const lightInfo = getLightBars();
  const waterInfo = getWaterDrops();

  return (
    <div className="flex flex-col">
      {/* Category & Botanical Species Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#b6f076] bg-[#b6f076]/10 px-2.5 py-0.5 rounded-full border border-[#b6f076]/20">
            {product.category || 'Curated Specimen'}
          </span>
          <span className="text-xs text-[#c2c9b5]/60 font-mono">
            {product.placement || 'INDOOR'}
          </span>
        </div>

        {/* Real-time stock urgency */}
        {product.stock > 0 ? (
          <span className="text-[11px] font-semibold text-[#b6f076] flex items-center gap-1.5 bg-[#121812] px-2.5 py-1 rounded-full border border-[#b6f076]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b6f076] animate-ping" />
            {product.stock} Available in Nursery
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            Out of Stock
          </span>
        )}
      </div>

      {/* Main Title & Latin Scientific Binomial */}
      <h1 className="text-3xl sm:text-5xl font-black text-[#f6ffe4] tracking-tight leading-tight">
        {product.title}
      </h1>
      {product.scientificName && (
        <p className="text-sm sm:text-base italic text-[#b6f076]/80 font-serif mt-1 mb-4">
          {product.scientificName}
        </p>
      )}

      {/* Social Proof & Nursery Review Badge */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-1 text-[#9be650] text-sm">
          {'★'.repeat(5)}
        </div>
        <span className="text-xs font-bold text-[#f6ffe4]">5.0</span>
        <span className="text-xs text-[#c2c9b5]/60">
          ({product.reviews?.length || 24} Verified Botanists)
        </span>
        <span className="text-xs text-[#b6f076] font-medium border-l border-white/15 pl-3">
          100% Acclimated Greenhouse Grown
        </span>
      </div>

      {/* VITAL PLANT METRICS BAR (Scannable, Visual, Right in Buy Box!) */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#141b14] border border-[#b6f076]/20 mb-6 shadow-inner">
        {/* Light */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#1a211a]/80">
          <span className="text-base mb-0.5">☀️</span>
          <span className="text-[10px] uppercase font-bold text-[#c2c9b5]/70">Light</span>
          <span className="text-xs font-bold text-[#f6ffe4] mt-0.5">{lightInfo.text}</span>
        </div>

        {/* Water */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#1a211a]/80">
          <span className="text-base mb-0.5">💧</span>
          <span className="text-[10px] uppercase font-bold text-[#c2c9b5]/70">Water</span>
          <span className="text-xs font-bold text-[#f6ffe4] mt-0.5">{waterInfo.text}</span>
        </div>

        {/* Pet Safety */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#1a211a]/80">
          <span className="text-base mb-0.5">{product.isPetFriendly ? '🐾' : '⚠️'}</span>
          <span className="text-[10px] uppercase font-bold text-[#c2c9b5]/70">Pets</span>
          <span className={`text-xs font-bold mt-0.5 ${product.isPetFriendly ? 'text-[#b6f076]' : 'text-amber-300'}`}>
            {product.isPetFriendly ? 'Safe & Friendly' : 'Keep High'}
          </span>
        </div>
      </div>

      {/* Pricing & Free Climate Transit Strip */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#c2c9b5]/60 block">Price</span>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <span className="text-4xl font-black text-[#b6f076]">
              ${product.price}
            </span>
            <span className="text-sm line-through text-[#c2c9b5]/40 font-mono">
              ${Math.round(product.price * 1.35)}
            </span>
            <span className="text-[11px] font-bold text-[#121812] bg-[#b6f076] px-2 py-0.5 rounded-full">
              Save 25%
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-[#f6ffe4] flex items-center gap-1">
            <span>📦</span> Free Climate Shipping
          </span>
          <span className="text-[11px] text-[#b6f076]/90 block mt-0.5">
            Dispatches in 24h
          </span>
        </div>
      </div>

      {/* Editorial Plant Overview */}
      <p className="text-xs sm:text-sm text-[#c2c9b5] leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Planter Ceramic Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#f6ffe4] uppercase tracking-wider">
            Ceramic Planter ({product.potSize || '20cm'} Drainage Included)
          </span>
          <span className="text-[11px] text-[#b6f076] font-semibold">Included Free</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'alabaster', name: 'Alabaster White', color: 'bg-[#f4f4f0]' },
            { id: 'slate', name: 'Slate Noir', color: 'bg-[#252c24]' },
            { id: 'terracotta', name: 'Raw Terracotta', color: 'bg-[#a35c42]' },
          ].map((planter) => (
            <button
              key={planter.id}
              type="button"
              onClick={() => onSelectPlanter(planter.id as any)}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                selectedPlanter === planter.id
                  ? 'border-[#b6f076] bg-[#1a211a] shadow-[0_0_16px_rgba(182,240,118,0.25)]'
                  : 'border-white/10 bg-[#121812] hover:border-white/20'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${planter.color} border border-white/20 shrink-0`} />
              <span className="text-[11px] font-semibold text-[#dde5d9] truncate">{planter.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-full bg-[#1a211a] border border-white/15 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-[#f6ffe4] flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-bold text-[#f6ffe4]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(product.stock || 10, quantity + 1))}
              className="w-9 h-9 rounded-full hover:bg-white/10 text-[#f6ffe4] flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Primary High-Impact Button */}
          <button
            type="button"
            onClick={onAddToCart}
            className="flex-1 py-4 px-8 rounded-full bg-[#b6f076] text-[#121812] font-extrabold text-sm tracking-wide hover:bg-[#c7f88f] hover:shadow-[0_0_28px_rgba(182,240,118,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Add to Sanctuary · ${(product.price * quantity).toFixed(2)}</span>
          </button>
        </div>

        {/* Express 1-Click Buy */}
        <button
          type="button"
          onClick={onBuyNow}
          className="w-full py-3 rounded-full bg-[#141b14] border border-[#b6f076]/40 text-[#f6ffe4] hover:bg-[#1f271f] hover:border-[#b6f076] font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
        >
          Instant 1-Click Express Checkout
        </button>
      </div>

      {/* 3 Trust Pillars */}
      <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#121812] border border-white/5 text-center">
        <div>
          <div className="text-base mb-1">🛡️</div>
          <div className="text-[11px] font-bold text-[#f6ffe4]">30-Day Guarantee</div>
          <div className="text-[10px] text-[#c2c9b5]/60">Healthy arrival</div>
        </div>
        <div className="border-x border-white/10">
          <div className="text-base mb-1">🌱</div>
          <div className="text-[11px] font-bold text-[#f6ffe4]">Living Soil Mix</div>
          <div className="text-[10px] text-[#c2c9b5]/60">Pre-potted & aerated</div>
        </div>
        <div>
          <div className="text-base mb-1">🌿</div>
          <div className="text-[11px] font-bold text-[#f6ffe4]">Expert Care</div>
          <div className="text-[10px] text-[#c2c9b5]/60">Lifetime nursery help</div>
        </div>
      </div>
    </div>
  );
}
