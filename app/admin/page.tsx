"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthUser } from "@/types";
import {
  ShieldCheck,
  ShieldAlert,
  UploadCloud,
  PlusCircle,
  Search,
  Grid,
  Users,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Palette,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  Package,
} from "lucide-react";

interface AdminProduct {
  id: string;
  title: string;
  category: string;
  image: string;
  aspect: string;
  orientation: string;
  basePrice: number;
  tags?: string[];
  featured?: boolean;
  description?: string;
}

const CATEGORIES = [
  "All",
  "Modern Abstract",
  "Islamic Art",
  "Landscape & Nature",
  "Minimalist",
  "Portrait & Classical",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const currentUser = session?.user as (AuthUser & Record<string, unknown>) | undefined;
  const isAdmin = currentUser?.role === "admin";

  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to load catalog products.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load products.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(productToDelete.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product from database.");
      }

      // Remove immediately from local state
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setStatusMessage({
        type: "success",
        text: data.message || `Artwork "${productToDelete.title}" permanently deleted.`,
      });
      setProductToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const totalFeatured = products.filter((p) => p.featured).length;

  if (isPending || loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="flex items-center gap-3 text-stone-400 text-sm">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Admin Studio &amp; Catalog Management...</span>
        </div>
      </div>
    );
  }

  // Not logged in or not admin
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-100 font-bold mb-2">
            Administrator Access Required
          </h2>
          <p className="text-sm text-stone-400 mb-6">
            You do not have permission to view the Admin Studio. Please sign in with an authorized Administrator account.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition"
          >
            <span>Sign In as Admin</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="uppercase font-bold tracking-wider">CanvasCraft Executive Control</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-100">
              Admin Studio Dashboard
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Manage live catalog artworks, upload master high-res files, and monitor storefront products.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center flex-wrap gap-2.5">
            <Link
              href="/admin/add-product"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/10 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload New Artwork</span>
            </Link>

            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-medium transition"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Manage User Roles</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-medium transition"
            >
              <ExternalLink className="w-4 h-4 text-stone-400" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>

        {/* Feedback Banners */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-stone-400 hover:text-stone-200 text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Key Metrics / Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Total Artworks</span>
              <Grid className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-serif text-stone-100">
              {products.length}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Live in Catalog</span>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Featured Showcase</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-amber-400">
              {totalFeatured}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Homepage Curated</span>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Active Categories</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-stone-100">
              {new Set(products.map((p) => p.category)).size}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">Artistic Collections</span>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium">Database Connection</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
              ONLINE
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">MongoDB Atlas / Cloudinary</span>
          </div>
        </div>

        {/* Catalog Control Bar */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search artworks by title, category, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 placeholder-stone-600 text-xs focus:outline-none"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchProducts}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                title="Refresh catalog data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                href="/admin/add-product"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Upload Product</span>
              </Link>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-stone-200">
              Live Catalog Inventory ({filteredProducts.length})
            </h2>
            <span className="text-xs text-stone-500">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-3">
              <Package className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-sm font-medium">No matching artworks found.</p>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Try adjusting your search criteria or upload a new masterpiece to the catalog.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 font-mono uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Artwork</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Orientation / Ratio</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-900/50 transition">
                      {/* Artwork thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-950 border border-stone-800 shrink-0">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <h3 className="font-semibold text-stone-200 truncate" title={p.title}>
                              {p.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.tags && p.tags.slice(0, 2).map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-mono"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700/60 text-stone-300 text-[11px] font-medium">
                          {p.category}
                        </span>
                      </td>

                      {/* Orientation */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400 capitalize">
                        {p.orientation || p.aspect || "portrait"}
                      </td>

                      {/* Base Price */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        ৳{p.basePrice.toLocaleString()}
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {p.featured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                              Featured
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                            In Stock
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/customize?image=${encodeURIComponent(p.image)}&title=${encodeURIComponent(p.title)}`}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                            title="Open in Customizer Studio"
                          >
                            <Palette className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition cursor-pointer"
                            title="Delete artwork from catalog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-100">
                  Delete Catalog Artwork?
                </h3>
                <p className="text-xs text-stone-400">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3">
              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                <Image
                  src={productToDelete.image}
                  alt={productToDelete.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-200 truncate">
                  {productToDelete.title}
                </p>
                <p className="text-[11px] text-stone-500 font-mono">
                  {productToDelete.category} • ৳{productToDelete.basePrice}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Are you sure you want to permanently delete this artwork from the CanvasCraft catalog and MongoDB database?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
