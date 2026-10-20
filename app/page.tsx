'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import AddToCartModal from '@/components/products/AddToCartModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Maximize2,
  ShoppingBag,
  Star,
  Layers,
  Palette,
  PhoneCall
} from 'lucide-react';

export default function HomePage() {
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [featuredArtworks, setFeaturedArtworks] = useState<Product[]>(PRODUCTS.slice(0, 4));

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const staticIds = new Set(PRODUCTS.map(p => p.id));
          const dbCustoms = data.products.filter((p: Product) => !staticIds.has(p.id));
          const combined = [...PRODUCTS.filter(p => p.featured), ...dbCustoms];
          setFeaturedArtworks(combined.slice(0, 4));
        }
      })
      .catch(err => {
        console.warn('Using static products:', err);
      });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f4ee] via-[#faf8f5] to-[#f5f1ea] text-stone-900 border-b border-stone-200/80 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-900 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-amber-400/30">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Bangladesh’s #1 Custom Canvas Studio</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight sm:leading-tight text-stone-950">
                Transform Any Wall Into A <span className="text-amber-800 italic">Museum Gallery.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                High-definition archival pigment prints on <strong className="text-stone-950 font-semibold">3mm Rigid PVC Boards</strong> (free 3M tape) or <strong className="text-stone-950 font-semibold">1.25″ Solid Pine Wood Stretched Canvas</strong> with luxury museum floating frames.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/customize"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2.5 text-sm sm:text-base transform active:scale-95"
                >
                  <Palette className="w-5 h-5" />
                  <span>Customize in Live Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products"
                  className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-900 font-bold py-4 px-8 rounded-full border border-stone-300 shadow-xs hover:border-stone-400 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>Explore Catalog</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-6 border-t border-stone-200 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-white/90 sm:bg-white/80 p-2.5 sm:p-2 rounded-xl border border-stone-200/90 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">30% Advance • 70% COD</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-white/90 sm:bg-white/80 p-2.5 sm:p-2 rounded-xl border border-stone-200/90 shadow-2xs">
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-medium">64 Districts Doorstep</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-white/90 sm:bg-white/80 p-2.5 sm:p-2 rounded-xl border border-stone-200/90 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Zero-Cut Splitting</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (Teaser Preview) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-white p-3.5 shadow-2xl border border-stone-200/90 group ring-1 ring-stone-900/5">
                <img
                  src="/assets/portrait_art.jpg"
                  alt="CanvasCraft Studio Preview"
                  className="w-full rounded-2xl object-cover aspect-[4/5] group-hover:scale-102 transition duration-500"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-stone-950/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between text-white shadow-xl">
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
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 inline-block mb-2.5">
            Multi-Piece Deals &amp; Viral Bundles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950">
            Exclusive Canvas Packages
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2.5 leading-relaxed">
            Upload custom photos for each canvas piece or choose matching fine art collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: 6x8 Mini Tiles */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Desk &amp; Photo Grid
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-500">From ৳ 50/pc</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">6×8″ Mini Photo Tiles</h3>
              <p className="text-sm text-stone-600 mb-5 leading-relaxed">
                Rigid PVC photo board with free 3M tape. Perfect for photo walls, baby memories, and travel grids.
              </p>
              
              <ul className="space-y-2 text-sm sm:text-base text-stone-700 mb-6 border-t border-stone-100 pt-4">
                <li className="flex justify-between"><span>• 6 Pieces Combo:</span><strong className="text-stone-900">৳ 300</strong></li>
                <li className="flex justify-between"><span>• 9 Pieces Combo:</span><strong className="text-stone-900">৳ 430</strong></li>
                <li className="flex justify-between"><span>• 12 Pieces Combo:</span><strong className="text-stone-900">৳ 550</strong></li>
                <li className="flex justify-between"><span>• 24 Pieces Mega:</span><strong className="text-amber-700">৳ 999</strong></li>
              </ul>
            </div>

            <Link
              href="/customize?pack=6x8-6"
              className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-3.5 rounded-xl text-center text-sm sm:text-base transition shadow-sm"
            >
              Customize 6×8″ Tiles
            </Link>
          </div>

          {/* Card 2: 8x12 Classic Wall Boards */}
          <div className="bg-gradient-to-b from-white to-amber-50/50 rounded-3xl p-6 sm:p-7 border-2 border-amber-500 shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Most Popular Wall Set
            </span>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold bg-amber-200/70 text-amber-900 px-3 py-1 rounded-full">
                  Living Room Gallery
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-600">Bestseller</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">8×12″ Classic Wall Boards</h3>
              <p className="text-sm text-stone-600 mb-5 leading-relaxed">
                Proportional gallery boards. Fill wall space over your couch with 3, 6, or 9 matching pieces.
              </p>
              
              <ul className="space-y-2 text-sm sm:text-base text-stone-700 mb-6 border-t border-stone-200/60 pt-4">
                <li className="flex justify-between"><span>• 3 Pieces Deal:</span><strong className="text-stone-900">৳ 300</strong></li>
                <li className="flex justify-between"><span>• 6 Pieces Set:</span><strong className="text-stone-900">৳ 550</strong></li>
                <li className="flex justify-between"><span>• 9 Pieces Grid:</span><strong className="text-stone-900">৳ 850</strong></li>
                <li className="flex justify-between"><span>• 12 Pieces Master:</span><strong className="text-amber-700">৳ 1,050</strong></li>
              </ul>
            </div>

            <Link
              href="/customize?pack=8x12-3"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 rounded-xl text-center text-sm sm:text-base transition shadow-md"
            >
              Customize 8×12″ Set (৳ 300)
            </Link>
          </div>

          {/* Card 3: 16x24 Solo Promo */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                  Solo Promo Deal
                </span>
                <span className="text-xs sm:text-sm font-black text-rose-600">Only ৳ 350</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">16×24″ Studio Canvas</h3>
              <p className="text-sm text-stone-600 mb-5 leading-relaxed">
                Our bestselling statement portrait format. Vertical eye-level grandeur at an unbeatable promotional price.
              </p>
              
              <ul className="space-y-2 text-sm sm:text-base text-stone-700 mb-6 border-t border-stone-100 pt-4">
                <li className="flex justify-between"><span>• 3mm Rigid PVC:</span><strong className="text-rose-600">৳ 350 (Promo)</strong></li>
                <li className="flex justify-between"><span>• 1.25″ Pine Canvas:</span><strong className="text-stone-900">৳ 650</strong></li>
                <li className="flex justify-between"><span>• Optional Floating Frame:</span><strong className="text-stone-900">+৳ 400</strong></li>
              </ul>
            </div>

            <Link
              href="/customize?pack=16x24"
              className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-3.5 rounded-xl text-center text-sm sm:text-base transition shadow-sm"
            >
              Order 16×24″ (৳ 350)
            </Link>
          </div>

        </div>
      </section>

      {/* 3. FEATURED ARTWORKS PREVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-1.5">
              Handpicked Fine Art
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950">
              Trending Canvas Prints
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1.5">
              Pre-calibrated museum artworks ready for single canvas and multi-panel zero-cut wall decor.
            </p>
          </div>
          <Link href="/products" className="text-sm sm:text-base font-bold text-amber-800 hover:text-stone-950 flex items-center gap-1.5 transition">
            <span>View All Artworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtworks.map(prod => {
            const studioUrl =
              prod.id === 'port-1'
                ? '/customize?preset=portrait&pack=16x24'
                : prod.id === 'abstract-1'
                ? '/customize?preset=triptych&pack=3part-36x24'
                : prod.id === 'islamic-1'
                ? '/customize?preset=calligraphy'
                : prod.id === 'nature-1'
                ? '/customize?preset=sajek&pack=5part-24x48'
                : `/customize?preset=${prod.id}`;

            return (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Artwork Thumbnail Container with fixed height for perfect aspect harmony */}
                <div className="relative h-60 sm:h-64 bg-stone-900 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    {prod.category}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-stone-950/85 backdrop-blur-xs text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/20">
                    From ৳ {prod.basePrice}
                  </span>
                </div>

                {/* Artwork Info & Details instead of raw tags */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition">
                      {prod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 mb-3 leading-relaxed line-clamp-2">
                      {prod.details || prod.description || prod.tags.join(' • ')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <Link
                      href={studioUrl}
                      className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <span>Studio View</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setModalProduct(prod)}
                      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DHAKA PRODUCTION GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#24211e] via-[#1c1917] to-[#2c2723] text-stone-100 rounded-3xl p-8 sm:p-12 border border-amber-900/30 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-widest">
                Our Quality Commitment
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Archival Pigment Printing &amp; Custom Framing in Dhaka
              </h3>
              <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
                Unlike ordinary digital posters that fade in sunlight, our canvases use 12-color archival pigment inks protected with an anti-scratch, waterproof UV satin seal. Each frame is assembled by master craftsmen in our Dhaka workshop.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm">
                <span className="flex items-center gap-2 text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Free 3M Mounting Tape on all PVC Boards
                </span>
                <span className="flex items-center gap-2 text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Solid Kiln-Dried Pine Wood Stretcher Bars
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-[#161412]/90 p-6 sm:p-8 rounded-2xl border border-stone-700/80 text-center space-y-3 w-full max-w-xs shadow-xl">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 block">4.9 / 5.0</span>
                <div className="flex justify-center text-amber-400 gap-1">
                  {[0, 1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-xs sm:text-sm text-stone-300">Over 3,400+ custom canvases delivered across Bangladesh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add To Bag Modal */}
      <AddToCartModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />

    </div>
  );
}
