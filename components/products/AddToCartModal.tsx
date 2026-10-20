'use client';

import React, { useState, useEffect } from 'react';
import { Product, SizeOption, FrameOption, MaterialType } from '@/types';
import { STANDARD_SIZES } from '@/data/combo-packages';
import { FRAME_OPTIONS } from '@/data/frames';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, ShieldCheck, Check } from 'lucide-react';

interface AddToCartModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function AddToCartModal({ product, onClose }: AddToCartModalProps) {
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<SizeOption>(STANDARD_SIZES[3]); // 16x24 default
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('pvc');
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(FRAME_OPTIONS[0]); // Rimless default
  const [quantity, setQuantity] = useState(1);

  // Reset when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(STANDARD_SIZES[3]);
      setSelectedMaterial('pvc');
      setSelectedFrame(FRAME_OPTIONS[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const basePrice = selectedMaterial === 'pvc' ? selectedSize.pricePvc : selectedSize.priceCanvas;
  const unitPrice = basePrice + selectedFrame.price;
  const totalPrice = unitPrice * quantity;

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
      materialName: selectedMaterial === 'pvc' ? '3mm Rigid PVC Board (Free 3M Tape)' : '1.25″ Pine Wood Canvas',
      frameType: selectedFrame.type,
      frameName: selectedFrame.name,
      basePrice,
      framePrice: selectedFrame.price,
      unitPrice,
      quantity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
              Configure Your Canvas
            </span>
            <h3 className="text-base sm:text-lg font-bold truncate max-w-sm sm:max-w-md">{product.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-sm">
          
          {/* Top Product Summary */}
          <div className="flex gap-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-300">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {product.category}
                </span>
                <span className="text-xs text-stone-500 capitalize">
                  {product.orientation} Orientation
                </span>
              </div>
              <p className="font-bold text-stone-900 text-base truncate">{product.title}</p>
              {product.details && (
                <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                  {product.details}
                </p>
              )}
            </div>
          </div>

          {/* Sizing Picker */}
          <div>
            <label className="text-sm font-bold text-stone-900 block mb-2">1. Choose Canvas Size</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STANDARD_SIZES.map(sz => {
                const isSelected = selectedSize.code === sz.code;
                const price = selectedMaterial === 'pvc' ? sz.pricePvc : sz.priceCanvas;
                return (
                  <button
                    key={sz.code}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                        : 'border-stone-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    {sz.badge && (
                      <span className="absolute -top-2.5 right-2 bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-2xs">
                        {sz.badge}
                      </span>
                    )}
                    <span className="font-bold text-stone-900 block text-sm sm:text-base leading-tight">{sz.label}</span>
                    <span className="text-xs text-stone-500 block mt-0.5">{sz.sub}</span>
                    <span className="text-sm font-black text-amber-700 block mt-1.5">৳ {price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material Selector */}
          <div>
            <label className="text-sm font-bold text-stone-900 block mb-2">2. Choose Material</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMaterial('pvc')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedMaterial === 'pvc'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900 text-sm">3mm Rigid PVC Board</span>
                  {selectedMaterial === 'pvc' && <Check className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">Includes heavy-duty 3M mounting tape. Ultra-light, no wall drilling needed.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMaterial('canvas')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedMaterial === 'canvas'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900 text-sm">1.25″ Pine Wood Canvas</span>
                  {selectedMaterial === 'canvas' && <Check className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">Museum gallery wrap on solid kiln-dried pine wood stretcher bars.</p>
              </button>
            </div>
          </div>

          {/* Frame Moulding Selector */}
          <div>
            <label className="text-sm font-bold text-stone-900 block mb-2">3. Floating Frame Moulding</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {FRAME_OPTIONS.map(fr => {
                const isSelected = selectedFrame.type === fr.type;
                return (
                  <button
                    key={fr.type}
                    type="button"
                    onClick={() => setSelectedFrame(fr)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400'
                        : 'border-stone-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-2xs mb-1.5"
                      style={{ backgroundColor: fr.color }}
                    />
                    <span className="text-xs font-bold text-stone-900 leading-tight block">{fr.name}</span>
                    <span className="text-xs font-bold text-amber-700 mt-1 block">{fr.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper & Price Summary */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-stone-800 text-sm">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-200 transition rounded-l"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-stone-600 hover:bg-stone-200 transition rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-500 block">Subtotal</span>
              <span className="text-xl font-black text-amber-700">৳ {totalPrice.toLocaleString()}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Archival Print Guarantee</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 px-7 rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>
        </div>

      </div>
    </div>
  );
}
