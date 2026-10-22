import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'port-1',
    title: 'Modern Portrait Oil Art',
    category: 'Portrait & Classical',
    image: '/assets/portrait_art.jpg',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Museum Classic', 'Oil on Linen', 'Solo Promo (16×24″)'],
    details: 'Masterpiece floral still life with butterflies & fruit. High-definition pigment print on 380 GSM textured cotton canvas or 3mm rigid PVC board.',
    featured: true
  },
  {
    id: 'abstract-1',
    title: 'Desert Twilight Abstract Triptych',
    category: 'Modern Abstract',
    image: '/assets/triptych_art.jpg',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 550,
    tags: ['3-Piece Ready', 'Triptych', 'Grand Scale'],
    details: 'Continuous 3-piece watercolor dunes and moonlight. Calibrated for zero-cut multi-panel living room wall display above 80″ sofas.',
    featured: true
  },
  {
    id: 'islamic-1',
    title: 'Ayat Al-Kursi Gold Thuluth',
    category: 'Islamic Art',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Single & Triptych', 'Islamic Heritage', 'Gold Script'],
    details: 'Sacred classical Thuluth script with rich gold inlay on obsidian. Anti-scratch, anti-glare satin UV coating that never fades in sunlight.',
    featured: true
  },
  {
    id: 'nature-1',
    title: 'Sajek Cloud Forest & River',
    category: 'Landscape & Nature',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 350,
    tags: ['5-Piece Waterfall Ready', 'Landscape', 'Panoramic'],
    details: 'Misty mountain ridges and cascading river panorama. Pre-sliced for 5-part waterfall sets spanning 3 to 5 feet of continuous art.',
    featured: true
  },
  {
    id: 'botanical-1',
    title: 'Botanical Oil Still Life',
    category: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Vintage Oil', 'Earthy Linen', 'Fine Art'],
    details: 'Warm earth tones and subtle linen texture. Complements minimalist Scandinavian interiors, dining spaces, and cozy reading nooks.',
    featured: true
  },
  {
    id: 'combo-6x8',
    title: '6×8″ Mini Photo Tiles (12 Pcs Deal)',
    category: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    aspect: '3:4',
    orientation: 'portrait',
    basePrice: 550,
    tags: ['Photo Combo Deal', '12 Tiles Collage', 'Bestseller'],
    details: 'Ultra-light 3mm rigid PVC photo tiles. Clean, minimal, modern wall collage display.',
    featured: false
  }
];
