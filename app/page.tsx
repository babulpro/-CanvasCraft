'use client';

import React, { useState } from 'react';
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
  const featuredArtworks = PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bangladesh’s #1 Custom Canvas Studio</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight sm:leading-tight">
                Transform Any Wall Into A <span className="text-amber-400 italic">Museum Gallery.</span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                High-definition archival pigment prints on <strong className="text-white">3mm Rigid PVC Boards</strong> (free 3M tape) or <strong className="text-white">1.25″ Solid Pine Wood Stretched Canvas</strong> with luxury museum floating frames.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/customize"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm transform active:scale-95"
                >
                  <Palette className="w-4 h-4" />
                  <span>Customize in Live Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products"
                  className="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-white font-bold py-3.5 px-7 rounded-full border border-stone-700 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <span>Explore Catalog</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 pt-6 border-t border-stone-800 text-xs sm:text-[11px] text-stone-300">
                <div className="flex items-center gap-2 justify-center lg:justify-start bg-stone-900/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>30% Advance • 70% COD</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start bg-stone-900/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>64 Districts Doorstep</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start bg-stone-900/60 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero-Cut Splitting</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (Teaser Preview) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-stone-800 p-3 shadow-2xl border border-stone-700 group">
                <img
                  src="/assets/portrait_art.jpg"
                  alt="CanvasCraft Studio Preview"
                  className="w-full rounded-2xl object-cover aspect-[4/5] group-hover:scale-102 transition duration-500"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-stone-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold block">16×24″ Studio Canvas</span>
                    <span className="text-xs font-bold text-white">Renaissance Oil Portrait</span>
                  </div>
                  <span className="bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded-full">
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
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
            Multi-Piece Deals &amp; Viral Bundles
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
            Exclusive Canvas Packages
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Upload custom photos for each canvas piece or choose matching fine art collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 6x8 Mini Tiles */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                  Desk &amp; Photo Grid
                </span>
                <span className="text-xs font-bold text-stone-400">From ৳ 50/pc</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">6×8″ Mini Photo Tiles</h3>
              <p className="text-xs text-stone-500 mb-4">
                Rigid PVC photo board with free 3M tape. Perfect for photo walls, baby memories, and travel grids.
              </p>
              
              <ul className="space-y-1.5 text-xs text-stone-700 mb-6 border-t border-stone-100 pt-3">
                <li className="flex justify-between"><span>• 6 Pieces Combo:</span><strong className="text-stone-900">৳ 300</strong></li>
                <li className="flex justify-between"><span>• 9 Pieces Combo:</span><strong className="text-stone-900">৳ 430</strong></li>
                <li className="flex justify-between"><span>• 12 Pieces Combo:</span><strong className="text-stone-900">৳ 550</strong></li>
                <li className="flex justify-between"><span>• 24 Pieces Mega:</span><strong className="text-amber-700">৳ 999</strong></li>
              </ul>
            </div>

            <Link
              href="/customize?pack=6x8-6"
              className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-2.5 rounded-xl text-center text-xs transition"
            >
              Customize 6×8″ Tiles
            </Link>
          </div>

          {/* Card 2: 8x12 Classic Wall Boards */}
          <div className="bg-gradient-to-b from-white to-amber-50/50 rounded-3xl p-6 border-2 border-amber-500 shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular Wall Set
            </span>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold bg-amber-200/60 text-amber-900 px-2.5 py-1 rounded-full">
                  Living Room Gallery
                </span>
                <span className="text-xs font-bold text-stone-500">Bestseller</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">8×12″ Classic Wall Boards</h3>
              <p className="text-xs text-stone-500 mb-4">
                Proportional gallery boards. Fill wall space over your couch with 3, 6, or 9 matching pieces.
              </p>
              
              <ul className="space-y-1.5 text-xs text-stone-700 mb-6 border-t border-stone-200/60 pt-3">
                <li className="flex justify-between"><span>• 3 Pieces Deal:</span><strong className="text-stone-900">৳ 300</strong></li>
                <li className="flex justify-between"><span>• 6 Pieces Set:</span><strong className="text-stone-900">৳ 550</strong></li>
                <li className="flex justify-between"><span>• 9 Pieces Grid:</span><strong className="text-stone-900">৳ 850</strong></li>
                <li className="flex justify-between"><span>• 12 Pieces Master:</span><strong className="text-amber-700">৳ 1,050</strong></li>
              </ul>
            </div>

            <Link
              href="/customize?pack=8x12-3"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-2.5 rounded-xl text-center text-xs transition shadow-md"
            >
              Customize 8×12″ Set (৳ 300)
            </Link>
          </div>

          {/* Card 3: 16x24 Solo Promo */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full">
                  Solo Promo Deal
                </span>
                <span className="text-xs font-black text-rose-600">Only ৳ 350</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">16×24″ Studio Canvas</h3>
              <p className="text-xs text-stone-500 mb-4">
                Our bestselling statement portrait format. Vertical eye-level grandeur at an unbeatable promotional price.
              </p>
              
              <ul className="space-y-1.5 text-xs text-stone-700 mb-6 border-t border-stone-100 pt-3">
                <li className="flex justify-between"><span>• 3mm Rigid PVC:</span><strong className="text-rose-600">৳ 350 (Promo)</strong></li>
                <li className="flex justify-between"><span>• 1.25″ Pine Canvas:</span><strong className="text-stone-900">৳ 650</strong></li>
                <li className="flex justify-between"><span>• Optional Floating Frame:</span><strong className="text-stone-900">+৳ 400</strong></li>
              </ul>
            </div>

            <Link
              href="/customize?pack=16x24"
              className="w-full bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-2.5 rounded-xl text-center text-xs transition"
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
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
              Handpicked Fine Art
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Trending Canvas Prints
            </h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-amber-800 hover:text-stone-950 flex items-center gap-1">
            <span>View All {PRODUCTS.length} Artworks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtworks.map(prod => (
            <div
              key={prod.id}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-stone-900 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {prod.category}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">{prod.title}</h3>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Starts from ৳ {prod.basePrice}</span>
                </div>

                <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    href={`/customize?preset=${prod.id}`}
                    className="text-[11px] font-semibold text-stone-600 hover:text-stone-950 transition"
                  >
                    Studio View
                  </Link>

                  <button
                    type="button"
                    onClick={() => setModalProduct(prod)}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DHAKA PRODUCTION GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Our Quality Commitment
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold">
                Archival Pigment Printing &amp; Custom Framing in Dhaka
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
                Unlike ordinary digital posters that fade in sunlight, our canvases use 12-color archival pigment inks protected with an anti-scratch, waterproof UV satin seal. Each frame is assembled by master craftsmen in our Dhaka workshop.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free 3M Mounting Tape on all PVC Boards
                </span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Solid Kiln-Dried Pine Wood Stretcher Bars
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700 text-center space-y-3">
                <span className="text-3xl font-black text-amber-400 block">4.9 / 5.0</span>
                <div className="flex justify-center text-amber-400 gap-0.5">
                  {[0, 1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs text-stone-300">Over 3,400+ custom canvases delivered across Bangladesh.</p>
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
