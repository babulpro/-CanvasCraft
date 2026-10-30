'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';
import { STANDARD_SIZES } from '@/data/combo-packages';
import { Product, SizeOption, MaterialType } from '@/types';
import { useCart } from '@/context/CartContext';
import CanvasCard from '@/components/products/CanvasCard';
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
import toast from 'react-hot-toast';

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
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(!product);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(STANDARD_SIZES[3]); // 16x24 default
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('pvc');
  const [selectedBorder, setSelectedBorder] = useState<SlimBorderOption>(SLIM_BORDER_OPTIONS[0]); // Default: None (Full Bleed)
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'room' | 'studio'>('room');
  const [wallColor, setWallColor] = useState(WALL_COLORS[0]); // Original Sunlit White default

  // Always fetch latest products catalog from database/API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setCatalogProducts(data.products);
          const found = data.products.find((p: Product) => p.id === productId);
          if (found) {
            setProduct(found);
          }
        }
      })
      .catch(err => {
        console.warn('Error fetching product catalog:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  // Loading Skeleton State
  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-8 aspect-[4/3] bg-stone-200 dark:bg-stone-800 rounded-3xl"></div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-xl w-3/4"></div>
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-lg w-1/3"></div>
            <div className="h-24 bg-stone-200 dark:bg-stone-800 rounded-2xl"></div>
            <div className="h-40 bg-stone-200 dark:bg-stone-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold">
          ?
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
          Artwork Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
          The requested artwork could not be loaded or may have been updated.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-bold px-6 py-3 rounded-full text-sm transition"
        >
          <span>Browse All Artworks</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Orientation logic
  const isLandscape = product.orientation === 'landscape';
  const isSquare = product.orientation === 'square';

  // Physical inches based on orientation
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

  // Exact centimeters
  const cmWidth = Math.round(physWidth * 2.54);
  const cmHeight = Math.round(physHeight * 2.54);

  // Living room wall perspective scale calculation
  // Maps physical inches to proportional wall width footprints:
  // - 16×24″ sits at the prime ~19.5% wall width above the 84″ sofa
  // - Smaller sizes (6×8″ Mini Tile, 8×12″ Classic Board, 12×16″ Medium Print) scale down cleanly and visibly
  // - Grand sizes (20×30″, 24×36″) expand impressively across the wall
  const artWidthPct = isSquare
    ? Math.round((10.5 + ((physWidth - 6) / 18) * 24) * 10) / 10
    : isLandscape
    ? Math.round((13.5 + ((physWidth - 8) / 28) * 28.5) * 10) / 10
    : Math.round((9.5 + ((physWidth - 6) / 18) * 18) * 10) / 10;

  // Dynamic Pricing Calculation
  const basePrice = selectedMaterial === 'pvc' ? selectedSize.pricePvc : selectedSize.priceCanvas;
  const unitPrice = basePrice;
  const totalPrice = unitPrice * quantity;

  // Add to Cart handler
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      category: product.category || 'Modern Canvas Art',
      image: product.image,
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

  // Direct Order Now handler
  const handleOrderNow = () => {
    addItem({
      productId: product.id,
      title: product.title,
      category: product.category || 'Modern Canvas Art',
      image: product.image,
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
    `• Canvas ID: ${product.id}\n` +
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

  // All other canvas artworks from the EXACT SAME CATEGORY as this canvas
  const sameCategoryProducts = catalogProducts.filter(
    p => p.id !== product.id && p.category === product.category
  );
  const relatedProducts = sameCategoryProducts.length > 0
    ? sameCategoryProducts
    : catalogProducts.filter(p => p.id !== product.id);

  return (
    <div className="bg-[#faf8f5] dark:bg-[#0c0a09] min-h-screen pb-16 transition-colors duration-200">
      
      {/* 1. Breadcrumbs Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-[#141210]/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-stone-900 dark:hover:text-stone-100 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link href="/products" className="hover:text-stone-900 dark:hover:text-stone-100 transition">
            All Artworks
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link
            href={`/products?cat=${encodeURIComponent(product.category)}`}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[200px]">
            {product.title}
          </span>
        </div>
      </div>

      {/* 2. Main Product Showcase & Configurator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-start">
          
          {/* Left Column: Interactive Proportional Size Preview & Room View */}
          <div className="w-full lg:col-span-7 xl:col-span-8 space-y-3 lg:space-y-4 sticky top-16 sm:top-20 lg:top-24 z-30 bg-[#faf8f5] dark:bg-[#0c0a09] pt-1 pb-3 lg:pb-0 border-b border-stone-200/90 dark:border-stone-800/90 lg:border-b-0 shadow-xs lg:shadow-none transition-colors">
            
            {/* View Mode Controls Bar */}
            <div className="flex items-center justify-between gap-2 p-1.5 bg-stone-900/5 dark:bg-stone-800/40 rounded-2xl border border-stone-200/90 dark:border-stone-800">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('room')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'room'
                      ? 'bg-white dark:bg-[#1c1917] text-stone-950 dark:text-stone-100 shadow-xs border border-stone-200/80 dark:border-stone-700'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Sofa className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Living Room View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('studio')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'studio'
                      ? 'bg-white dark:bg-[#1c1917] text-stone-950 dark:text-stone-100 shadow-xs border border-stone-200/80 dark:border-stone-700'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Studio Detail</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 flex items-center gap-1 transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

            {/* Main Visual Preview Display Area */}
            {viewMode === 'room' ? (
              /* Photorealistic Living Room Scene */
              <div className="relative w-full aspect-[4/3] max-h-[46vh] sm:max-h-[620px] xl:max-h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-800/15 dark:border-stone-800 bg-stone-900 select-none">
                
                {/* 1. Photorealistic Living Room Scene */}
                <Image
                  key={wallColor.id}
                  src={wallColor.imageSrc}
                  alt={`Living Room with ${wallColor.name} Wall, Real Sofa and Tea Table`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover pointer-events-none select-none transition-all duration-300"
                />

                {/* 2. The Artwork on the Far Wall */}
                <div
                  className="absolute z-20 flex items-center justify-center pointer-events-none transition-all duration-500 ease-out"
                  style={{
                    left: '52.4%',
                    top: '30.5%',
                    width: `${artWidthPct}%`,
                    aspectRatio: `${physWidth} / ${physHeight}`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative w-full h-full cursor-zoom-in group/canvas pointer-events-auto"
                    style={{
                      boxShadow: 'none',
                      borderRadius: '0px'
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 80vw, 50vw"
                      className="object-cover select-none rounded-none block pointer-events-auto"
                    />

                    {/* Customizable 2-3mm Slim Edge/Border */}
                    {selectedBorder.id !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          border: selectedBorder.borderCss
                        }}
                      />
                    )}

                    {/* Subtle Satin Sheen */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/5 via-transparent to-white/10 opacity-40" />

                    <div className="absolute bottom-1 right-1 opacity-0 group-hover/canvas:opacity-100 transition-opacity bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none">
                      🔍 Tap to Zoom
                    </div>
                  </div>
                </div>

                {/* Perspective Scale Watermark */}
                <div className="absolute bottom-3 left-3 bg-stone-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-white flex items-center gap-2 border border-white/10 pointer-events-none shadow-sm z-30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-semibold">{selectedSize.label} ({physWidth}″ × {physHeight}″)</span>
                  <span className="text-stone-400 hidden sm:inline">• Frameless Studio Scale</span>
                </div>
              </div>
            ) : (
              /* Studio Detail View */
              <div className="relative w-full aspect-[4/3] max-h-[46vh] sm:max-h-[620px] xl:max-h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-[#faf8f5] dark:bg-[#141210] flex items-center justify-center p-4 sm:p-8 select-none">
                <div
                  className="relative transition-all duration-300 flex items-center justify-center max-w-[92%] max-h-[92%]"
                  style={{
                    aspectRatio: `${physWidth} / ${physHeight}`,
                    width: physWidth >= physHeight ? '100%' : 'auto',
                    height: physWidth >= physHeight ? 'auto' : '100%',
                  }}
                >
                  <div className="relative w-full h-full rounded-xs overflow-hidden border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-2xl">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 60vw"
                      className="object-cover block select-none"
                    />

                    {selectedBorder.id !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          border: selectedBorder.borderCss
                        }}
                      />
                    )}

                    <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-black/10" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-white flex items-center gap-2 border border-white/10 pointer-events-none shadow-sm z-30">
                  <span className="font-mono font-semibold">{product.title}</span>
                  <span className="text-stone-400">• High-Definition Studio View</span>
                </div>
              </div>
            )}

            {/* Wall Paint Swatch Palette */}
            {viewMode === 'room' && (
              <div className="p-2.5 sm:p-3.5 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Wall Color: <strong className="text-amber-800 dark:text-amber-400">{wallColor.name}</strong></span>
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:inline">
                    Preview on your home wall
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 custom-scrollbar">
                  {WALL_COLORS.map(col => {
                    const isSelected = wallColor.id === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setWallColor(col)}
                        title={col.name}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform cursor-pointer relative shrink-0 flex items-center justify-center ${
                          isSelected
                            ? 'border-amber-600 scale-110 shadow-md ring-2 ring-amber-400/50'
                            : 'border-stone-300 dark:border-stone-700 hover:scale-105'
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

            {/* Quick Benefits Banner (Desktop) */}
            <div className="hidden lg:grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
                <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Fast 48h Delivery</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Dhaka &amp; 64 Districts</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <span className="font-bold text-stone-900 dark:text-stone-100 block">COD Available</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">30% Adv • 70% Delivery</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Decade Guarantee</span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Fade-Proof Color</span>
              </div>
            </div>

            {/* Artwork Texture & Archival Guarantee Caption (Desktop) */}
            <div className="hidden lg:flex pt-1 px-1 items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>12-Color Archival Pigment Inks • Waterproof UV Seal</span>
              </span>
              <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500">
                Dhaka Handcrafted
              </span>
            </div>

          </div>

          {/* Right Column: Title, Details, Simplified 2-Step Ordering */}
          <div className="w-full lg:col-span-5 xl:col-span-4 space-y-6 pt-2 lg:pt-0">
            
            {/* Header & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500 text-xs gap-0.5">
                  {[0, 1, 2, 3, 4].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">4.9 / 5.0</span>
                <span className="text-xs text-stone-400 dark:text-stone-500">• Curated Gallery Artwork</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-100 leading-tight">
                {product.title}
              </h1>

              {/* Dynamic Price Display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-amber-700 dark:text-amber-400">
                  ৳ {totalPrice.toLocaleString()}
                </span>
                {quantity > 1 && (
                  <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    (৳ {unitPrice.toLocaleString()} / piece)
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  In Stock • Made in Dhaka
                </span>
              </div>

              <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {product.details || product.description || 'Museum-quality archival pigment artwork ready for statement living room displays and bedroom accent decor.'}
              </p>
            </div>

            {/* STEP 1: SIZING OPTIONS */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  1. Choose Canvas Size
                </label>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  Selected: <strong className="text-stone-900 dark:text-stone-100">{selectedSize.label}</strong> ({physWidth}″ × {physHeight}″)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
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
                          ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-xs ring-2 ring-amber-400'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1c1917] hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      {sz.badge && (
                        <span className="absolute -top-2.5 right-2 bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-2xs">
                          {sz.badge}
                        </span>
                      )}
                      <span className="font-bold text-stone-900 dark:text-stone-100 block text-sm leading-tight">
                        {sz.label}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                        {sz.sub}
                      </span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400 block mt-1.5">
                        ৳ {price}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-stone-500 dark:text-stone-400 italic pt-1">
                💡 Tip: Preview displays true perspective scale hanging on the far wall above your 84″ sofa.
              </p>
            </div>

            {/* STEP 2: MATERIAL SELECTION */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                2. Choose Material
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMaterial('pvc')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    selectedMaterial === 'pvc'
                      ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-xs ring-2 ring-amber-400'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1c1917] hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">3mm Rigid PVC Board</span>
                    {selectedMaterial === 'pvc' && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Ultra-light, durable, high-density smooth finish. Damage-free, easy wall mounting.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMaterial('canvas')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    selectedMaterial === 'canvas'
                      ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-xs ring-2 ring-amber-400'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1c1917] hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">1.25″ Pine Wood Canvas</span>
                    {selectedMaterial === 'canvas' && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Museum gallery wrap on solid kiln-dried pine wood stretcher bars. Deep dimensional profile.
                  </p>
                </button>
              </div>
            </div>

            {/* HANGING STYLE: PURE RIMLESS / GALLERY WRAP */}
            <div className="p-3.5 bg-stone-100/90 dark:bg-stone-900/90 rounded-2xl border border-stone-200/90 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 dark:bg-amber-400/20 text-amber-800 dark:text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
                  ✓
                </span>
                <div>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Hanging on Wall: No Frame (Modern Gallery Wrap)
                  </span>
                  <span className="text-[11px] text-stone-600 dark:text-stone-400 block">
                    Clean, seamless edges mounted flush on your wall
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                Frameless (৳ 0)
              </span>
            </div>

            {/* STEP 3: 2-3mm SLIM EDGE BORDER COLOR */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>3. Fine Edge / Border (2–3mm)</span>
                </label>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Customizable Color • Free (৳ 0)
                </span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400">
                Normally canvas prints hang rimless. You can optionally add a subtle 2–3mm fine edge border around the artwork in your preferred accent color:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {SLIM_BORDER_OPTIONS.map(opt => {
                  const isSelected = selectedBorder.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedBorder(opt)}
                      className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-amber-400 shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1c1917] hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700 shrink-0 shadow-2xs flex items-center justify-center"
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
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block truncate">
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                          {opt.id === 'none' ? 'Full bleed' : '2.5mm rim accent'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY STEPPER */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">Quantity:</span>
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-900 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition rounded-l-xl cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition rounded-r-xl cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 dark:text-stone-400 block">Subtotal</span>
                <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
                  ৳ {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
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
                  className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 active:bg-stone-950 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
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
                onClick={() => toast.success('Connecting with CanvasCraft WhatsApp Concierge...', { id: 'wa-connect' })}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 text-sm text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Order via WhatsApp</span>
              </a>
            </div>

            {/* Quick Benefits Banner & Guarantee (Mobile) */}
            <div className="lg:hidden space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-900 dark:text-stone-100 block text-[11px]">Fast 48h Delivery</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">64 Districts</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-900 dark:text-stone-100 block text-[11px]">COD Available</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">30% Adv • 70% COD</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <span className="font-bold text-stone-900 dark:text-stone-100 block text-[11px]">Decade Guarantee</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Fade-Proof</span>
                </div>
              </div>

              <div className="pt-1 px-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>12-Color Archival Pigment Inks • UV Seal</span>
                </span>
                <span className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
                  Dhaka Handcrafted
                </span>
              </div>
            </div>

            {/* Production Specifications Card */}
            <div className="p-4 sm:p-5 bg-white dark:bg-[#1c1917] rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Museum-Grade Specifications</span>
              </h4>
              <ul className="space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Archival Pigment Inks:</strong> 12-color Japanese archival pigments for deep contrast and rich color depth.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>UV Protective Finish:</strong> Waterproof satin coating shields against indoor sunlight and fading.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
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
              <Image
                src={product.image}
                alt={product.title}
                width={1200}
                height={1600}
                sizes="(max-width: 1280px) 90vw, 1200px"
                className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-none block"
              />
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

      {/* 4. Curated Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-stone-200 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 inline-block mb-1.5">
                {product.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-100">
                More in {product.category}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Explore all other museum-grade canvas prints in the {product.category} collection
              </p>
            </div>
            <Link
              href={`/products?cat=${encodeURIComponent(product.category)}`}
              className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-400 hover:text-stone-950 dark:hover:text-stone-100 flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <span>View All {product.category} ({relatedProducts.length + 1})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <CanvasCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
