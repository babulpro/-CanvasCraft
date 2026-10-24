"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { AuthUser, UserRole } from "@/types";
import {
  User,
  AtSign,
  ShieldCheck,
  ShieldAlert,
  Shield,
  LogOut,
  Palette,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  PlusCircle,
  KeyRound,
  Users,
  Package,
  Grid,
  AlertTriangle,
  Flame,
} from "lucide-react";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#faf8f5]">
        <div className="flex items-center gap-3 text-stone-600 text-sm">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading membership profile...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#faf8f5]">
        <div className="max-w-md w-full bg-white border border-stone-200/90 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-950 font-bold mb-2">
            Sign In Required
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            Please log in with your email or social account to view your CanvasCraft membership profile.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-md transition active:scale-98"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user as AuthUser & Record<string, unknown>;
  const role: UserRole = (user.role as UserRole) || "user";

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Error Notification if redirected from protected admin files */}
        {errorParam === "admin_required" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3.5 text-amber-900 text-xs shadow-sm animate-in fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-950 text-sm">
                Administrator Access Required
              </h4>
              <p className="text-stone-700 leading-relaxed">
                The administrative file or dashboard you tried to access requires active <span className="text-amber-800 font-bold uppercase">Admin</span> credentials. Your current account role is <span className="font-mono uppercase font-bold text-stone-950">[{role}]</span>.
              </p>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-lg border border-stone-800">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-serif font-bold text-stone-950">
                    {user.name || "Collector"}
                  </h1>

                  {/* Role Badges */}
                  {role === "admin" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold font-mono">
                      <ShieldAlert className="w-3 h-3" />
                      ADMINISTRATOR
                    </span>
                  )}
                  {role === "moderator" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold font-mono">
                      <Shield className="w-3 h-3" />
                      MODERATOR
                    </span>
                  )}
                  {role === "user" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Member
                    </span>
                  )}
                </div>
                {user.username && (
                  <p className="text-sm text-amber-800 font-mono mt-0.5 font-bold">
                    @{user.username}
                  </p>
                )}
                <p className="text-xs text-stone-500 mt-1">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-red-700 border border-stone-200 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Details & Role Metrics */}
        {/* Account Details & Role Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="text-stone-500 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Account Type</span>
            </div>
            <p className="text-base font-bold text-stone-900 capitalize">
              {role === "admin"
                ? "Executive Admin"
                : role === "moderator"
                ? "Content Moderator"
                : "Collector Member"}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {role === "admin"
                ? "Full administrative control"
                : role === "moderator"
                ? "Assisted catalog management"
                : "Active customer privileges"}
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="text-stone-500 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role Activation</span>
            </div>
            <p className="text-base font-bold text-emerald-700">
              Admin-Governed
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Roles can only be turned on by authorized administrators
            </p>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="text-stone-500 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tier Benefits</span>
            </div>
            <p className="text-base font-bold text-stone-900">
              Archival Quality
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              300+ GSM Archival Canvas &amp; Pine Frames
            </p>
          </div>
        </div>

        {/* Dedicated Navigation: My Orders & My Shopping Cart */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-950 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              <span>Shopping &amp; Order Services</span>
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Track live deliveries, view past orders, and inspect your full shopping bag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              href="/orders"
              className="flex items-center justify-between p-4 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition">
                    My Orders &amp; Tracking
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Live delivery status &amp; order history
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between p-4 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-rose-400 hover:bg-rose-50/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-rose-800 transition">
                    My Shopping Bag &amp; Details
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Inspect combo discounts &amp; place order
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-rose-700 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Administrator Operations Control (Visible ONLY to Admins) */}
        {role === "admin" && (
          <div className="bg-stone-900 text-stone-100 border border-red-500/30 rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Administrator Executive Control</span>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Store Operations &amp; Catalog Management
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                You have master authority to manage catalog inventory, delete artwork, and activate Moderator / Admin permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/admin"
                className="flex items-center justify-between p-4 rounded-xl bg-stone-800/80 border border-amber-500/40 hover:border-amber-400 transition group sm:col-span-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100 group-hover:text-amber-400 transition">
                      Admin Studio Dashboard
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      View live inventory, delete products, and manage catalog operations
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-4 rounded-xl bg-stone-800/80 border border-stone-700 hover:border-amber-500/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200 group-hover:text-amber-400 transition">
                      Manage User Roles
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Turn on Moderator or Admin status
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/admin/add-product"
                className="flex items-center justify-between p-4 rounded-xl bg-stone-800/80 border border-stone-700 hover:border-red-500/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200 group-hover:text-red-400 transition">
                      Publish Artwork
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Upload Cloudinary master &amp; set pricing
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-red-400 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* Regular Customer Notice */}
        {role === "user" && (
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                CanvasCraft Collector Membership
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Explore our premium museum-quality canvas artworks, choose proportional wall sizes, and enjoy nationwide doorstep delivery across 64 districts.
              </p>
            </div>
          </div>
        )}

        {/* Catalog & Combos Explore Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/#combos"
            className="group block p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-rose-300 shadow-2xs hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-rose-200">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-950 mb-1 group-hover:text-rose-800 transition">
              View Combo Deals
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse multi-piece wall board combos (3, 6, 9 &amp; 12 pieces) starting from ৳ 300.
            </p>
          </Link>

          <Link
            href="/products"
            className="group block p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-amber-300 shadow-2xs hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-amber-200">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-stone-950 mb-1 group-hover:text-amber-800 transition">
              Explore Art Catalog
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse Islamic calligraphy, modern abstracts, and minimal gallery collections.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#faf8f5]">
          <div className="flex items-center gap-3 text-stone-600 text-sm">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading membership profile...</span>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
