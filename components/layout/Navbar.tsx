'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from '@/lib/auth-client';
import { AuthUser } from '@/types';
import {
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Grid,
  Palette,
  User,
  Shield,
  ShieldAlert,
  Package,
  Menu,
  X,
  ChevronRight,
  Phone,
  Flame,
  LogOut,
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/8801972304749';
const PHONE_NUMBER = '+880 1972-304749';
const PHONE_TEL = 'tel:+8801972304749';

export default function Navbar() {
  const pathname = usePathname();
  const { totals, openDrawer } = useCart();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const user = session?.user as (AuthUser & Record<string, unknown>) | undefined;
  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';

  return (
    <>
      {/* 1. Curated Top Announcement Bar */}
      <div className="bg-[#12100e] text-stone-300 text-xs py-2 px-3 sm:px-4 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Dhaka Workshop Status (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-stone-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Dhaka Workshop Active • Fast Nationwide Delivery (All 64 Districts)</span>
          </div>

          {/* Center: Zero-Cut Tech Tagline */}
          <div className="mx-auto md:mx-0 flex items-center gap-1.5 sm:gap-2 text-[11px]">
            <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide border border-amber-500/30 uppercase shrink-0">
              Zero-Cut Studio
            </span>
            <span className="text-stone-300 truncate max-w-[240px] sm:max-w-none">
              Continuous panels preserve 100% of your art.
            </span>
          </div>

          {/* Right: WhatsApp Concierge (Desktop) */}
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-emerald-400 transition flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: +880 1972304749</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 text-amber-400 flex items-center justify-center font-serif text-base sm:text-xl font-bold tracking-wider shadow-sm border border-stone-800 shrink-0">
                C
              </div>
              <div className="min-w-0">
                <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-stone-950 block leading-tight truncate">
                  CanvasCraft<span className="text-amber-700 font-sans text-[11px] sm:text-xs ml-1 font-bold px-1.5 py-0.5 rounded bg-amber-100/70 border border-amber-200">BD</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium tracking-wide hidden sm:block">
                  Archival Canvas &amp; Rigid PVC Wall Decor
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-stone-700 pl-4 border-l border-stone-200">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-full transition ${
                  pathname === '/'
                    ? 'text-amber-950 bg-amber-100/80 font-bold border border-amber-300/60 shadow-2xs'
                    : 'hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                Home
              </Link>

              <Link
                href="/products"
                className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                  pathname === '/products'
                    ? 'text-amber-950 bg-amber-100/80 font-bold border border-amber-300/60 shadow-2xs'
                    : 'hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-amber-600" />
                <span>All Products</span>
              </Link>

              <Link
                href="/#combos"
                className="px-3 py-1.5 rounded-full text-rose-800 hover:text-rose-950 bg-rose-50 hover:bg-rose-100 transition border border-rose-200 flex items-center gap-1.5 font-bold shadow-2xs"
              >
                <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Combo Deals</span>
              </Link>

              {/* STRICT CONDITION: Only show "My Orders" if LOGGED IN */}
              {mounted && user && (
                <Link
                  href="/orders"
                  className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                    pathname === '/orders'
                      ? 'text-amber-950 bg-amber-100/80 font-bold border border-amber-300/60 shadow-2xs'
                      : 'hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  <span>My Orders</span>
                </Link>
              )}

              {/* Admin Dashboard: Strictly for Admin Users */}
              {mounted && isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-full text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 transition border border-red-200 flex items-center gap-1.5 font-bold shadow-2xs"
                >
                  <Shield className="w-3.5 h-3.5 text-red-600" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* User Session State: Visible on Desktop/Tablet, Accessible in Drawer on Mobile */}
            <div className="hidden md:flex items-center">
              {!mounted ? (
                <div className="w-16 h-8 rounded-full bg-stone-200/60 animate-pulse" />
              ) : user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 py-1 px-2.5 sm:px-3 rounded-full bg-amber-100/80 hover:bg-amber-200 text-stone-900 text-xs font-bold transition border border-amber-300/80 shadow-2xs shrink-0"
                  title="Member Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-950 text-amber-400 font-black flex items-center justify-center text-[10px] shadow-2xs shrink-0">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[85px] truncate">
                    {user.username ? `@${user.username}` : user.name?.split(' ')[0]}
                  </span>
                  <span className="sm:hidden text-xs font-bold">Profile</span>
                  {isAdmin && (
                    <span className="bg-red-600 text-white text-[8px] font-black uppercase px-1 rounded">
                      Admin
                    </span>
                  )}
                  {isModerator && (
                    <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-1 rounded">
                      Mod
                    </span>
                  )}
                </Link>
              ) : (
                /* Radiant Golden Amber Login CTA on Desktop */
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-1.5 py-1.5 px-3.5 sm:px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm shadow-sm transition active:scale-95 shrink-0"
                  title="Login to Your Account"
                >
                  <User className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Shopping Bag CTA (Desktop/Tablet) */}
            <button
              onClick={openDrawer}
              className="hidden md:flex relative p-2 rounded-full hover:bg-stone-100 text-stone-800 transition group cursor-pointer shrink-0"
              title="Open Shopping Bag"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-stone-950 transition" />
              {totals.totalPieces > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totals.totalPieces}
                </span>
              )}
            </button>

            {/* Desktop Bag Pill (hidden on small screens) */}
            <button
              onClick={openDrawer}
              className="hidden lg:inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition transform active:scale-95 cursor-pointer"
            >
              <span>Bag ({totals.totalPieces})</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Mobile Hamburger Toggle Button (The ONLY Header Action on Mobile) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="relative md:hidden p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 transition cursor-pointer border border-stone-200/80 shrink-0"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5 text-stone-900" />
              {totals.totalPieces > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totals.totalPieces}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Responsive Navigation Drawer (Rendered OUTSIDE <header> to prevent containing-block clipping!) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-stone-950 text-stone-100">
          
          {/* Top Bar of Mobile Menu with Brand & Close Button */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-stone-800 bg-[#12100e] shrink-0">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 text-amber-400 font-serif font-bold flex items-center justify-center text-sm border border-stone-700">
                C
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                CanvasCraft<span className="text-amber-500 font-sans text-xs ml-1 font-bold">BD</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition border border-stone-800 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            {/* Mobile User Profile / Sign In Card (Prominent & Clear) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#24211e] via-[#1c1917] to-[#121110] border-2 border-amber-500/40 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
              {!mounted ? (
                <div className="w-full h-14 bg-stone-800/60 rounded-xl animate-pulse" />
              ) : user ? (
                /* Logged-In User Card */
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-bold flex items-center justify-center text-base shadow-md shrink-0">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-stone-100 text-sm truncate">
                            {user.name || 'Member'}
                          </p>
                          {isAdmin && (
                            <span className="bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                          {isModerator && (
                            <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                              Moderator
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 truncate mt-0.5 font-mono">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/80">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-semibold text-xs transition border border-stone-700"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition border border-stone-700"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-500" />
                      <span>My Orders</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 hover:text-red-200 text-xs font-semibold border border-red-900/40 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                /* Not Logged In: Super Clear Sign In & Register Buttons */
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
                      <User className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-stone-100 text-sm">
                          CanvasCraft Account
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                          Free
                        </span>
                      </div>
                      <p className="text-xs text-stone-300">
                        Sign in to view orders &amp; saved designs
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black text-xs transition shadow-lg shadow-amber-500/25 text-center"
                    >
                      <User className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Sign In / Login</span>
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition border border-stone-700 text-center"
                    >
                      <span>Create Account</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Nav Links on Mobile */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 px-2 pb-1">
                Art Gallery &amp; Tools
              </p>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl transition ${
                  pathname === '/'
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-stone-200 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300">
                    🏠
                  </span>
                  <span className="text-sm font-medium">Home Gallery</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </Link>

              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl transition ${
                  pathname === '/products'
                    ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-stone-200 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500">
                    <Grid className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-sm font-medium block">All Artworks</span>
                    <span className="text-[11px] text-stone-400">Curated gallery catalog</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </Link>

              <Link
                href="/#combos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-rose-300 hover:bg-stone-900 transition border border-rose-950/40 bg-rose-950/20"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-200">Combo Deals</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500 text-white uppercase">
                        Hot
                      </span>
                    </div>
                    <span className="text-[11px] text-rose-400/80">3 to 6 Piece Sets from ৳300</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </Link>

              {/* STRICT CONDITION: My Orders ONLY IF LOGGED IN */}
              {mounted && user && (
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition ${
                    pathname === '/orders'
                      ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500">
                      <Package className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-sm font-medium block">My Orders &amp; Tracking</span>
                      <span className="text-[11px] text-stone-400">Live delivery status &amp; history</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </Link>
              )}

              {/* Admin Dashboard: Strictly for Admin Users */}
              {mounted && isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-red-300 hover:bg-stone-900 transition border border-red-900/50 bg-red-950/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <ShieldAlert className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-sm font-bold text-red-200 block">Admin Studio Dashboard</span>
                      <span className="text-[11px] text-red-400/80">Manage artworks &amp; delete products</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </Link>
              )}
            </div>

            {/* Shopping Bag Button in Mobile Menu */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openDrawer();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Open Shopping Bag ({totals.totalPieces} Items)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Direct Concierge & Support with User's WhatsApp number */}
            <div className="pt-3 border-t border-stone-800/80 space-y-2.5 text-xs">
              <p className="text-[11px] text-stone-500 uppercase font-mono">
                Dhaka Production Concierge
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-stone-800 transition font-bold"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={PHONE_TEL}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-800 transition font-bold"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Call Hotline</span>
                </a>
              </div>
              <p className="text-[10px] text-stone-400 text-center font-mono">
                Hotline / WhatsApp: {PHONE_NUMBER}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
