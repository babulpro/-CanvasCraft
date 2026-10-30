'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import CanvasCard from '@/components/products/CanvasCard';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Star,
  ShoppingBag
} from 'lucide-react';

const HOME_CATEGORIES = [
  'All Trending',
  'Islamic Art',
  'Modern Abstract',
  'Landscape & Nature',
  'Portrait & Classical'
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Trending');
  const [allProducts, setAllProducts] = useState<Product[]>(STATIC_PRODUCTS);

  // Fetch updated catalog on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setAllProducts(data.products);
        }
      })
      .catch(err => {
        console.warn('Could not refresh home products:', err);
      });
  }, []);

  const displayedArtworks = useMemo(() => {
    if (selectedCategory === 'All Trending') {
      const featured = allProducts.filter(p => p.featured);
      return featured.length >= 8 ? featured.slice(0, 8) : allProducts.slice(0, 8);
    }
    return allProducts.filter(p => p.category === selectedCategory).slice(0, 8);
  }, [allProducts, selectedCategory]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f4ee] via-[#faf8f5] to-[#f5f1ea] dark:from-[#14110e] dark:via-[#0c0a09] dark:to-[#110e0c] text-stone-900 dark:text-stone-100 border-b border-stone-200/80 dark:border-stone-800 pt-12 pb-20 sm:pt-20 sm:pb-28 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-amber-300/60 dark:border-amber-800/80 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Curated Fine Art &amp; Premium Canvas Wall Decor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight sm:leading-tight text-stone-950 dark:text-stone-100">
                Transform Any Wall Into A <span className="text-amber-800 dark:text-amber-400 italic">Museum Gallery.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                High-definition archival pigment prints on <strong className="text-stone-950 dark:text-stone-100 font-semibold">3mm Rigid PVC Boards</strong> or <strong className="text-stone-950 dark:text-stone-100 font-semibold">1.25″ Solid Pine Wood Stretched Canvas</strong> with luxury museum floating frames.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2.5 text-sm sm:text-base transform active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop All Artworks</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/#combos"
                  className="w-full sm:w-auto bg-white dark:bg-[#1c1917] hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold py-4 px-8 rounded-full border border-stone-300 dark:border-stone-700 shadow-xs hover:border-amber-400 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>View Combo Deals</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-white/90 sm:bg-white/80 dark:bg-[#1c1917]/90 p-2.5 sm:p-2 rounded-xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium">30% Advance • 70% COD</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-white/90 sm:bg-white/80 dark:bg-[#1c1917]/90 p-2.5 sm:p-2 rounded-xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
                  <Truck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span className="font-medium">64 Districts Doorstep</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-white/90 sm:bg-white/80 dark:bg-[#1c1917]/90 p-2.5 sm:p-2 rounded-xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium">Zero-Cut Splitting</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1c1917] p-3.5 shadow-2xl border border-stone-200/90 dark:border-stone-800 group ring-1 ring-stone-900/5 aspect-[4/5] w-full">
                <Image
                  src="/assets/portrait_art.jpg"
                  alt="CanvasCraft Studio Preview"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="rounded-2xl object-cover p-3.5 group-hover:scale-102 transition duration-500"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-stone-950/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between text-white shadow-xl z-10">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold block">16×24″ Studio Canvas</span>
                    <span className="text-sm sm:text-base font-bold text-white">Renaissance Oil Portrait</span>
                  </div>
                  <span className="bg-amber-500 text-stone-950 text-xs sm:text-sm font-black px-3 py-1.5 rounded-full shadow-xs">
                    Only ৳ 350
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VIRAL PACKAGE DEALS SHOWCASE */}
      <section id="combos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-3.5 py-1.5 rounded-full border border-rose-200 dark:border-rose-800 inline-block mb-2.5">
            Multi-Piece Deals &amp; Viral Bundles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 dark:text-stone-100">
            Exclusive Canvas Packages
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-2.5 leading-relaxed">
            Upload custom photos for each canvas piece or choose matching fine art collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: 6x8 Mini Tiles */}
          <div className="bg-white dark:bg-[#1c1917] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/80">
                  Desk &amp; Photo Grid
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-500 dark:text-stone-400">From ৳ 50/pc</span>
              </div>

              {/* Visual 6-Tile Gallery Grid Mockup */}
              <div className="mb-5 bg-gradient-to-b from-[#f9f7f2] via-[#f5f2ea] to-[#eee8dc] dark:from-[#171513] dark:via-[#141210] dark:to-[#110e0c] p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792781413/canvascraft/artworks/nwpi6mxuh2yqwnttlvkj.jpg', title: 'Golden Hour Embrace' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792776286/canvascraft/artworks/rvqlmmbsxejsybsg54uw.jpg', title: 'Autumn Serenity' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792775165/canvascraft/artworks/ktmtvaq2lqbw5bmd9n4s.jpg', title: 'Subhan Allah' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792780497/canvascraft/artworks/dj5brj1lok1s6d2netnf.jpg', title: 'Midnight Foliage' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792780135/canvascraft/artworks/o7un3q8df48cml9siaxa.jpg', title: 'Geometric Botanica' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792779410/canvascraft/artworks/zhzfz8wkgoykzo5hxhf6.jpg', title: 'Botanical Serenity' },
                  ].map((tile, tIdx) => (
                    <div
                      key={tIdx}
                      className="relative aspect-[3/4] rounded-xs overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.3)] border-[1.5px] border-white/90 dark:border-stone-700 group-hover:scale-105 transition-transform duration-300"
                    >
                      <Image
                        src={tile.img}
                        alt={tile.title}
                        fill
                        sizes="(max-width: 768px) 33vw, 150px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none z-10" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 text-center block mt-2">
                  Real 6-Piece PVC Photo Wall Collage
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">6×8″ Mini Photo Tiles</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 leading-relaxed">
                Rigid PVC photo boards with clean, minimal finish. Perfect for photo walls, baby memories, and travel grids.
              </p>
              
              <ul className="space-y-2 text-sm sm:text-base text-stone-700 dark:text-stone-300 mb-6 border-t border-stone-100 dark:border-stone-800 pt-4">
                <li className="flex justify-between"><span>• 6 Pieces Combo:</span><strong className="text-stone-900 dark:text-stone-100">৳ 300</strong></li>
                <li className="flex justify-between"><span>• 9 Pieces Combo:</span><strong className="text-stone-900 dark:text-stone-100">৳ 430</strong></li>
                <li className="flex justify-between"><span>• 12 Pieces Combo:</span><strong className="text-stone-900 dark:text-stone-100">৳ 550</strong></li>
                <li className="flex justify-between"><span>• 24 Pieces Mega:</span><strong className="text-amber-700 dark:text-amber-400">৳ 999</strong></li>
              </ul>
            </div>

            <Link
              href="/products"
              className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-950 dark:bg-stone-800 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-white font-bold py-3.5 rounded-xl text-center text-sm sm:text-base transition shadow-sm block"
            >
              Choose Art for 6×8″ Tiles
            </Link>
          </div>

          {/* Card 2: 8x12 Classic Wall Boards */}
          <div className="bg-gradient-to-b from-white to-amber-50/50 dark:from-[#1c1917] dark:to-[#221b14] rounded-3xl p-6 sm:p-7 border-2 border-amber-500 shadow-xl flex flex-col justify-between relative group">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Most Popular Wall Set
            </span>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold bg-amber-200/70 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
                  Living Room Gallery
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">Bestseller</span>
              </div>

              {/* Visual 3-Piece Living Room Wall Triptych Mockup */}
              <div className="mb-5 bg-gradient-to-b from-[#f9f7f2] via-[#f5f2ea] to-[#eee8dc] dark:from-[#171513] dark:via-[#141210] dark:to-[#110e0c] p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                <div className="grid grid-cols-3 gap-2 items-center">
                  {[
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792774757/canvascraft/artworks/ahtfrpmdnhvtjh7rjvce.jpg', title: 'Muhammad ﷺ' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792775165/canvascraft/artworks/ktmtvaq2lqbw5bmd9n4s.jpg', title: 'Subhan Allah' },
                    { img: 'https://res.cloudinary.com/dmyekmpy3/image/upload/v1792775512/canvascraft/artworks/wtcw9c9x0ayfahkw4cih.jpg', title: 'La Hawla' },
                  ].map((panel, pIdx) => (
                    <div
                      key={pIdx}
                      className="relative aspect-[2/3] rounded-none overflow-hidden shadow-[0_8px_16px_-2px_rgba(0,0,0,0.35)] border-[2px] border-white/90 dark:border-stone-700 group-hover:-translate-y-1 transition-transform duration-300"
                    >
                      <Image
                        src={panel.img}
                        alt={panel.title}
                        fill
                        sizes="(max-width: 768px) 33vw, 180px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none z-10" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-900 dark:text-amber-400 text-center block mt-2">
                  Real 3-Piece Matching Gallery Wall Set
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">8×12″ Classic Wall Boards</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 leading-relaxed">
                Proportional gallery boards. Fill wall space over your couch with 3, 6, or 9 matching pieces.
              </p>
              
              <ul className="space-y-2 text-sm sm:text-base text-stone-700 dark:text-stone-300 mb-6 border-t border-stone-200/60 dark:border-stone-800 pt-4">
                <li className="flex justify-between"><span>• 3 Pieces Deal:</span><strong className="text-stone-900 dark:text-stone-100">৳ 300</strong></li>
                <li className="flex justify-between"><span>• 6 Pieces Set:</span><strong className="text-stone-900 dark:text-stone-100">৳ 550</strong></li>
                <li className="flex justify-between"><span>• 9 Pieces Grid:</span><strong className="text-stone-900 dark:text-stone-100">৳ 850</strong></li>
                <li className="flex justify-between"><span>• 12 Pieces Master:</span><strong className="text-amber-700 dark:text-amber-400">৳ 1,050</strong></li>
              </ul>
            </div>

            <Link
              href="/products"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 rounded-xl text-center text-sm sm:text-base transition shadow-md block"
            >
              Choose Art for 8×12″ Set (৳ 300)
            </Link>
          </div>

          {/* Card 3: 16x24 Solo Promo */}
          <div className="bg-white dark:bg-[#1c1917] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                  Solo Promo Deal
                </span>
                <span className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">Only ৳ 350</span>
              </div>

              {/* Visual Solo Statement 16x24 Canvas Mockup */}
              <div className="mb-5 bg-gradient-to-b from-[#f9f7f2] via-[#f5f2ea] to-[#eee8dc] dark:from-[#171513] dark:via-[#141210] dark:to-[#110e0c] p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col items-center justify-center">
                <div className="relative w-48 sm:w-36 aspect-[2/3] rounded-none overflow-hidden shadow-[0_14px_28px_-4px_rgba(0,0,0,0.4),3px_3px_0px_rgba(0,0,0,0.3)] border border-stone-300 dark:border-stone-700 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="https://res.cloudinary.com/dmyekmpy3/image/upload/v1792493937/canvascraft/artworks/yysvud3nmdlvhjtmwufp.jpg"
                    alt="16x24 Whispers of the Sunset Solo Canvas"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/25 pointer-events-none z-10" />
                  <div className="absolute bottom-1.5 left-1.5 bg-black/80 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded z-10">
                    16×24″ Solo
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 text-center block mt-2">
                  Real 1.25″ Pine Wood Stretched Canvas
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">16×24″ Studio Canvas</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-5 leading-relaxed">
                Our bestselling statement portrait format. Vertical eye-level grandeur at an unbeatable promotional price.
              </p>
              
              <ul className="space-y-2 text-sm sm:text-base text-stone-700 dark:text-stone-300 mb-6 border-t border-stone-100 dark:border-stone-800 pt-4">
                <li className="flex justify-between"><span>• 3mm Rigid PVC:</span><strong className="text-rose-600 dark:text-rose-400">৳ 350 (Promo)</strong></li>
                <li className="flex justify-between"><span>• 1.25″ Pine Canvas:</span><strong className="text-stone-900 dark:text-stone-100">৳ 650</strong></li>
                <li className="flex justify-between"><span>• Optional Floating Frame:</span><strong className="text-stone-900 dark:text-stone-100">+৳ 400</strong></li>
              </ul>
            </div>

            <Link
              href="/products"
              className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-950 dark:bg-stone-800 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-white font-bold py-3.5 rounded-xl text-center text-sm sm:text-base transition shadow-sm block"
            >
              Order 16×24″ Canvas (৳ 350)
            </Link>
          </div>

        </div>
      </section>

      {/* 3. FEATURED ARTWORKS PREVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-3.5 py-1 rounded-full border border-amber-300/60 dark:border-amber-800/80 inline-block mb-1.5 shadow-2xs">
              Handpicked Fine Art
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-100">
              Trending Canvas Prints
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-1.5">
              Explore authentic archival pigment prints on 3mm Rigid PVC or 1.25″ Solid Pine Wood Stretched Canvas.
            </p>
          </div>
          <Link href="/products" className="text-sm sm:text-base font-bold text-amber-800 dark:text-amber-400 hover:text-stone-950 dark:hover:text-stone-100 flex items-center gap-1.5 transition">
            <span>View All {allProducts.length} Artworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 custom-scrollbar text-sm">
          {HOME_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs'
                    : 'bg-white dark:bg-[#1c1917] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-950 dark:hover:text-stone-100 border border-stone-200/90 dark:border-stone-800 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Realistic 3D Canvas Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedArtworks.map(prod => (
            <CanvasCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. DHAKA PRODUCTION GUARANTEE & REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#f8f5ee] via-[#fcfaf5] to-[#f4eee3] dark:from-[#171411] dark:via-[#1c1814] dark:to-[#14110e] text-stone-900 dark:text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 shadow-md relative overflow-hidden transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-widest bg-amber-100/70 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-300/60 dark:border-amber-800/80 inline-block">
                Our Quality Commitment
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-100 leading-tight">
                Archival Pigment Printing &amp; Custom Framing in Dhaka
              </h3>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
                Unlike ordinary digital posters that fade in sunlight, our canvases use 12-color archival pigment inks protected with an anti-scratch, waterproof UV satin seal. Each frame is assembled by master craftsmen in our Dhaka workshop.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm">
                <span className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Lightweight, Damage-Free Wall Mounting on PVC
                </span>
                <span className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Solid Kiln-Dried Pine Wood Stretcher Bars
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-white/95 dark:bg-[#141210]/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-stone-200/90 dark:border-stone-800 text-center space-y-3 w-full max-w-xs shadow-lg ring-1 ring-amber-500/10">
                <span className="text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 font-serif block">4.9 / 5.0</span>
                <div className="flex justify-center text-amber-500 gap-1">
                  {[0, 1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">Over 3,400+ custom canvases delivered across Bangladesh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
