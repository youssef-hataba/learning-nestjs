'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { fetchProducts } from '@/features/products/api';
import { Product } from '@/features/products/types';
import { BOTANICAL_CATEGORIES } from '@/features/products/constants';
import HeroSection from '@/components/home/HeroSection';
import TrendingSection from '@/components/home/TrendingSection';
import ProductCatalog from '@/components/home/ProductCatalog';
import CustomerReviews from '@/components/home/CustomerReviews';
import BestO2Section from '@/components/home/BestO2Section';
import LeafDivider from '@/components/ui/LeafDivider';
import FloatingLeaves from '@/components/ui/FloatingLeaves';
import VerticalLeafOrnament from '@/components/ui/VerticalLeafOrnament';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const backendProducts = await fetchProducts({ limit: 50 });
        if (backendProducts && backendProducts.length > 0) {
          setProducts(backendProducts);
        }
      } catch (err) {
        console.warn('Backend fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase()) ||
      (activeCategory === 'Pet-Friendly' && p.isPetFriendly);

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.scientificName && p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const heroPlant = products.find((p) => p.title.includes('Monstera')) || products[0];
  const trendyPlant1 = products.find((p) => p.title.includes('Snake')) || products[2];
  const trendyPlant2 = products.find((p) => p.title.includes('Raven')) || products[5] || products[1];
  const tropicalPlant = products.find((p) => p.title.includes('Paradise'));

  return (
    <div className="relative w-full overflow-hidden pt-16 sm:pt-20">
      {/* Ambient Warm Sage & Terracotta Glows (Ref: color-pallete.jpg) */}
      <div className="absolute top-10 left-1/4 w-[34rem] h-[34rem] bg-[#A8C3A0]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-80 right-10 w-[32rem] h-[32rem] bg-[#E8B4A0]/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Hanging Philodendron cascading seamlessly from top ceiling on far left */}
      <div className="absolute top-0 left-1 sm:left-3 lg:left-5 xl:left-8 z-50 w-28 sm:w-36 lg:w-40 h-60 sm:h-76 lg:h-84 pointer-events-none select-none">
        <Image
          src="/hero/hanging_Philodendron_Brasil.png"
          alt="Hanging Philodendron Brasil"
          fill
          priority
          className="object-contain object-top drop-shadow-[0_16px_32px_rgba(32,49,35,0.15)]"
        />
      </div>

      {/* Hero Section */}
      <HeroSection heroPlant={heroPlant} />

      {/* Decorative Botanical Leaf Divider */}
      <LeafDivider className="my-1" />

      {/* Trending Spotlight Section with paired symmetrical vertical vines */}
      <div className="relative">
        {/* <VerticalLeafOrnament side="left" top="top-2" height={420} width={54} opacity="opacity-75" /> */}
        {/* <VerticalLeafOrnament side="right" top="top-2" height={420} width={54} opacity="opacity-75" /> */}
        {/* <FloatingLeaves variant="section" /> */}
        <TrendingSection trendyPlant1={trendyPlant1} trendyPlant2={trendyPlant2} />
      </div>

      {/* Decorative Botanical Leaf Divider */}
      <LeafDivider className="my-1" />

      {/* Curated Product Catalog */}
      <ProductCatalog
        products={filteredProducts}
        categories={BOTANICAL_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />

      {/* Decorative Botanical Leaf Divider */}
      <LeafDivider className="my-1" />

      {/* Best O2 Plant Feature with paired symmetrical vertical vines */}
      <div className="relative">
        {/* <VerticalLeafOrnament side="left" top="top-4" height={440} width={56} opacity="opacity-75" /> */}
        {/* <VerticalLeafOrnament side="right" top="top-4" height={440} width={56} opacity="opacity-75" /> */}
        <BestO2Section tropicalPlant={tropicalPlant} />
      </div>

      {/* Decorative Botanical Leaf Divider */}
      <LeafDivider className="my-1" />

      {/* Customer Reviews with paired symmetrical vertical vines */}
      <div className="relative">
        <VerticalLeafOrnament side="left" top="top-2" height={360} width={50} opacity="opacity-70" />
        <VerticalLeafOrnament side="right" top="top-2" height={360} width={50} opacity="opacity-70" />
        <CustomerReviews />
      </div>
    </div>
  );
}
