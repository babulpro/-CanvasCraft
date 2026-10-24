'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ShoppingBag, ArrowRight, Sparkles, Layers, Eye } from 'lucide-react';

interface CanvasCardProps {
  product: Product;
  priority?: boolean;
}

export default function CanvasCard({ product, priority = false }: CanvasCardProps) {
  const isLandscape = product.orientation === 'landscape';
  const isSquare = product.orientation === 'square';

  // Dimension ratio label
  const ratioLabel = isLandscape ? 'Landscape (3:2)' : isSquare ? 'Square (1:1)' : 'Portrait (2:3)';

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-amber-400/80">
      
      {/* 1. GALLERY EXHIBITION STAGE (The "Real Canvas" Showcase) */}
      <Link
        href={`/products/${product.id}`}
        className="relative h-72 sm:h-80 w-full overflow-hidden bg-gradient-to-b from-[#f9f7f2] via-[#f4f0e6] to-[#eee8dc] flex items-center justify-center p-6 border-b border-stone-200/70 select-none block"
      >
        {/* Gallery Wall Spotlight Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.9) 0%, rgba(240,235,225,0.4) 65%, rgba(225,218,205,0.3) 100%)'
          }}
        />

        {/* Subtle Archival Studio Wall Texture Lines */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1c1917 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* 3D Stretched Canvas Display Container */}
        <div
          className="relative transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03] flex items-center justify-center max-w-[85%] max-h-[85%]"
          style={{
            aspectRatio: isLandscape ? '3/2' : isSquare ? '1/1' : '2/3',
            width: isLandscape ? '100%' : 'auto',
            height: isLandscape ? 'auto' : '100%',
          }}
        >
          {/* Authentic 3D Gallery-Wrap Box Shadow & Deep Frame Elevation */}
          <div
            className="relative w-full h-full rounded-none overflow-hidden"
            style={{
              boxShadow:
                '0 20px 35px -8px rgba(35, 25, 15, 0.32), 0 8px 16px -3px rgba(35, 25, 15, 0.20), 3px 3px 0px rgba(55, 42, 30, 0.24)'
            }}
          >
            {/* The Actual Canvas Artwork */}
            <img
              src={product.image}
              alt={product.title}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-full object-cover block select-none"
            />

            {/* 3D Pine Wood Canvas Gallery-Wrap Edge Bevel Highlight (Right & Bottom Depth) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.45), inset -2px -2px 3px rgba(0,0,0,0.4)'
              }}
            />

            {/* Micro Archival Linen Weave Texture Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, transparent 1px, transparent 2px)'
              }}
            />

            {/* Satin Anti-Glare UV Varnish Reflection */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/10 via-transparent to-white/25 opacity-70" />
          </div>

          {/* Realistic 3D Cast Shadow on the Gallery Wall (Right/Bottom) */}
          <div
            className="absolute -right-2.5 -bottom-2.5 w-full h-full -z-10 rounded-sm pointer-events-none opacity-40 blur-[4px] bg-stone-900/40"
          />
        </div>

        {/* Top Badges (Category & Features) */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <span className="bg-stone-950/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5">
            {product.featured && (
              <span className="bg-amber-500 text-stone-950 text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            <span className="bg-white/85 backdrop-blur-md text-stone-800 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border border-stone-300 shadow-2xs hidden sm:inline-block">
              {ratioLabel}
            </span>
          </div>
        </div>

        {/* Hover Quick Action Indicator */}
        <div className="absolute bottom-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-stone-950/90 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-amber-500/30 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>View in Room</span>
          </span>
        </div>

      </Link>

      {/* 2. PRODUCT DETAILS & SPECS */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Material & Construction Specs Teaser */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mt-1 mb-2">
            <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>3mm Rigid PVC • 1.25″ Pine Canvas</span>
          </div>

          {/* Description / Tags */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
            {product.details || product.description || product.tags.join(' • ')}
          </p>
        </div>

        {/* 3. PRICING & ORDER ACTION */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-serif font-bold text-stone-950">
                ৳ {product.basePrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-500">/ print</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <Link
            href={`/products/${product.id}`}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
