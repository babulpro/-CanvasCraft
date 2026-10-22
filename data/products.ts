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
    id: 'port-2',
    title: 'Renaissance Velvet Lady & Pearls',
    category: 'Portrait & Classical',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Classical Art', 'Chiaroscuro', 'Museum Heritage'],
    details: 'Hauntingly elegant classical portrait with rich velvet drapery, chiaroscuro lighting, and luminous jewel highlights.',
    featured: true
  },
  {
    id: 'port-3',
    title: 'Baroque Golden Muse with Peonies',
    category: 'Portrait & Classical',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Baroque', 'Oil Impasto', 'Floral Muse'],
    details: 'Rich European oil brushwork blending romantic botanicals with classical portraiture. Warm amber and deep umber tones.',
    featured: false
  },
  {
    id: 'port-4',
    title: 'Vintage Royal Academy Contemplation',
    category: 'Portrait & Classical',
    image: 'https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Antique Oil', 'Royal Classic', 'Earthy Ochre'],
    details: 'Subtle textural brushstrokes reminiscent of 19th-century salon masters. Printed on museum archival canvas.',
    featured: false
  },

  // 2. Modern Abstract
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
    id: 'abstract-2',
    title: 'Golden Horizon Fluid Acrylic',
    category: 'Modern Abstract',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 350,
    tags: ['Fluid Art', 'Gold Leaf Accents', 'Contemporary'],
    details: 'Dynamic swirling fluid pigments in warm gold, ochre, and deep slate. A dramatic modern centerpiece for contemporary spaces.',
    featured: true
  },
  {
    id: 'abstract-3',
    title: 'Midnight Sapphire Geode',
    category: 'Modern Abstract',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Mineral Texture', 'Deep Sapphire', 'Modern Luxury'],
    details: 'Deep indigo, crystalline teal, and metallic gold marbling imitating geological gemstone formations in high-contrast resolution.',
    featured: false
  },
  {
    id: 'abstract-4',
    title: 'Sienna Terracotta Geometry',
    category: 'Modern Abstract',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Warm Terracotta', 'Geometric Forms', 'Mid-Century'],
    details: 'Layered organic arches and neutral clay tones designed for modern Scandinavian and Japandi interior aesthetics.',
    featured: false
  },

  // 3. Islamic Art
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
    id: 'islamic-2',
    title: 'Surah Al-Ikhlas Kufic Geometry',
    category: 'Islamic Art',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Kufic Script', 'Geometric Harmony', 'Black & Gold'],
    details: 'Architectural Square Kufic calligraphy structured in golden proportion. Crisp lines printed with fade-proof pigment inks.',
    featured: true
  },
  {
    id: 'islamic-3',
    title: 'Bismillah Ar-Rahman Gold Marble',
    category: 'Islamic Art',
    image: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1000&q=80',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 350,
    tags: ['Bismillah', 'Calacatta Marble', 'Sacred Calligraphy'],
    details: 'Flowing Diwani calligraphy suspended over Italian Calacatta marble veins with subtle metallic sheen accents.',
    featured: false
  },
  {
    id: 'islamic-4',
    title: 'Al-Masjid An-Nabawi Architectural Arch',
    category: 'Islamic Art',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Madinah Munawwarah', 'Mosque Architecture', 'Sacred Spaces'],
    details: 'Intricate marble arches and iconic umbrella canopies bathed in early morning golden hour sunlight.',
    featured: false
  },

  // 4. Landscape & Nature
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
    id: 'nature-2',
    title: 'Srimangal Emerald Tea Highlands',
    category: 'Landscape & Nature',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 350,
    tags: ['Tea Gardens', 'Mist & Green', 'Bangladesh Heritage'],
    details: 'Rolling green tea estate hills draped in morning valley fog with soft sunrays breaking across the foliage.',
    featured: true
  },
  {
    id: 'nature-3',
    title: 'Sundarbans Golden Mangrove Sunset',
    category: 'Landscape & Nature',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1000&q=80',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 350,
    tags: ['Mangrove Forest', 'Golden Hour', 'Water Reflections'],
    details: 'Lush untouched delta riverways illuminated by dramatic amber dusk light. Perfect for wide living room statement walls.',
    featured: false
  },
  {
    id: 'nature-4',
    title: "Cox's Bazar Moonlit Oceanic Shore",
    category: 'Landscape & Nature',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    aspect: '3:2',
    orientation: 'landscape',
    basePrice: 350,
    tags: ['Ocean Wave', 'Seascapes', 'Coastal Breeze'],
    details: 'Gentle turquoise foam breaking on sandy shores with endless horizon lines that create depth in any room.',
    featured: false
  },

  // 5. Minimalist
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
    id: 'minimalist-2',
    title: 'Monochrome Bauhaus Arch Lines',
    category: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Line Art', 'Bauhaus Geometry', 'Clean White'],
    details: 'Minimalist architectural curves with pure black strokes over warm plaster background. Understated and timeless.',
    featured: true
  },
  {
    id: 'minimalist-3',
    title: 'Japandi Sand Dunes & Circle',
    category: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    aspect: '2:3',
    orientation: 'portrait',
    basePrice: 350,
    tags: ['Wabi-Sabi', 'Japandi Decor', 'Neutral Sand'],
    details: 'Textured zen sand contours paired with a serene sun sphere in oatmeal and warm taupe tones.',
    featured: false
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
