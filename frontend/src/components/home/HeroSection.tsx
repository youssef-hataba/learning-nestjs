'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/features/products/types';

interface HeroSectionProps {
  heroPlant?: Product;
}

const HERO_PLANTS = [
  {
    id: 1,
    title: 'Monstera Deliciosa',
    subtitle: 'Tropical King',
    category: 'Air Purifying',
    price: '$65.00',
    image: '/hero/hands_holding_plant.png',
  },
  {
    id: 2,
    title: 'Alocasia Polly',
    subtitle: 'Velvet Amazonica',
    category: 'Exotic Foliage',
    price: '$78.00',
    image: '/hero/alocasia_velvet.png',
  },
  {
    id: 3,
    title: 'Natural Azalea Bonsai',
    subtitle: 'Vibrant Blossom',
    category: 'Flowering Specimen',
    price: '$54.00',
    image: '/hero/natural_azalea_clean.png',
  },
];

export default function HeroSection({ heroPlant }: HeroSectionProps) {
  const [activePlantIndex, setActivePlantIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentPlant = HERO_PLANTS[activePlantIndex];

  // Auto-rotate every 4.5 seconds with graceful pause when user interacts/hovers
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActivePlantIndex((prev) => (prev + 1) % HERO_PLANTS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] min-h-[620px] flex flex-col justify-between pt-1 pb-4 sm:pb-4 lg:pb-8">
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-10 relative z-10 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto py-2 lg:py-4">
          {/* Left Content Column */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0 z-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#203123] leading-[1.12] mb-5">
              Bring Nature&apos;s Beauty <br />
              into your{' '}
              <span className="text-[#4e7349] relative inline-block">
                Home.
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#A8C3A0] rounded-full opacity-60" />
              </span>
            </h1>

            {/* Concise, serene description */}
            <p className="text-sm sm:text-base text-[#5e7362] max-w-md leading-relaxed mb-7">
              Curated living houseplants designed to add serene natural beauty, fresh oxygen, and mindful calm to your living space.
            </p>

            {/* Clean Shop Now CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#4e7349] text-white font-semibold text-sm tracking-wide hover:bg-[#3d5c38] hover:shadow-lg transition-all shadow-md cursor-pointer group"
              >
                <span>Shop Now</span>
                <svg
                  className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <Link
                href="#catalog"
                className="text-xs font-semibold text-[#4e7349] hover:text-[#203123] underline underline-offset-4 transition-colors"
              >
                Featured: {currentPlant.title} →
              </Link>
            </div>
          </div>

          {/* Right Visual: Showcase Plant with Large Asymmetric Fluid Green Backdrop + Mini Image Cards */}
          <div className="lg:col-span-7 relative flex flex-col lg:flex-row items-center justify-between min-h-[480px] sm:h-[540px] lg:h-[580px]">
            {/* Center Area: Big Truly Asymmetric Green Shape + Plant */}
            <div className="relative flex-1 flex items-center justify-center w-full h-[400px] sm:h-[480px] lg:h-[540px]">
              {/* Extra Large Asymmetric Fluid Organic Green Shape (Single Pure Green Shape, viewBox & dimensions calculated to never clip) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] sm:w-[540px] lg:w-[620px] h-[440px] sm:h-[520px] lg:h-[580px] pointer-events-none select-none z-0">
                <svg
                  viewBox="-40 -30 760 680"
                  className="w-full h-full transform -rotate-2 transition-transform duration-1000 overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="organicHeroBlob" x1="60" y1="30" x2="620" y2="590" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#C5D5CB" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#A8C3A0" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  {/* Single organic, fluid asymmetrical green contour with full margin */}
                  <path
                    d="M310 30C440 38 475 145 565 115C635 90 675 190 650 310C625 425 520 405 490 495C460 585 350 610 210 590C90 565 25 505 20 380C15 255 85 205 125 125C165 48 205 22 310 30Z"
                    fill="url(#organicHeroBlob)"
                  />
                </svg>
              </div>

              {/* Main Center Plant Images with Ultra-Smooth Cross-Fade Transition */}
              <div
                className="relative w-[320px] sm:w-[410px] lg:w-[490px] h-[340px] sm:h-[430px] lg:h-[500px] z-10 select-none cursor-pointer"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {HERO_PLANTS.map((plant, index) => {
                  const isActive = activePlantIndex === index;
                  return (
                    <div
                      key={plant.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isActive
                          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={plant.image}
                        alt={plant.title}
                        fill
                        priority={index === 0}
                        className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(32,49,35,0.18)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Far Right: Ultra-Compact Image-Only Plant Cards */}
            <div
              className="flex flex-row lg:flex-col gap-2.5 justify-center z-30 shrink-0 mt-3 lg:mt-0 lg:ml-1"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {HERO_PLANTS.map((plant, index) => {
                const isActive = activePlantIndex === index;
                return (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => setActivePlantIndex(index)}
                    title={plant.title}
                    className={`group relative p-1 rounded-xl flex items-center justify-center transition-all duration-500 cursor-pointer ${
                      isActive
                        ? 'bg-white/95 border-2 border-[#4e7349] shadow-[0_6px_18px_rgba(78,115,73,0.3)] scale-110 ring-2 ring-[#4e7349]/20'
                        : 'bg-white/70 border border-[#A8C3A0]/40 hover:bg-white/95 hover:scale-105 opacity-60 hover:opacity-100 shadow-xs'
                    } backdrop-blur-md w-11 h-11 sm:w-12 sm:h-12`}
                  >
                    {/* Pure Plant Thumbnail Image */}
                    <div className="relative w-full h-full p-0.5">
                      <Image
                        src={plant.image}
                        alt={plant.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Stats Strip (Clean, centered & balanced) */}
        <div className="relative mt-2 lg:mt-0 z-10">
          <div className="w-full bg-[#C5D5CB]/60 border border-[#A8C3A0]/35 rounded-2xl sm:rounded-3xl py-5 px-6 sm:px-12 backdrop-blur-md shadow-xs">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center px-2 sm:px-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#203123] tracking-tight">
                  150+
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-[#405443] mt-1">
                  Orders Everyday
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-[#A8C3A0]/50">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#203123] tracking-tight">
                  2,450+
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-[#405443] mt-1">
                  Products Sold
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#203123] tracking-tight">
                  180+
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-[#405443] mt-1">
                  Plant Collection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
