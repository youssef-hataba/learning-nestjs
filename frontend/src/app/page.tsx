'use client';

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/features/products/api';
import { Product } from '@/features/products/types';
import { BOTANICAL_CATEGORIES } from '@/features/products/constants';
import HeroSection from '@/components/home/HeroSection';
import TrendingSection from '@/components/home/TrendingSection';
import ProductCatalog from '@/components/home/ProductCatalog';
import CustomerReviews from '@/components/home/CustomerReviews';
import BestO2Section from '@/components/home/BestO2Section';

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
    <div className="relative w-full overflow-hidden pt-20">
      {/* Ambient Chlorophyll Glows */}
      <div className="absolute top-10 left-1/4 w-[34rem] h-[34rem] bg-[#b6f076]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-80 right-10 w-[32rem] h-[32rem] bg-[#2e4732]/25 rounded-full blur-[160px] pointer-events-none" />

      <HeroSection heroPlant={heroPlant} />
      <TrendingSection trendyPlant1={trendyPlant1} trendyPlant2={trendyPlant2} />
      <ProductCatalog
        products={filteredProducts}
        categories={BOTANICAL_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />
      <CustomerReviews />
      <BestO2Section tropicalPlant={tropicalPlant} />
    </div>
  );
}
