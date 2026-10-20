'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MessageCircle, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Fast Delivery Across All 64 Districts</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Dhaka express in 48 hours (৳ 80). Nationwide doorstep delivery via Steadfast &amp; Pathao (৳ 150).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Archival Quality Guarantee</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                12-color pigment printing with UV varnish seal. Waterproof, fade-proof, and designed to last decades.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Transparent Payment Terms</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                30% advance via bKash or Nagad to begin custom printing. Remaining 70% paid on delivery (Cash on Delivery).
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-stone-800 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center font-serif font-bold text-sm">
                C
              </div>
              <span className="font-serif text-base font-bold text-white">CanvasCraft BD</span>
            </div>
            <p className="text-stone-400 leading-relaxed mb-4">
              Bangladesh&apos;s leading premium canvas &amp; PVC wall art studio. Handcrafted frames, zero-cut split panels, and curated gallery art.
            </p>
            <div className="flex items-center gap-2 text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Mirpur DOHS, Dhaka, Bangladesh</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Shop Art</h5>
            <ul className="space-y-2 text-stone-400">
              <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              <li><Link href="/products?cat=Islamic%20Art" className="hover:text-white transition">Islamic Calligraphy</Link></li>
              <li><Link href="/products?cat=Modern%20Abstract" className="hover:text-white transition">Modern Abstract</Link></li>
              <li><Link href="/products?cat=Landscape%20%26%20Nature" className="hover:text-white transition">Landscapes &amp; Horizons</Link></li>
              <li><Link href="/products?cat=Portrait%20%26%20Classical" className="hover:text-white transition">Classical Fine Art</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Custom Studio</h5>
            <ul className="space-y-2 text-stone-400">
              <li><Link href="/customize?pack=16x24" className="hover:text-white transition">Single Canvas (৳ 350 Promo)</Link></li>
              <li><Link href="/customize?pack=6x8-6" className="hover:text-white transition">6×8″ Mini Photo Tiles</Link></li>
              <li><Link href="/customize?pack=8x12-3" className="hover:text-white transition">8×12″ Wall Boards (3 Pcs ৳ 300)</Link></li>
              <li><Link href="/customize?pack=12x16-3" className="hover:text-white transition">12×16″ Medium Canvases</Link></li>
              <li><Link href="/customize?panel=5" className="hover:text-white transition">5-Part Triptych Split</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3">Direct Support</h5>
            <p className="text-stone-400 mb-3 leading-relaxed">
              Have questions about image resolution, custom sizes, or delivery? Reach our Dhaka production team directly:
            </p>
            <a
              href="https://wa.me/8801972304749"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us Now</span>
            </a>
            <div className="flex items-center gap-2 text-stone-400 mt-3">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+880 1972-304749</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 CanvasCraft BD. All rights reserved. Handcrafted with passion in Dhaka.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Return Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
