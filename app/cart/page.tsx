"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Clock,
  MapPin,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    comboSelectedIds,
    deliveryLocation,
    updateQuantity,
    removeItem,
    clearCart,
    toggleComboItem,
    autoSelectComboDeal,
    setDeliveryLocation,
    totals,
    getWhatsAppCheckoutUrl,
  } = useCart();

  // Checkout Form State
  const [customerName, setCustomerName] = useState(session?.user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If user signs in after opening page, sync name
  React.useEffect(() => {
    if (session?.user?.name && !customerName) {
      setCustomerName(session.user.name);
    }
  }, [session, customerName]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      const msg = "Please fill in your name, phone number, and delivery address.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (items.length === 0) {
      const msg = "Your shopping bag is empty.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          deliveryZone: deliveryLocation,
          notes: orderNotes.trim() || null,
          items,
          subtotal: totals.subtotal,
          comboDiscount: totals.comboDiscount,
          comboDealName: totals.comboDealName || null,
          deliveryFee: totals.deliveryCharge,
          total: totals.total,
          advancePaid: totals.advance,
          codDue: totals.due,
          paymentMethod: "bKash/Nagad (30% Adv) + COD",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order.");
      }

      toast.success("Order placed successfully! Redirecting...");
      clearCart();
      router.push(`/orders?placed=${data.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] dark:bg-[#0c0a09] transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>My Orders &amp; Tracking</span>
          </Link>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-100 flex items-center gap-2.5">
            <ShoppingBag className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <span>Your Shopping Bag &amp; Checkout</span>
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            Review your custom canvas selections, apply combo package savings, and finalize delivery across all 64 districts.
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center shadow-xs max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Your bag is currently empty
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 max-w-sm mx-auto">
              You haven&apos;t added any museum-grade canvas prints or custom photo boards yet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold shadow-md transition"
              >
                <span>Browse Art Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#combos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-300 text-xs font-bold transition border border-amber-300 dark:border-amber-800"
              >
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>View Combo Deals</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Items List & Combo Deals */}
            <div className="lg:col-span-7 space-y-6">
              {/* Combo Deal Selector Banner */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 dark:from-amber-950/30 dark:to-stone-900/60 p-5 rounded-2xl border border-amber-200/90 dark:border-amber-800/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Bundle &amp; Save Combo Deal (Max 6 Pcs)</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      totals.totalComboPieces >= 3
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    {totals.totalComboPieces} of 6 Pcs in Combo
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">
                  Check the box next to any 3 to 6 matching prints below to combine them into an official CanvasCraft Combo Package with up to 15% automatic discount.
                </p>

                {totals.comboDiscount > 0 ? (
                  <div className="bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{totals.comboDealName} Activated!</span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-black">
                      -৳{totals.comboDiscount.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={autoSelectComboDeal}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Select Best Combo Deal for My Bag</span>
                  </button>
                )}
              </div>

              {/* Items Table Card */}
              <div className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-stone-100 dark:divide-stone-800">
                <div className="p-4 bg-stone-50/70 dark:bg-stone-900/70 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase text-stone-700 dark:text-stone-300">
                    Artworks in Bag ({items.length} designs, {totals.totalPieces} pieces)
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-500 dark:text-stone-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Bag</span>
                  </button>
                </div>

                {items.map((item) => {
                  const isComboSelected = comboSelectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                        isComboSelected ? "bg-amber-50/40 dark:bg-amber-950/20" : "hover:bg-stone-50/50 dark:hover:bg-stone-800/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Artwork Preview */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 shadow-2xs">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="96px"
                          />
                          {item.comboImages && item.comboImages.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-stone-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                              {item.comboImages.length} Pcs
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-stone-600 dark:text-stone-400">
                            <span className="font-semibold text-stone-800 dark:text-stone-200">
                              {item.sizeLabel}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{item.materialName}</span>
                            <span>•</span>
                            <span className="capitalize">{item.frameName}</span>
                            {item.borderName && !item.borderName.toLowerCase().includes('none') && (
                              <>
                                <span>•</span>
                                <span className="text-amber-800 dark:text-amber-400 font-semibold">{item.borderName}</span>
                              </>
                            )}
                          </div>

                          {/* Combo Checkbox Toggle */}
                          <label className="inline-flex items-center gap-2 pt-1 text-xs text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isComboSelected}
                              onChange={() => toggleComboItem(item.id)}
                              className="w-4 h-4 text-amber-600 rounded border-stone-300 dark:border-stone-700 focus:ring-amber-500"
                            />
                            <span className="font-medium text-[11px]">
                              Include in Combo Discount (
                              {item.comboImages?.length || item.quantity} pcs)
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Right: Quantity & Pricing */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                            ৳ {item.totalPrice.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            ৳ {item.unitPrice.toLocaleString()} each
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity Counter */}
                          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800/80">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
                              title="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-stone-800 dark:text-stone-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
                              title="Increase"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                            title="Remove from bag"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quality & Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 dark:text-stone-300">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Cotton Archival Canvas</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Doorstep Delivery Across 64 Districts</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Museum Gallery Floating Frames</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Summary & Checkout Form */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Summary Box */}
              <div className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-3">
                  Order Summary
                </h3>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Delivery Zone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryLocation("dhaka")}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        deliveryLocation === "dhaka"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 ring-1 ring-amber-500"
                          : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Inside Dhaka</span>
                        <span>৳80</span>
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-normal mt-0.5">
                        24–48 Hours Express
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryLocation("outside")}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        deliveryLocation === "outside"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 ring-1 ring-amber-500"
                          : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Outside Dhaka</span>
                        <span>৳150</span>
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-normal mt-0.5">
                        All 64 Districts (3–4 Days)
                      </span>
                    </button>
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <span>Artwork Subtotal:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      ৳ {totals.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {totals.comboDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Combo Savings:</span>
                      <span>-৳ {totals.comboDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      ৳ {totals.deliveryCharge.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-black text-stone-900 dark:text-stone-100 pt-3 border-t border-stone-200 dark:border-stone-800">
                    <span>Total Amount:</span>
                    <span className="text-lg text-amber-700 dark:text-amber-400">
                      ৳ {totals.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Advance & COD Split */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 mt-2">
                    <div>
                      <span className="block text-stone-500 dark:text-stone-400 text-[10px]">
                        30% Advance (bKash/Nagad):
                      </span>
                      <strong className="text-stone-900 dark:text-stone-100 font-bold text-xs">
                        ৳ {totals.advance.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-stone-500 dark:text-stone-400 text-[10px]">
                        Remaining Cash on Delivery:
                      </span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        ৳ {totals.due.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Checkout Delivery Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-3.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Recipient Delivery Information
                  </h4>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Babul Hossain"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 shadow-2xs transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Phone Number (For Delivery &amp; bKash confirmation) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 shadow-2xs transition font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Full Delivery Address (House, Road, Area, District) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-3 pointer-events-none" />
                      <textarea
                        required
                        rows={2}
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="e.g. House 14, Road 5, Dhanmondi, Dhaka"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 shadow-2xs transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Order Notes (Optional framing or hanging instructions)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Please call before delivery"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 shadow-2xs transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                  >
                    <span>
                      {isSubmitting
                        ? "Registering Your Order..."
                        : `Confirm Order & Proceed (৳${totals.total.toLocaleString()})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* WhatsApp Alternative */}
                <div className="pt-2">
                  <div className="relative my-2 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200 dark:border-stone-800" />
                    </div>
                    <span className="relative bg-white dark:bg-[#1c1917] px-2 text-[10px] text-stone-400 uppercase font-mono">
                      or quick chat order
                    </span>
                  </div>

                  <a
                    href={getWhatsAppCheckoutUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order via WhatsApp (Instant Confirmation)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
