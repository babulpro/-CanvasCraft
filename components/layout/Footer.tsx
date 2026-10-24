'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MessageCircle, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#f7f4ee] via-[#faf7f2] to-[#f2ede4] text-stone-700 pt-16 pb-12 border-t border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-stone-200">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/90 border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition">
            <div className="w-11 h-11 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300/60 shadow-2xs">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950 mb-1.5">Fast Delivery Across 64 Districts</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Dhaka express in 48 hours (৳ 80). Nationwide doorstep delivery via Steadfast &amp; Pathao (৳ 150).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/90 border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition">
            <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300/60 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950 mb-1.5">Archival Quality Guarantee</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                12-color pigment printing with UV varnish seal. Waterproof, fade-proof, and designed to last decades.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/90 border border-stone-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition">
            <div className="w-11 h-11 rounded-xl bg-rose-100/80 text-rose-800 flex items-center justify-center shrink-0 border border-rose-300/60 shadow-2xs">
              <Clock className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-950 mb-1.5">Transparent Payment Terms</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                30% advance via bKash or Nagad to begin custom printing. Remaining 70% paid on delivery (Cash on Delivery).
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-12 border-b border-stone-200 text-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-serif font-bold text-base shadow-xs">
                C
              </div>
              <span className="font-serif text-lg font-bold text-stone-950 tracking-tight">CanvasCraft BD</span>
            </div>
            <p className="text-stone-600 leading-relaxed mb-4 text-sm font-normal">
              Bangladesh&apos;s leading premium canvas &amp; PVC wall art studio. Handcrafted frames, zero-cut split panels, and curated gallery art.
            </p>
            <div className="flex items-center gap-2.5 text-stone-600 text-sm font-medium">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Mirpur DOHS, Dhaka, Bangladesh</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-stone-950 uppercase tracking-wider text-xs sm:text-sm mb-4">Shop Art</h5>
            <ul className="space-y-2.5 text-stone-600 text-sm">
              <li><Link href="/products" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">All Products</Link></li>
              <li><Link href="/products?cat=Islamic%20Art" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">Islamic Calligraphy</Link></li>
              <li><Link href="/products?cat=Modern%20Abstract" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">Modern Abstract</Link></li>
              <li><Link href="/products?cat=Landscape%20%26%20Nature" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">Landscapes &amp; Horizons</Link></li>
              <li><Link href="/products?cat=Portrait%20%26%20Classical" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">Classical Fine Art</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-stone-950 uppercase tracking-wider text-xs sm:text-sm mb-4">Popular Sizes &amp; Deals</h5>
            <ul className="space-y-2.5 text-stone-600 text-sm">
              <li><Link href="/products" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">Single Canvas (16×24″ ৳ 350 Promo)</Link></li>
              <li><Link href="/#combos" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">8×12″ Wall Boards (3 Pcs ৳ 300)</Link></li>
              <li><Link href="/#combos" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">6×8″ Mini Photo Tiles (6 Pcs ৳ 300)</Link></li>
              <li><Link href="/products" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">12×16″ Medium Wall Art</Link></li>
              <li><Link href="/products" className="hover:text-amber-800 hover:translate-x-1 transition-all duration-200 block font-medium">20×30″ Large Statement Canvas</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-stone-950 uppercase tracking-wider text-xs sm:text-sm mb-4">Direct Support</h5>
            <p className="text-stone-600 mb-4 leading-relaxed text-sm">
              Have questions about image resolution, custom sizes, or delivery? Reach our Dhaka production team directly:
            </p>
            <a
              href="https://wa.me/8801972304749"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-xs text-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us Now</span>
            </a>
            <div className="flex items-center gap-2 text-stone-800 mt-3 text-sm font-semibold">
              <Phone className="w-4 h-4 text-amber-700" />
              <span className="font-mono">+880 1972-304749</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-stone-500 gap-4">
          <p>© 2026 CanvasCraft BD. All rights reserved. Handcrafted with passion in Dhaka.</p>
          <div className="flex items-center gap-5 text-stone-500">
            <span className="hover:text-stone-800 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-800 transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-800 transition cursor-pointer">Return Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
