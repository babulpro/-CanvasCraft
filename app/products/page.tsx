'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';
import { Product, AuthUser } from '@/types';
import { useSession } from '@/lib/auth-client';
import AddToCartModal from '@/components/products/AddToCartModal';
import CanvasCard from '@/components/products/CanvasCard';
import { Search, ShoppingBag, Sparkles, Filter, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'All Artworks',
  'Modern Abstract',
  'Islamic Art',
  'Landscape & Nature',
  'Minimalist',
  'Portrait & Classical'
] as const;

export default function ProductsPage() {
  const { data: session } = useSession();
  const user = session?.user as (AuthUser & Record<string, unknown>) | undefined;
  const isAdmin = user?.role === 'admin';

  const [productsList, setProductsList] = useState<Product[]>(STATIC_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Artworks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Initialize category from URL parameter (?cat=...) if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('cat');
      if (catParam) {
        setSelectedCategory(catParam);
      }
    }
  }, []);

  // Fetch updated catalog from MongoDB API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(err => {
        console.warn('Using static products:', err);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter(prod => {
      const matchesCat = selectedCategory === 'All Artworks' || prod.category === selectedCategory;
      const matchesSearch =
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.basePrice - b.basePrice;
      if (sortBy === 'price-high') return b.basePrice - a.basePrice;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-[#faf9f6] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-300/60 inline-block mb-1.5 shadow-2xs">
              Curated Fine Art Collections
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight">
              Gallery Artworks &amp; Wall Prints
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-1.5">
              Explore {productsList.length} curated designs ready for custom sizing in 3mm Rigid PVC or 1.25″ Pine Wood Canvas.
            </p>
          </div>

          {/* Search Input, Sort dropdown & Admin Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin/add-product"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-extrabold shadow-xs transition shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Artwork (Admin)</span>
              </Link>
            )}

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search art, style, verse..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 bg-white text-stone-800 cursor-pointer font-medium shadow-2xs"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 custom-scrollbar text-sm">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950 border border-stone-200/90 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Artworks Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 mt-4">
            <Filter className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-stone-800">No matching artworks found</h3>
            <p className="text-sm text-stone-500 mt-1">Try selecting another category or clear your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {filteredProducts.map(prod => (
              <CanvasCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>

      {/* Quick Add To Bag Modal */}
      <AddToCartModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
}
