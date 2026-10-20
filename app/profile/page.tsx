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
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="flex items-center gap-3 text-stone-400 text-sm">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading membership profile...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-100 font-bold mb-2">
            Sign In Required
          </h2>
          <p className="text-sm text-stone-400 mb-6">
            Please log in with your email or social account to view your CanvasCraft membership profile.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition"
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
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-950">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Error Notification if redirected from protected admin files */}
        {errorParam === "admin_required" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-amber-300 text-xs shadow-lg animate-in fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-200 text-sm">
                Administrator Access Required
              </h4>
              <p className="text-stone-300 leading-relaxed">
                The administrative file or dashboard you tried to access requires active <span className="text-amber-400 font-bold uppercase">Admin</span> credentials. Your current account role is <span className="font-mono uppercase font-bold text-stone-100">[{role}]</span>.
              </p>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold text-2xl shadow-xl shadow-amber-500/20">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-serif font-bold text-stone-100">
                    {user.name || "Collector"}
                  </h1>

                  {/* Role Badges */}
                  {role === "admin" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold font-mono">
                      <ShieldAlert className="w-3 h-3" />
                      ADMINISTRATOR
                    </span>
                  )}
                  {role === "moderator" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold font-mono">
                      <Shield className="w-3 h-3" />
                      MODERATOR
                    </span>
                  )}
                  {role === "user" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Member
                    </span>
                  )}
                </div>
                {user.username && (
                  <p className="text-sm text-amber-500/90 font-mono mt-0.5">
                    @{user.username}
                  </p>
                )}
                <p className="text-xs text-stone-400 mt-1">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-red-400 border border-stone-700/60 hover:border-red-500/30 text-xs font-medium transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Details & Role Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-5">
            <div className="text-stone-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Account Type</span>
            </div>
            <p className="text-base font-semibold text-stone-100 capitalize">
              {role === "admin"
                ? "Executive Admin"
                : role === "moderator"
                ? "Content Moderator"
                : "Collector Member"}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">
              {role === "admin"
                ? "Full administrative control"
                : role === "moderator"
                ? "Assisted catalog management"
                : "Active customer privileges"}
            </p>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-5">
            <div className="text-stone-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role Activation</span>
            </div>
            <p className="text-base font-semibold text-emerald-400">
              Admin-Governed
            </p>
            <p className="text-[10px] text-stone-400 mt-1">
              Roles can only be turned on by authorized administrators
            </p>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-5">
            <div className="text-stone-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tier Benefits</span>
            </div>
            <p className="text-base font-semibold text-stone-100">
              Archival Quality
            </p>
            <p className="text-[10px] text-stone-400 mt-1">
              300+ GSM Archival Canvas &amp; Pine Frames
            </p>
          </div>
        </div>

        {/* Dedicated Navigation: My Orders & My Shopping Cart */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>Shopping &amp; Order Services</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Track live deliveries, view past orders, and inspect your full shopping bag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              href="/orders"
              className="flex items-center justify-between p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200 group-hover:text-amber-400 transition">
                    My Orders &amp; Tracking
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Live delivery status &amp; order history
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200 group-hover:text-rose-400 transition">
                    My Shopping Bag &amp; Details
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Inspect combo discounts &amp; place order
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-rose-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Administrator Operations Control (Visible ONLY to Admins) */}
        {role === "admin" && (
          <div className="bg-stone-900/80 border border-red-500/30 rounded-2xl p-6 sm:p-7 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Administrator Executive Control</span>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Store Operations &amp; Catalog Management
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                You have master authority to manage catalog inventory, delete artwork, and activate Moderator / Admin permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/admin"
                className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 transition group sm:col-span-2"
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
                className="flex items-center justify-between p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition group"
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
                className="flex items-center justify-between p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-red-500/50 transition group"
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

        {/* Moderator Badge Details (Visible when Moderator) */}
        {role === "moderator" && (
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-300">
                Moderator Access Privileges
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Your account has been turned on as a Moderator by the Store Administrator. You are authorized to review customer designs and assist in community curation. Full catalog modifications and role updates remain reserved for Administrators.
              </p>
            </div>
          </div>
        )}

        {/* Regular Customer Notice */}
        {role === "user" && (
          <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-200">
                CanvasCraft Collector Membership
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Enjoy customized frame mockups in our Live Studio, save your custom room configurations, and explore our premium museum-quality canvas artworks.
              </p>
            </div>
          </div>
        )}

        {/* Studio & Catalog Explore Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/customize"
            className="group block p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-100 mb-1 group-hover:text-amber-300 transition">
              Launch Studio Customizer
            </h3>
            <p className="text-xs text-stone-400">
              Simulate canvas sets above the 80″ living room sofa and create combo sets with up to 6 custom photos.
            </p>
          </Link>

          <Link
            href="/products"
            className="group block p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-900/40 border border-stone-800 hover:border-amber-500/40 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-100 mb-1 group-hover:text-amber-300 transition">
              Explore Art Catalog
            </h3>
            <p className="text-xs text-stone-400">
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
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
          <div className="flex items-center gap-3 text-stone-400 text-sm">
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
