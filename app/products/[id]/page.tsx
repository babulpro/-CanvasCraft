import { Suspense } from 'react';
import { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import ProductDetailContent from '@/components/products/ProductDetailContent';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return {
      title: 'Artwork Details — CanvasCraft BD',
      description: 'Explore premium museum-quality canvas and rigid PVC wall decor in Bangladesh.',
    };
  }

  return {
    title: `${product.title} — CanvasCraft BD`,
    description:
      product.details ||
      product.description ||
      `High-definition archival canvas print of ${product.title}. Fast delivery across Bangladesh with Cash on Delivery.`,
    openGraph: {
      title: `${product.title} — CanvasCraft BD`,
      description: product.details || product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-600 text-sm font-medium">Loading artwork details...</p>
          </div>
        </div>
      }
    >
      <ProductDetailContent productId={id} />
    </Suspense>
  );
}
