"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { OrderData } from "@/types";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const placedOrderNumber = searchParams.get("placed");
  const { data: session } = useSession();

  const [orders, setUsersOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(placedOrderNumber || "");
  const [searchResult, setSearchResult] = useState<OrderData[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch orders for logged-in user
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setUsersOrders(data.orders);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [session]);

  // Handle specific search by order number or phone
  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    setErrorMessage(null);

    try {
      const isPhone = /^[0-9+]+$/.test(query);
      const param = isPhone ? `phone=${encodeURIComponent(query)}` : `orderNumber=${encodeURIComponent(query)}`;
      const res = await fetch(`/api/orders?${param}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        setSearchResult(data.orders);
        if (data.orders.length === 0) {
          const msg = `No order found matching "${query}". Please check your order reference or phone number.`;
          setErrorMessage(msg);
          toast.error(msg);
        } else {
          toast.success(`Found ${data.orders.length} order(s)!`);
        }
      } else {
        const msg = data.error || "Failed to search order.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "Network error while searching for order.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSearchLoading(false);
    }
  };

  // Determine which orders to render: search results if active, otherwise user's orders
  const displayedOrders = searchResult !== null ? searchResult : orders;

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return {
          bg: "bg-blue-500/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-500/20 dark:border-blue-800",
          label: "Confirmed (Advance Received)",
        };
      case "IN_PRODUCTION":
        return {
          bg: "bg-purple-500/10 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border-purple-500/20 dark:border-purple-800",
          label: "In Production (Framing)",
        };
      case "SHIPPED":
        return {
          bg: "bg-cyan-500/10 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 border-cyan-500/20 dark:border-cyan-800",
          label: "Shipped (With Courier)",
        };
      case "DELIVERED":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-800",
          label: "Delivered (Paid in Full)",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-500/10 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-500/20 dark:border-red-800",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-500/20 dark:border-amber-800",
          label: "Pending Advance Confirmation",
        };
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] dark:bg-[#0c0a09] transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition"
          >
            <span>Explore More Art</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Success Banner if redirected from checkout */}
        {placedOrderNumber && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                  Congratulations! Your Order Was Successfully Placed!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  Your official order tracking reference is{" "}
                  <strong className="font-mono font-bold bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-950 dark:text-emerald-100">
                    {placedOrderNumber}
                  </strong>
                  . Our Dhaka fulfillment studio will contact you via WhatsApp / Phone for 30% advance confirmation before framing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-100 flex items-center gap-2.5">
              <Package className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <span>My Orders &amp; Delivery Tracking</span>
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              View your canvas print orders, monitor workshop progress, and access instant WhatsApp concierge support.
            </p>
          </div>

          <button
            onClick={fetchMyOrders}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 hover:border-amber-400 text-stone-700 dark:text-stone-300 text-xs font-semibold transition shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Order Tracking / Search Bar */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Track by Order Number (e.g. CC-2026-XXXX) or Phone Number..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 font-mono shadow-2xs transition"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={searchLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {searchLoading ? "Tracking..." : "Track Order"}
              </button>
              {searchResult !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchResult(null);
                    setSearchQuery("");
                    setErrorMessage(null);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold transition"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Orders Listing */}
        {loading && orders.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-stone-500 dark:text-stone-400 text-sm">
            <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>Retrieving your order records...</span>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
              No orders found
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-6">
              You haven&apos;t placed any canvas orders yet. Discover our curated collections or explore popular wall combo sets.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold transition shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Catalog</span>
              </Link>
              <Link
                href="/#combos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-300 text-xs font-bold transition border border-amber-300 dark:border-amber-800"
              >
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>View Combo Deals</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {displayedOrders.map((order) => {
              const status = getStatusBadge(order.status);
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              // WhatsApp support message
              const waText = encodeURIComponent(
                `Hello CanvasCraft! I am inquiring about my Order: ${order.orderNumber} placed by ${order.customerName}. Please share the current workshop progress.`
              );
              const waLink = `https://wa.me/8801972304749?text=${waText}`;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-5 bg-stone-50/70 dark:bg-stone-900/70 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${status.bg}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                        <span>Placed on {dateStr}</span>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-base font-bold text-amber-700 dark:text-amber-400">
                        ৳ {order.total.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        {order.items.length} artwork(s)
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Item Cards List */}
                    <div className="divide-y divide-stone-100 dark:divide-stone-800">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="64px"
                            />
                            {item.comboPieces && item.comboPieces > 1 && (
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                                {item.comboPieces} Pcs
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                              <span className="font-semibold text-stone-700 dark:text-stone-300">
                                {item.sizeLabel}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{item.material}</span>
                              <span>•</span>
                              <span className="capitalize">{item.frameType} Frame</span>
                            </div>
                            <div className="text-[11px] text-stone-800 dark:text-stone-200 font-medium mt-1">
                              ৳{item.unitPrice.toLocaleString()} × {item.quantity} ={" "}
                              <strong>৳{item.totalPrice.toLocaleString()}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Financial Summary Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                      {/* Recipient Details */}
                      <div className="space-y-1.5 bg-stone-50 dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                          Delivery Recipient
                        </span>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {order.customerName}
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                          <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span className="font-mono text-[11px]">
                            {order.customerPhone}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">
                            {order.customerAddress} ({order.deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
                          </span>
                        </div>
                        {order.notes && (
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 italic pt-1">
                            Note: &quot;{order.notes}&quot;
                          </div>
                        )}
                      </div>

                      {/* Payment Financial Breakdown */}
                      <div className="space-y-1.5 bg-stone-50 dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                          Payment Details
                        </span>
                        <div className="flex justify-between text-stone-600 dark:text-stone-400 text-[11px]">
                          <span>Subtotal:</span>
                          <span>৳ {order.subtotal.toLocaleString()}</span>
                        </div>
                        {order.comboDiscount > 0 && (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                            <span>Combo Savings:</span>
                            <span>-৳ {order.comboDiscount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-stone-600 dark:text-stone-400 text-[11px]">
                          <span>Delivery Fee:</span>
                          <span>৳ {order.deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-stone-900 dark:text-stone-100 font-bold border-t border-stone-200 dark:border-stone-800 pt-1 text-xs">
                          <span>Total Payable:</span>
                          <span>৳ {order.total.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-white dark:bg-[#1c1917] p-2 rounded-lg border border-stone-200 dark:border-stone-800 mt-1">
                          <div>
                            <span className="text-stone-400 block">30% Advance:</span>
                            <span className="font-bold text-stone-800 dark:text-stone-200">
                              ৳ {order.advancePaid.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400 block">COD Due:</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              ৳ {order.codDue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Protected by CanvasCraft 100% Quality Assurance</span>
                      </div>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat on WhatsApp About Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#faf9f6] dark:bg-[#0c0a09]">
          <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400 text-sm">
            <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading orders directory...</span>
          </div>
        </div>
      }
    >
      <OrdersPageContent />
    </React.Suspense>
  );
}
