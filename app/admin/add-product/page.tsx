"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthUser } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  PlusCircle,
  Tag,
  DollarSign,
  Grid,
  Users,
} from "lucide-react";

const CATEGORIES = [
  "Modern Abstract",
  "Islamic Art",
  "Landscape & Nature",
  "Minimalist",
  "Portrait & Classical",
];

const ORIENTATIONS = [
  { value: "portrait", label: "Portrait (3:4 Ratio)" },
  { value: "landscape", label: "Landscape (4:3 Ratio)" },
  { value: "square", label: "Square (1:1 Ratio)" },
];

export default function AddProductPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("350");
  const [orientation, setOrientation] = useState("portrait");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageDetails, setImageDetails] = useState<{
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    publicId?: string;
  } | null>(null);

  // Form Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const user = session?.user as (AuthUser & Record<string, unknown>) | undefined;
  const isAdmin = user?.role === "admin";

  // Handle Cloudinary Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned non-JSON response (${res.status}): ${
            text.slice(0, 120) || res.statusText
          }`
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Cloudinary.");
      }

      setImageUrl(data.url);
      setImageDetails({
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        publicId: data.publicId,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed.";
      setErrorMessage(msg);
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  // Handle Product Submission
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim() || !imageUrl || !basePrice) {
      setErrorMessage("Please complete all required fields and upload an image.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          imageUrl,
          basePrice: parseFloat(basePrice),
          orientation,
          aspect: orientation,
          tags,
          featured,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product.");
      }

      setSuccessMessage("Artwork successfully published to the CanvasCraft catalog!");
      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Creation failed.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="flex items-center gap-3 text-stone-400 text-sm">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  // Gate 1: Not Logged In
  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-100 font-bold mb-2">
            Administrator Sign In Required
          </h2>
          <p className="text-sm text-stone-400 mb-6">
            You must be logged in with an administrative account to add products to the catalog.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition"
          >
            <span>Sign In to Continue</span>
          </Link>
        </div>
      </div>
    );
  }

  // Gate 2: Logged in but not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-100 font-bold mb-2">
            Administrator Access Required
          </h2>
          <p className="text-sm text-stone-400 mb-2">
            Logged in as <span className="text-stone-200 font-semibold">{user?.email}</span>
          </p>
          <p className="text-xs text-amber-400/90 font-mono mb-4">
            Current Role: <span className="uppercase font-bold">{user?.role || "user"}</span>
          </p>
          <p className="text-xs text-stone-400 mb-6 leading-relaxed">
            Only designated Administrators can publish artwork to the catalog. If you require administrative permissions, please contact an active administrator to turn on your account.
          </p>

          <div className="space-y-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition"
            >
              <span>Return to Catalog</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
            >
              <span>View Your Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Gate Passed: Admin Product Studio
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-950">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-200 transition"
            >
              <span>Storefront Catalog</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-medium transition"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage User Roles</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN AUTHORIZED</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-100">
            Publish New Catalog Artwork
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Upload high-resolution master files to Cloudinary CDN and persist product models in MongoDB via Prisma.
          </p>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Artwork Form */}
        <form onSubmit={handleSubmitProduct} className="space-y-6">
          {/* 1. Image Upload Section */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 backdrop-blur-xl">
            <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>Master Artwork File (Cloudinary CDN)</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {imageUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center max-h-80">
                  <img
                    src={imageUrl}
                    alt="Uploaded Artwork"
                    className="max-h-80 w-auto object-contain"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-900/90 text-emerald-200 text-[10px] font-mono font-bold border border-emerald-500/30">
                      ☁️ Cloudinary Verified
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 text-[10px] font-medium border border-stone-700"
                    >
                      Replace
                    </button>
                  </div>
                </div>

                {imageDetails && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
                    <div>
                      <span className="text-stone-500 block text-[10px]">Dimensions</span>
                      <span className="text-stone-200 font-bold">
                        {imageDetails.width} × {imageDetails.height}px
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">Format</span>
                      <span className="text-stone-200 font-bold uppercase">
                        {imageDetails.format}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">Size</span>
                      <span className="text-stone-200 font-bold">
                        {imageDetails.bytes
                          ? `${Math.round(imageDetails.bytes / 1024)} KB`
                          : "Optimized"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-700 hover:border-amber-500/60 rounded-xl p-8 text-center cursor-pointer bg-stone-950/40 hover:bg-stone-900/60 transition group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                  {uploadingImage ? (
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <p className="text-sm font-semibold text-stone-200">
                  {uploadingImage
                    ? "Compressing and uploading to Cloudinary CDN..."
                    : "Click to select and upload artwork master"}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Supports high-resolution JPG, PNG, WEBP files
                </p>
              </div>
            )}
          </div>

          {/* 2. Metadata Section */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Artwork Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modernist Sunset Terraces"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 text-sm focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Orientation &amp; Ratio *
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 text-sm focus:outline-none"
                >
                  {ORIENTATIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Base Starting Price (BDT ৳) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    placeholder="350"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 text-sm focus:outline-none font-mono"
                  />
                  <DollarSign className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="gold, floral, minimalist, modern"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 text-sm focus:outline-none font-mono text-xs"
                  />
                  <Tag className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Curatorial Story / Description
              </label>
              <textarea
                rows={3}
                placeholder="High-definition museum canvas reproduction crafted with archival pigment inks on pine wood frame..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-stone-100 text-sm focus:outline-none placeholder-stone-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-500 bg-stone-950 border-stone-700 rounded focus:ring-amber-500"
              />
              <label htmlFor="featured" className="text-xs font-medium text-stone-300">
                Feature on Homepage Curated Showcase
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingImage || !imageUrl}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Publishing to MongoDB...</span>
              </div>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Artwork to Catalog</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
