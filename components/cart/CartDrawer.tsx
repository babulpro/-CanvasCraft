'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, Truck, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="relative w-full max-w-md bg-[#faf9f6] dark:bg-[#0c0a09] h-full shadow-2xl flex flex-col z-10 border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300 transition-colors">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#141210] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">Your Shopping Bag</h3>
            <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {totals.totalPieces} pcs
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">Your bag is empty</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto mb-6">
                Browse our curated art collections to choose the perfect canvas size for your home.
              </p>
              <button
                onClick={closeDrawer}
                className="bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* COMBO DEAL MAKER BANNER (Max 6 Pieces) */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/30 dark:to-stone-900/60 p-3.5 rounded-2xl border border-amber-200/90 dark:border-amber-800/80 shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Combo Deal Maker (Max 6 Pcs)</span>
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      totals.totalComboPieces >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {totals.totalComboPieces} of 6 Pcs in Combo
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 mb-2.5">
                  Bundle 3 to 6 pieces to unlock discounted package pricing (or 15% off)!
                </p>

                {totals.comboDiscount > 0 ? (
                  <div className="bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{totals.comboDealName}</span>
                    </span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs shrink-0">
                      Saved ৳ {totals.comboDiscount}
                    </span>
                  </div>
                ) : totals.totalComboPieces > 0 && totals.totalComboPieces < 3 ? (
                  <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-1.5 rounded-xl mb-2.5 flex items-center gap-1 border border-amber-200 dark:border-amber-800">
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
                            : 'bg-white/80 dark:bg-stone-900 border-dashed border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-500'
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
                      className={`p-3.5 bg-white dark:bg-[#1c1917] rounded-2xl border transition shadow-2xs flex flex-col gap-2 relative ${
                        isSelectedInCombo
                          ? 'border-amber-500 ring-1 ring-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
                          : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 relative border border-stone-200 dark:border-stone-800">
                          <Image src={it.image} alt={it.title} fill sizes="64px" className="object-cover" />
                          <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] font-mono px-1 rounded z-10">
                            {it.sizeCode}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate leading-tight">{it.title}</h4>
                              <button
                                onClick={() => removeItem(it.id)}
                                className="text-stone-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-stone-500 dark:text-stone-400 space-y-0.5 mt-1">
                              <p className="font-medium text-stone-700 dark:text-stone-300">
                                {it.sizeLabel} • <span>{it.material === 'pvc' ? '3mm PVC Board' : 'Pine Canvas'}</span>
                              </p>
                              <p className="text-stone-500 dark:text-stone-400">Frame: <strong className="text-stone-800 dark:text-stone-200">{it.frameName}</strong></p>
                              {it.borderName && !it.borderName.toLowerCase().includes('none') && (
                                <p className="text-stone-500 dark:text-stone-400">Border Accent: <strong className="text-amber-800 dark:text-amber-400">{it.borderName}</strong></p>
                              )}
                            </div>
                          </div>

                          {/* Price & Quantity */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                            <span className="text-sm font-bold text-stone-950 dark:text-stone-100">
                              ৳ {(it.unitPrice * it.quantity).toLocaleString()}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800/80">
                              <button
                                onClick={() => updateQuantity(it.id, it.quantity - 1)}
                                className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer text-xs"
                              >
                                −
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                                {it.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(it.id, it.quantity + 1)}
                                className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Combo Bundle Checkbox */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
                          <input
                            type="checkbox"
                            checked={isSelectedInCombo}
                            onChange={() => toggleComboItem(it.id)}
                            className="w-3.5 h-3.5 text-amber-600 rounded border-stone-300 dark:border-stone-700 focus:ring-amber-500 cursor-pointer"
                          />
                          <span className="font-medium">Include in Combo Deal</span>
                        </label>
                        {isSelectedInCombo && (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            Combo Active
                          </span>
                        )}
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
          <div className="p-4 sm:p-5 bg-white dark:bg-[#141210] border-t border-stone-200 dark:border-stone-800 shadow-lg space-y-3.5">
            
            {/* Delivery Location Selector */}
            <div className="bg-stone-50 dark:bg-stone-900/80 p-3 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200 block mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Delivery Location:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('dhaka')}
                  className={`py-1.5 px-2 rounded-lg text-center font-bold border transition cursor-pointer text-xs ${
                    deliveryLocation === 'dhaka'
                      ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 border-stone-900 dark:border-amber-500 shadow-2xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                  }`}
                >
                  Dhaka City (৳ 80)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('outside')}
                  className={`py-1.5 px-2 rounded-lg text-center font-bold border transition cursor-pointer text-xs ${
                    deliveryLocation === 'outside'
                      ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 border-stone-900 dark:border-amber-500 shadow-2xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                  }`}
                >
                  Outside Dhaka (৳ 150)
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <span>Items Subtotal ({totals.totalPieces} pcs):</span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">৳ {totals.rawSubtotal.toLocaleString()}</span>
              </div>

              {totals.comboDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>Combo Deal Discount:</span>
                  <span className="font-mono">− ৳ {totals.comboDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Fee ({deliveryLocation === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}):</span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">৳ {totals.deliveryCharge}</span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>Total Payable:</span>
                <span className="text-lg text-amber-700 dark:text-amber-400">৳ {totals.total.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-100 dark:bg-stone-900 p-2.5 rounded-lg text-stone-600 dark:text-stone-400 mt-1 border border-stone-200 dark:border-stone-800">
                <div>
                  <span className="block text-stone-500 dark:text-stone-400">30% Advance (bKash):</span>
                  <strong className="text-stone-900 dark:text-stone-100 font-bold">৳ {totals.advance.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="block text-stone-500 dark:text-stone-400">Remaining COD:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-bold">৳ {totals.due.toLocaleString()}</strong>
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
              onClick={() => toast.success('Connecting with CanvasCraft WhatsApp Concierge...', { id: 'wa-checkout' })}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Place Order via WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1 pt-1">
              <Link
                href="/orders"
                onClick={closeDrawer}
                className="hover:text-amber-700 dark:hover:text-amber-400 transition flex items-center gap-1 font-medium"
              >
                <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
