'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CanvasCardProps {
  product: Product;
  priority?: boolean;
}

export default function CanvasCard({ product, priority = false }: CanvasCardProps) {
  const isLandscape = product.orientation === 'landscape';
  const isSquare = product.orientation === 'square';

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-amber-400/80">
      
      {/* 1. CLEAN EXHIBITION STAGE (Neat, clean & beautiful to watch) */}
      <Link
        href={`/products/${product.id}`}
        className="relative h-80 sm:h-72 w-full overflow-hidden bg-[#faf8f5] flex items-center justify-center p-3 sm:p-5 border-b border-stone-100 select-none block"
      >
        {/* Soft Warm Ambient Studio Lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(245,242,235,0.4) 70%, transparent 100%)'
          }}
        />

        {/* Clean Canvas Display Container */}
        <div
          className="relative transition-transform duration-300 ease-out group-hover:scale-[1.03] flex items-center justify-center max-w-[94%] max-h-[94%] sm:max-w-[88%] sm:max-h-[88%]"
          style={{
            aspectRatio: isLandscape ? '3/2' : isSquare ? '1/1' : '2/3',
            width: isLandscape ? '100%' : 'auto',
            height: isLandscape ? 'auto' : '100%',
          }}
        >
          {/* Canvas Artwork with Crisp Clean Edge & 3D Depth */}
          <div className="relative w-full h-full rounded-xs overflow-hidden border border-stone-300/80 bg-white shadow-[0_12px_24px_-4px_rgba(35,25,15,0.22),0_4px_8px_-2px_rgba(35,25,15,0.12)]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover block select-none"
            />

            {/* Subtle Archival Linen Texture Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 2px)'
              }}
            />

            {/* Subtle Anti-Glare Satin Sheen */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/15 opacity-50" />
          </div>
        </div>

        {/* Minimal Category Pill */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="bg-stone-900/85 backdrop-blur-xs text-stone-100 border border-white/10 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
            {product.category}
          </span>
        </div>

      </Link>

      {/* 2. MINIMAL & NEAT CARD DETAILS */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-1">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Clean Price & Action Button */}
        <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-serif font-bold text-stone-950">
            ৳ {product.basePrice.toLocaleString()}
          </span>

          <Link
            href={`/products/${product.id}`}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-2xs hover:shadow-xs transition flex items-center gap-1 active:scale-95"
          >
            <span>Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
