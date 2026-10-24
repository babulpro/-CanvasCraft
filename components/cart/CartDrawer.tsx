'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, Truck, ShieldCheck, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Package } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    comboSelectedIds,
    deliveryLocation,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    toggleComboItem,
    autoSelectComboDeal,
    setDeliveryLocation,
    totals,
    getWhatsAppCheckoutUrl
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-Over Drawer */}
      <div className="relative w-full max-w-md bg-[#faf9f6] h-full shadow-2xl flex flex-col z-10 border-l border-stone-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">Your Shopping Bag</h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {totals.totalPieces} pcs
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 mb-1">Your bag is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                Browse our curated art collections to choose the perfect canvas size for your home.
              </p>
              <button
                onClick={closeDrawer}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* COMBO DEAL MAKER BANNER (Max 6 Pieces) */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-3.5 rounded-2xl border border-amber-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Combo Deal Maker (Max 6 Pcs)</span>
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      totals.totalComboPieces >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {totals.totalComboPieces} of 6 Pcs in Combo
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-2.5">
                  Bundle 3 to 6 pieces to unlock discounted package pricing (or 15% off)!
                </p>

                {totals.comboDiscount > 0 ? (
                  <div className="bg-emerald-100/90 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{totals.comboDealName}</span>
                    </span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs shrink-0">
                      Saved ৳ {totals.comboDiscount}
                    </span>
                  </div>
                ) : totals.totalComboPieces > 0 && totals.totalComboPieces < 3 ? (
                  <div className="text-xs text-amber-800 bg-amber-100/80 px-2.5 py-1.5 rounded-xl mb-2.5 flex items-center gap-1">
                    <span>Add {3 - totals.totalComboPieces} more piece to activate the Combo Deal discount!</span>
                  </div>
                ) : totals.totalPieces >= 3 && totals.totalComboPieces === 0 ? (
                  <button
                    onClick={autoSelectComboDeal}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 mb-2.5 cursor-pointer"
                  >
                    <span>Auto-Bundle eligible {Math.min(6, totals.totalPieces)} pieces as Combo Deal</span>
                  </button>
                ) : null}

                {/* Visual 6 Mini Slots */}
                <div className="grid grid-cols-6 gap-1">
                  {[0, 1, 2, 3, 4, 5].map(idx => {
                    const isFilled = idx < totals.totalComboPieces;
                    return (
                      <div
                        key={idx}
                        className={`h-7 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold transition ${
                          isFilled
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-white/80 border-dashed border-stone-300 text-stone-400'
                        }`}
                      >
                        {isFilled ? '✓' : '#' + (idx + 1)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map(it => {
                  const isSelectedInCombo = comboSelectedIds.includes(it.id);
                  return (
                    <div
                      key={it.id}
                      className={`p-3.5 bg-white rounded-2xl border transition shadow-2xs flex flex-col gap-2 relative ${
                        isSelectedInCombo ? 'border-amber-500 ring-1 ring-amber-400 bg-amber-50/20' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 relative border border-stone-200">
                          <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] font-mono px-1 rounded">
                            {it.sizeCode}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-sm font-bold text-stone-900 truncate leading-tight">{it.title}</h4>
                              <button
                                onClick={() => removeItem(it.id)}
                                className="text-stone-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-stone-500 space-y-0.5 mt-1">
                              <p className="font-medium text-stone-700">
                                {it.sizeLabel} • <span>{it.material === 'pvc' ? '3mm PVC Board' : 'Pine Canvas'}</span>
                              </p>
                              <p className="text-stone-500">Frame: <strong className="text-stone-800">{it.frameName}</strong></p>
                              {it.borderName && !it.borderName.toLowerCase().includes('none') && (
                                <p className="text-stone-500">Border Accent: <strong className="text-amber-800">{it.borderName}</strong></p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Multi-Photo Thumbnails Grid for Combo Package items */}
                      {it.comboImages && it.comboImages.length > 0 && (
                        <div className="pt-2 border-t border-stone-100">
                          <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1.5">
                            <span>Attached Custom Photos ({it.comboImages.length} Pcs):</span>
                            <span className="text-emerald-700">✓ All Ready</span>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                            {it.comboImages.map((p, pIdx) => (
                              <div
                                key={pIdx}
                                className="relative rounded-md overflow-hidden bg-stone-900 border border-stone-200 h-9"
                                title={p.fileName || `Photo #${pIdx + 1}`}
                              >
                                <img src={p.thumb || p.src} alt="Piece" className="w-full h-full object-cover" />
                                <span className="absolute top-0.5 left-0.5 bg-black/75 text-white text-[8px] font-mono font-bold px-1 rounded">
                                  #{pIdx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stepper, Price & Combo Toggle */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 text-xs">
                            <button
                              onClick={() => updateQuantity(it.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-l transition font-bold cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-stone-900">{it.quantity}</span>
                            <button
                              onClick={() => updateQuantity(it.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-r transition font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-black text-stone-900">৳ {it.totalPrice.toLocaleString()}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleComboItem(it.id)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                            isSelectedInCombo
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-stone-100 text-stone-600 border-stone-200 hover:border-amber-400'
                          }`}
                        >
                          <span>{isSelectedInCombo ? '✓ In Combo' : '+ Combo'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 shadow-lg space-y-3.5">
            
            {/* Delivery Location Selector */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-800 block mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" /> Delivery Location:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('dhaka')}
                  className={`py-1.5 px-2 rounded-lg text-center font-bold border transition cursor-pointer text-xs ${
                    deliveryLocation === 'dhaka'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-300'
                  }`}
                >
                  Dhaka City (৳ 80)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('outside')}
                  className={`py-1.5 px-2 rounded-lg text-center font-bold border transition cursor-pointer text-xs ${
                    deliveryLocation === 'outside'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-300'
                  }`}
                >
                  Outside Dhaka (৳ 150)
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs sm:text-sm text-stone-600 pb-2 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <span>Items Subtotal ({totals.totalPieces} pcs):</span>
                <span className="font-mono font-bold text-stone-900">৳ {totals.rawSubtotal.toLocaleString()}</span>
              </div>

              {totals.comboDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Combo Deal Discount:</span>
                  <span className="font-mono">− ৳ {totals.comboDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Fee ({deliveryLocation === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}):</span>
                <span className="font-mono font-bold text-stone-900">৳ {totals.deliveryCharge}</span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Payable:</span>
                <span className="text-lg text-amber-700">৳ {totals.total.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-100 p-2.5 rounded-lg text-stone-600 mt-1">
                <div>
                  <span className="block text-stone-500">30% Advance (bKash):</span>
                  <strong className="text-stone-900 font-bold">৳ {totals.advance.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="block text-stone-500">Remaining COD:</span>
                  <strong className="text-emerald-700 font-bold">৳ {totals.due.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Full Cart & Checkout Page Link */}
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 px-4 rounded-xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </Link>

            {/* WhatsApp Order Action */}
            <a
              href={getWhatsAppCheckoutUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Place Order via WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-xs text-stone-500 px-1 pt-1">
              <Link
                href="/orders"
                onClick={closeDrawer}
                className="hover:text-amber-700 transition flex items-center gap-1 font-medium"
              >
                <Package className="w-4 h-4 text-amber-600" />
                <span>Track My Orders</span>
              </Link>
              <button onClick={clearCart} className="hover:text-red-500 transition cursor-pointer text-xs">
                Clear Cart
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
