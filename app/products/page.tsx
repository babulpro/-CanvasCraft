'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';
import { Product, AuthUser } from '@/types';
import { useSession } from '@/lib/auth-client';
import AddToCartModal from '@/components/products/AddToCartModal';
import { Search, ShoppingBag, Eye, Sparkles, Filter, PlusCircle } from 'lucide-react';

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
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
              Curated Fine Art Collections
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Gallery Artworks &amp; Wall Prints
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Explore {productsList.length} curated designs ready for custom sizing in 3mm Rigid PVC or 1.25″ Pine Wood Canvas.
            </p>
          </div>

          {/* Search Input, Sort dropdown & Admin Action */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {isAdmin && (
              <Link
                href="/admin/add-product"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Artwork (Admin)</span>
              </Link>
            )}

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search art, style, verse..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 bg-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 bg-white text-stone-700 cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-4 custom-scrollbar text-xs">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
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
            <h3 className="text-sm font-bold text-stone-800">No matching artworks found</h3>
            <p className="text-xs text-stone-400 mt-1">Try selecting another category or clear your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mt-4">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Artwork Thumbnail with Hover Overlay */}
                <div className="relative aspect-[3/4] bg-stone-900 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {prod.category}
                  </span>
                  {prod.featured && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      Popular
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition">
                      {prod.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
                      {prod.tags.map(t => (
                        <span key={t} className="text-[8px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-stone-400 block">Starts from</span>
                      <span className="text-xs sm:text-sm font-black text-amber-700">৳ {prod.basePrice}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/customize?preset=${prod.id}`}
                        className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition"
                        title="Preview on Living Room Wall"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setModalProduct(prod)}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
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
