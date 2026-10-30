import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CanvasCraft BD — Premium Custom Canvases & PVC Wall Decor',
  description: 'Bangladesh’s premier studio for high-definition custom canvas prints, rigid PVC wall boards, 5-part split panels, and museum floating frames. Express delivery across all 64 districts.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${playfair.variable} ${plusJakarta.variable}`}
      data-scroll-behavior="smooth"
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-950"
      >
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#ffffff',
                color: '#1c1917',
                border: '1px solid #e7e5e4',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#d97706',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
