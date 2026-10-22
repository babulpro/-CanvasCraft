'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';
import { STANDARD_SIZES } from '@/data/combo-packages';
import { Product, SizeOption, MaterialType } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Check,
  ArrowRight,
  Maximize2,
  X,
  MessageCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  Layers,
  Sofa,
  Eye,
  Palette
} from 'lucide-react';

interface ProductDetailContentProps {
  productId: string;
}

// Curated realistic wall paint swatches with pre-rendered photorealistic room views
const WALL_COLORS = [
  { id: 'white', name: 'Original Sunlit White', hex: '#ffffff', imageSrc: '/assets/rooms/living_room_white.jpg', textDark: true },
  { id: 'ivory', name: 'Warm Alabaster', hex: '#f7f3ea', imageSrc: '/assets/rooms/living_room_ivory.jpg', textDark: true },
  { id: 'linen', name: 'Oatmeal Linen', hex: '#e8dfd2', imageSrc: '/assets/rooms/living_room_linen.jpg', textDark: true },
  { id: 'greige', name: 'Greige Mist', hex: '#d1c9bd', imageSrc: '/assets/rooms/living_room_greige.jpg', textDark: true },
  { id: 'slate', name: 'Moody Slate', hex: '#374151', imageSrc: '/assets/rooms/living_room_slate.jpg', textDark: false },
  { id: 'olive', name: 'Forest Olive', hex: '#2e3d32', imageSrc: '/assets/rooms/living_room_olive.jpg', textDark: false },
  { id: 'navy', name: 'Midnight Navy', hex: '#1e293b', imageSrc: '/assets/rooms/living_room_navy.jpg', textDark: false },
  { id: 'terracotta', name: 'Terracotta Clay', hex: '#8a483a', imageSrc: '/assets/rooms/living_room_terracotta.jpg', textDark: false },
];

export interface SlimBorderOption {
  id: string;
  name: string;
  color: string;
  borderCss: string;
  textDark?: boolean;
}

export const SLIM_BORDER_OPTIONS: SlimBorderOption[] = [
  { id: 'none', name: 'None (Full Bleed)', color: 'transparent', borderCss: 'none', textDark: true },
  { id: 'white', name: 'Pure White (2.5mm)', color: '#ffffff', borderCss: '2.5px solid #ffffff', textDark: true },
  { id: 'black', name: 'Matte Black (2.5mm)', color: '#171717', borderCss: '2.5px solid #171717', textDark: false },
  { id: 'walnut', name: 'Warm Walnut (2.5mm)', color: '#4a3319', borderCss: '2.5px solid #4a3319', textDark: false },
  { id: 'gold', name: 'Brushed Gold (2.5mm)', color: '#c5a059', borderCss: '2.5px solid #c5a059', textDark: false },
];

export default function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();

  const [product, setProduct] = useState<Product | null>(() => {
    return STATIC_PRODUCTS.find(p => p.id === productId) || null;
  });
  const [loading, setLoading] = useState(!product);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(STANDARD_SIZES[3]); // 16x24 default
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('pvc');
  const [selectedBorder, setSelectedBorder] = useState<SlimBorderOption>(SLIM_BORDER_OPTIONS[0]); // Default: None (Full Bleed)
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'room' | 'studio'>('room');
  const [wallColor, setWallColor] = useState(WALL_COLORS[0]); // Original Sunlit White default

  // Load product from API if not found statically (e.g. admin created artworks)
  useEffect(() => {
    if (product) return;

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          const found = data.products.find((p: Product) => p.id === productId);
          if (found) {
            setProduct(found);
          }
        }
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-600 text-sm font-medium">Loading artwork details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-serif">
            🎨
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Artwork Not Found</h2>
          <p className="text-sm text-stone-600">
            The artwork you requested might have been moved or removed from our gallery catalog.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold shadow-md transition"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Pure rimless pricing: Unit price is strictly the material base price (No extra frame charge)
  const basePrice = selectedMaterial === 'pvc' ? selectedSize.pricePvc : selectedSize.priceCanvas;
  const unitPrice = basePrice;
  const totalPrice = unitPrice * quantity;

  // Physical dimension calculations
  const isLandscape = product.orientation === 'landscape';
  const isSquare = product.orientation === 'square';

  const physWidth = isSquare
    ? Math.min(selectedSize.w, selectedSize.h)
    : isLandscape
    ? Math.max(selectedSize.w, selectedSize.h)
    : Math.min(selectedSize.w, selectedSize.h);

  const physHeight = isSquare
    ? Math.min(selectedSize.w, selectedSize.h)
    : isLandscape
    ? Math.min(selectedSize.w, selectedSize.h)
    : Math.max(selectedSize.w, selectedSize.h);

  const cmWidth = Math.round(physWidth * 2.54);
  const cmHeight = Math.round(physHeight * 2.54);

  // Exact real-world architectural perspective scale on the far wall behind 84" sofa:
  // In the 1200x896 photo, the 84-inch sofa spans 689px (8.2 px per inch).
  // Container % per inch: width = 8.2 / 1200 = 0.6833%, height = 8.2 / 896 = 0.9152%
  const artWidthPct = physWidth * 0.6833;
  const artHeightPct = physHeight * 0.9152;

  // Handler for adding to bag
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      sizeCode: selectedSize.code,
      sizeLabel: selectedSize.label,
      width: selectedSize.w,
      height: selectedSize.h,
      material: selectedMaterial,
      materialName: selectedMaterial === 'pvc' ? '3mm Rigid PVC Board' : '1.25″ Pine Wood Canvas',
      frameType: 'none',
      frameName: 'Gallery Wrap / Rimless',
      borderName: selectedBorder.name,
      basePrice,
      framePrice: 0,
      unitPrice,
      quantity
    });
    openDrawer();
  };

  // Handler for Direct Order Now (Go straight to COD Checkout)
  const handleOrderNow = () => {
    addItem({
      productId: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      sizeCode: selectedSize.code,
      sizeLabel: selectedSize.label,
      width: selectedSize.w,
      height: selectedSize.h,
      material: selectedMaterial,
      materialName: selectedMaterial === 'pvc' ? '3mm Rigid PVC Board' : '1.25″ Pine Wood Canvas',
      frameType: 'none',
      frameName: 'Gallery Wrap / Rimless',
      borderName: selectedBorder.name,
      basePrice,
      framePrice: 0,
      unitPrice,
      quantity
    });
    router.push('/cart');
  };

  // Pre-fill WhatsApp message
  const borderDesc = selectedBorder.id !== 'none'
    ? `• Slim Edge Accent: ${selectedBorder.name}\n`
    : `• Edge Style: Modern Rimless / Gallery Wrap (Full Bleed)\n`;

  const waText = encodeURIComponent(
    `Hello CanvasCraft BD! I would like to order this artwork:\n` +
    `• Artwork: ${product.title}\n` +
    `• Size: ${selectedSize.label} (${physWidth}″ × ${physHeight}″)\n` +
    `• Material: ${selectedMaterial === 'pvc' ? '3mm Rigid PVC Board' : '1.25″ Pine Wood Canvas'}\n` +
    `• Style: Gallery Wrap / Rimless (৳0 Extra)\n` +
    borderDesc +
    `• Quantity: ${quantity}\n` +
    `• Total Price: ৳ ${totalPrice.toLocaleString()}\n\n` +
    `Please confirm my delivery details.`
  );
  const waUrl = `https://wa.me/8801972304749?text=${waText}`;

  // Curated recommendations (same category or others)
  const relatedProducts = STATIC_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      
      {/* 1. Breadcrumbs Header */}
      <div className="border-b border-stone-200/80 bg-white/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-stone-900 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link href="/products" className="hover:text-stone-900 transition">
            All Artworks
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link
            href={`/products?cat=${encodeURIComponent(product.category)}`}
            className="hover:text-stone-900 transition"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-semibold text-stone-900 truncate max-w-[200px]">
            {product.title}
          </span>
        </div>
      </div>

      {/* 2. Main Product Showcase & Configurator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Interactive Proportional Size Preview & Room View */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
            
            {/* View Mode Controls Bar */}
            <div className="flex items-center justify-between gap-2 p-1.5 bg-stone-900/5 rounded-2xl border border-stone-200/90">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('room')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'room'
                      ? 'bg-white text-stone-950 shadow-xs border border-stone-200/80'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sofa className="w-3.5 h-3.5 text-amber-600" />
                  <span>Living Room View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('studio')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'studio'
                      ? 'bg-white text-stone-950 shadow-xs border border-stone-200/80'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  <span>Studio Detail</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

            {/* Main Visual Preview Display Area */}
            {viewMode === 'room' ? (
              /* Photorealistic Living Room Scene with Real Sofa & Tea Table */
              <div className="relative w-full aspect-[4/3] max-h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-stone-800/15 bg-stone-900 select-none">
                
                {/* 1. Photorealistic Living Room Scene with Exact Wall Color Paint, Real Sofa & Tea Table */}
                <img
                  key={wallColor.id}
                  src={wallColor.imageSrc}
                  alt={`Living Room with ${wallColor.name} Wall, Real Sofa and Tea Table`}
                  className="w-full h-full object-cover pointer-events-none select-none transition-all duration-300"
                />

                {/* 2. The Artwork on the Far Wall — True Architectural Perspective, Frameless / Gallery Wrap */}
                <div
                  className="absolute z-20 flex items-center justify-center pointer-events-none transition-all duration-500 ease-out"
                  style={{
                    left: '52.4%',
                    top: '30.5%',
                    width: `${artWidthPct}%`,
                    height: `${artHeightPct}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative w-full h-full cursor-zoom-in group/canvas transition-shadow duration-300 pointer-events-auto"
                    style={{
                      boxShadow:
                        selectedMaterial === 'canvas'
                          ? '0 18px 32px -6px rgba(0,0,0,0.52), 0 8px 14px -3px rgba(0,0,0,0.30), 3px 3px 0px rgba(40,30,20,0.22)'
                          : '0 12px 20px -4px rgba(0,0,0,0.35), 0 5px 10px -2px rgba(0,0,0,0.20), 1.5px 1.5px 0px rgba(40,30,20,0.14)',
                      borderRadius: '0px'
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover select-none rounded-none block pointer-events-auto"
                    />

                    {/* 2-3mm Slim Edge/Border (Customizable Color) */}
                    {selectedBorder.id !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          border: selectedBorder.borderCss
                        }}
                      />
                    )}

                    {/* 3D Pine Wood Canvas Wrap Edge Highlight */}
                    {selectedMaterial === 'canvas' && (
                      <div
                        className="absolute inset-0 pointer-events-none border border-white/20"
                        style={{
                          boxShadow: 'inset 0 0 2px rgba(0,0,0,0.15)'
                        }}
                      />
                    )}

                    {/* Subtle Satin Sheen Surface Reflection */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/15 opacity-60" />
                  </div>
                </div>

                {/* True Wall Scale Legend & Dimension Pill at Bottom */}
                <div className="absolute bottom-3 left-3.5 z-30 flex items-center gap-2">
                  <div className="bg-stone-900/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-mono px-3 py-1.5 rounded-full border border-white/15 shadow-md flex items-center gap-1.5">
                    <span className="font-bold text-amber-400">{selectedSize.label}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-200">{physWidth}″ × {physHeight}″ ({cmWidth} × {cmHeight} cm)</span>
                    <span className="text-stone-500 hidden sm:inline">•</span>
                    <span className="text-stone-400 hidden sm:inline">On far wall above 84″ sofa</span>
                  </div>
                </div>

                {/* Category & Orientation Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-30">
                  <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15">
                    {product.category}
                  </span>
                  <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/15 capitalize">
                    {product.orientation}
                  </span>
                </div>

                {/* Fullscreen Zoom CTA Pill */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-3.5 right-3.5 z-30 bg-stone-900/80 hover:bg-stone-900 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15 transition flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>Zoom</span>
                </button>

              </div>
            ) : (
              /* Studio Detail View (High-res Dark Gallery Exhibition) */
              <div className="relative bg-[#141210] rounded-3xl p-6 shadow-2xl border border-stone-800/80 overflow-hidden flex flex-col items-center justify-between min-h-[500px] sm:min-h-[550px]">
                {/* Museum Spotlight Beam */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.11) 0%, transparent 70%)'
                  }}
                />

                {/* Top Badges */}
                <div className="w-full flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-900/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                      {product.category}
                    </span>
                    <span className="bg-stone-900/90 backdrop-blur-md text-stone-300 text-xs font-medium px-2.5 py-1 rounded-full border border-white/10 capitalize">
                      {product.orientation}
                    </span>
                  </div>

                  <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
                    Rimless / Gallery Wrap
                  </span>
                </div>

                {/* High-res Artwork Container in Studio View */}
                <div className="relative flex-1 w-full flex items-center justify-center p-4 z-20">
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative cursor-zoom-in group/studio transition-all duration-300"
                    style={{
                      boxShadow:
                        selectedMaterial === 'canvas'
                          ? '0 30px 60px -12px rgba(0,0,0,0.7), 0 18px 36px -18px rgba(0,0,0,0.6), 5px 5px 0px rgba(30,20,10,0.4)'
                          : '0 20px 40px -10px rgba(0,0,0,0.6), 0 10px 20px -10px rgba(0,0,0,0.4), 2px 2px 0px rgba(30,20,10,0.3)',
                      borderRadius: '0px'
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="block max-h-[320px] sm:max-h-[360px] max-w-[360px] sm:max-w-[440px] w-auto h-auto object-contain select-none group-hover/studio:scale-[1.02] transition-transform duration-500 rounded-none"
                    />

                    {/* 2-3mm Slim Edge/Border (Customizable Color) */}
                    {selectedBorder.id !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          border: selectedBorder.borderCss
                        }}
                      />
                    )}

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/10 via-transparent to-white/10 opacity-70" />
                  </div>
                </div>

                {/* Studio Detail Bar with Fullscreen CTA */}
                <div className="w-full flex items-center justify-between z-10 pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 border border-stone-700 text-white text-xs font-mono shadow-md">
                    <span className="text-amber-400 font-bold">{physWidth}″ × {physHeight}″</span>
                    <span className="text-stone-400">({cmWidth} × {cmHeight} cm)</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-300">
                      {selectedMaterial === 'pvc' ? '3mm Board' : '1.25″ Canvas'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="bg-stone-900/85 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect Fullscreen</span>
                  </button>
                </div>

              </div>
            )}

            {/* Wall Color Selector Palette (Active in Room View) */}
            {viewMode === 'room' && (
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    <span>Wall Color: <strong className="text-amber-800">{wallColor.name}</strong></span>
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Preview on your home wall
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                  {WALL_COLORS.map(col => {
                    const isSelected = wallColor.id === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setWallColor(col)}
                        title={col.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative shrink-0 flex items-center justify-center ${
                          isSelected
                            ? 'border-amber-600 scale-110 shadow-md ring-2 ring-amber-400/50'
                            : 'border-stone-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${col.textDark ? 'text-stone-900' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Benefits Banner */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <Truck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">Fast 48h Delivery</span>
                <span className="text-[11px] text-stone-500">Dhaka &amp; 64 Districts</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <Clock className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">COD Available</span>
                <span className="text-[11px] text-stone-500">30% Adv • 70% Delivery</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">Decade Guarantee</span>
                <span className="text-[11px] text-stone-500">Fade-Proof Color</span>
              </div>
            </div>

            {/* Artwork Texture & Archival Guarantee Caption */}
            <div className="pt-1 px-1 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>12-Color Archival Pigment Inks • Waterproof UV Seal</span>
              </span>
              <span className="font-mono text-[11px] text-stone-400">
                Dhaka Handcrafted
              </span>
            </div>

          </div>

          {/* Right Column: Title, Details, Simplified 2-Step Ordering */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500 text-xs gap-0.5">
                  {[0, 1, 2, 3, 4].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">4.9 / 5.0</span>
                <span className="text-xs text-stone-400">• Curated Gallery Artwork</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 leading-tight">
                {product.title}
              </h1>

              {/* Dynamic Price Display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-amber-700">
                  ৳ {totalPrice.toLocaleString()}
                </span>
                {quantity > 1 && (
                  <span className="text-xs sm:text-sm text-stone-500">
                    (৳ {unitPrice.toLocaleString()} / piece)
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  In Stock • Made in Dhaka
                </span>
              </div>

              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                {product.details || product.description || 'Museum-quality archival pigment artwork ready for statement living room displays and bedroom accent decor.'}
              </p>
            </div>

            {/* STEP 1: SIZING OPTIONS (CLICKING RESIZES PREVIEW IMMEDIATELY WITHOUT CUTTING EDGES) */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900">
                  1. Choose Canvas Size
                </label>
                <span className="text-xs text-stone-500 font-mono">
                  Selected: <strong className="text-stone-900">{selectedSize.label}</strong> ({physWidth}″ × {physHeight}″)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STANDARD_SIZES.map(sz => {
                  const isSelected = selectedSize.code === sz.code;
                  const price = selectedMaterial === 'pvc' ? sz.pricePvc : sz.priceCanvas;
                  return (
                    <button
                      key={sz.code}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-2xl border text-left transition relative cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400'
                          : 'border-stone-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      {sz.badge && (
                        <span className="absolute -top-2.5 right-2 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-2xs">
                          {sz.badge}
                        </span>
                      )}
                      <span className="font-bold text-stone-900 block text-sm leading-tight">
                        {sz.label}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        {sz.sub}
                      </span>
                      <span className="text-sm font-black text-amber-700 block mt-1.5">
                        ৳ {price}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-stone-500 italic pt-1">
                💡 Tip: Preview displays true perspective scale hanging on the far wall above your 84″ sofa.
              </p>
            </div>

            {/* STEP 2: MATERIAL SELECTION */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <label className="text-sm font-bold text-stone-900 block">
                2. Choose Material
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMaterial('pvc')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    selectedMaterial === 'pvc'
                      ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400'
                      : 'border-stone-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 text-sm">3mm Rigid PVC Board</span>
                    {selectedMaterial === 'pvc' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Ultra-light, durable, high-density smooth finish. Damage-free, easy wall mounting.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMaterial('canvas')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    selectedMaterial === 'canvas'
                      ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400'
                      : 'border-stone-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 text-sm">1.25″ Pine Wood Canvas</span>
                    {selectedMaterial === 'canvas' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Museum gallery wrap on solid kiln-dried pine wood stretcher bars. Deep dimensional profile.
                  </p>
                </button>
              </div>
            </div>

            {/* HANGING STYLE: PURE RIMLESS / GALLERY WRAP (NO FRAME) */}
            <div className="p-3.5 bg-stone-100/90 rounded-2xl border border-stone-200/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-800 flex items-center justify-center text-sm font-bold shrink-0">
                  ✓
                </span>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Hanging on Wall: No Frame (Modern Gallery Wrap)
                  </span>
                  <span className="text-[11px] text-stone-600 block">
                    Clean, seamless edges mounted flush on your wall
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                Frameless (৳ 0)
              </span>
            </div>

            {/* STEP 3: 2-3mm SLIM EDGE BORDER COLOR (CUSTOMIZABLE ACCENT) */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>3. Fine Edge / Border (2–3mm)</span>
                </label>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Customizable Color • Free (৳ 0)
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Normally canvas prints hang rimless. You can optionally add a subtle 2–3mm fine edge border around the artwork in your preferred accent color:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SLIM_BORDER_OPTIONS.map(opt => {
                  const isSelected = selectedBorder.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedBorder(opt)}
                      className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-2xs flex items-center justify-center"
                        style={{
                          backgroundColor: opt.id === 'none' ? '#f5f5f4' : opt.color,
                        }}
                      >
                        {opt.id === 'none' ? (
                          <span className="text-[9px] text-stone-400 font-bold">✕</span>
                        ) : isSelected ? (
                          <Check className={`w-3 h-3 ${opt.textDark ? 'text-stone-900' : 'text-white'}`} />
                        ) : null}
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-stone-900 block truncate">
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {opt.id === 'none' ? 'Full bleed' : '2.5mm rim accent'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY STEPPER */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900 text-sm">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 transition rounded-l-xl cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-stone-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-100 transition rounded-r-xl cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 block">Subtotal</span>
                <span className="text-2xl font-black text-amber-700">
                  ৳ {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS (ADD TO BAG, DIRECT COD ORDER, WHATSAPP) */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="w-full bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <span>Order Now (Cash on Delivery)</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Direct WhatsApp Ordering */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 text-sm text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Order via WhatsApp (+880 1972-304749)</span>
              </a>
            </div>

            {/* Production Specifications Card */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/90 shadow-2xs space-y-3 text-xs text-stone-600">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Museum-Grade Specifications</span>
              </h4>
              <ul className="space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Archival Pigment Inks:</strong> 12-color Japanese archival pigments for deep contrast and rich color depth.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>UV Protective Finish:</strong> Waterproof satin coating shields against indoor sunlight and fading.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Dhaka Workshop:</strong> Crafted by experienced local artisans with precision edge wrapping.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* 3. LIGHTBOX MODAL FOR FULLSCREEN INSPECTION */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition cursor-pointer z-20"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center">
            <div className="relative inline-block">
              <img
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-[82vh] object-contain rounded-none shadow-2xl block"
              />
              {/* 2-3mm Slim Edge/Border (Customizable Color) in Zoom View */}
              {selectedBorder.id !== 'none' && (
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    border: selectedBorder.borderCss
                  }}
                />
              )}
            </div>
            <div className="mt-3 text-center text-white">
              <h3 className="font-serif font-bold text-lg">{product.title}</h3>
              <p className="text-xs text-stone-400">
                {product.category} • {physWidth}″ × {physHeight}″ ({cmWidth} × {cmHeight} cm) • {selectedBorder.name} • High-Resolution Archival Display
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Curated Recommendations ("You May Also Like") */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                More Artworks
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-950">
                You May Also Like
              </h3>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-amber-800 hover:text-stone-950 flex items-center gap-1 transition"
            >
              <span>View All Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <Link
                key={rel.id}
                href={`/products/${rel.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-56 bg-stone-900 overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {rel.category}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-stone-950/85 backdrop-blur-xs text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-500/20">
                    From ৳ {rel.basePrice}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {rel.details || rel.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 mt-3 block group-hover:translate-x-1 transition-transform">
                    View Details &amp; Sizes →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
