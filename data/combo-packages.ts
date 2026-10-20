import { SizeOption, ComboPackage } from '@/types';

export const STANDARD_SIZES: SizeOption[] = [
  { code: '6x8', label: '6×8″ Mini Photo Tile', w: 6, h: 8, pricePvc: 60, priceCanvas: 150, sub: 'Desk / Accent Tile' },
  { code: '8x12', label: '8×12″ Classic Wall Board', w: 8, h: 12, pricePvc: 120, priceCanvas: 250, sub: 'Standard Wall Board' },
  { code: '12x16', label: '12×16″ Medium Print', w: 12, h: 16, pricePvc: 200, priceCanvas: 450, sub: 'Bedside & Gallery Wall' },
  { code: '16x24', label: '16×24″ Studio Canvas (Solo Promo)', w: 16, h: 24, pricePvc: 350, priceCanvas: 650, sub: 'Statement Solo Canvas', badge: 'Solo Promo — ৳ 350' },
  { code: '20x30', label: '20×30″ Large Statement Canvas', w: 20, h: 30, pricePvc: 550, priceCanvas: 950, sub: 'Living Room Eye-Level' },
  { code: '24x36', label: '24×36″ Grand Gallery Canvas', w: 24, h: 36, pricePvc: 750, priceCanvas: 1350, sub: 'Oversized Masterpiece', badge: 'Grand Scale' }
];

export const COMBO_PACKAGES: Record<string, ComboPackage> = {
  '16x24': {
    key: '16x24',
    name: '16×24″ Studio Solo Promo',
    tileW: 16,
    tileH: 24,
    tiers: [
      { pcs: 1, price: 350, cols: 1, rows: 1, label: '1 Pc — Only ৳ 350', sub: 'Special Solo Promo', badge: 'Solo Promo' }
    ]
  },
  '6x8': {
    key: '6x8',
    name: '6×8″ Mini Photo Tiles',
    tileW: 6,
    tileH: 8,
    tiers: [
      { pcs: 6, price: 300, cols: 3, rows: 2, label: '6 Pcs — ৳ 300', sub: '৳ 50 / pc', badge: 'Best Seller' },
      { pcs: 9, price: 430, cols: 3, rows: 3, label: '9 Pcs — ৳ 430', sub: '৳ 47.7 / pc' },
      { pcs: 12, price: 550, cols: 4, rows: 3, label: '12 Pcs — ৳ 550', sub: 'Popular Grid', badge: 'Best Value' },
      { pcs: 15, price: 650, cols: 5, rows: 3, label: '15 Pcs — ৳ 650', sub: '৳ 43.3 / pc' },
      { pcs: 18, price: 750, cols: 6, rows: 3, label: '18 Pcs — ৳ 750', sub: '৳ 41.6 / pc' },
      { pcs: 24, price: 999, cols: 6, rows: 4, label: '24 Pcs — ৳ 999', sub: 'Mega Wall Pack', badge: 'Mega Deal' }
    ]
  },
  '8x12': {
    key: '8x12',
    name: '8×12″ Classic Wall Boards',
    tileW: 8,
    tileH: 12,
    tiers: [
      { pcs: 3, price: 300, cols: 3, rows: 1, label: '3 Pcs — ৳ 300', sub: '৳ 100 / pc', badge: 'Top Choice' },
      { pcs: 6, price: 550, cols: 3, rows: 2, label: '6 Pcs — ৳ 550', sub: 'Best Seller', badge: 'Popular' },
      { pcs: 9, price: 850, cols: 3, rows: 3, label: '9 Pcs — ৳ 850', sub: '3×3 Square Grid' },
      { pcs: 12, price: 1050, cols: 4, rows: 3, label: '12 Pcs — ৳ 1050', sub: 'Full Wall Master' }
    ]
  },
  '12x16': {
    key: '12x16',
    name: '12×16″ Medium Prints',
    tileW: 12,
    tileH: 16,
    tiers: [
      { pcs: 1, price: 200, cols: 1, rows: 1, label: '1 Pc — ৳ 200', sub: 'Single Print' },
      { pcs: 3, price: 550, cols: 3, rows: 1, label: '3 Pcs — ৳ 550', sub: '3-Piece Set', badge: 'Popular' },
      { pcs: 6, price: 1050, cols: 3, rows: 2, label: '6 Pcs — ৳ 1050', sub: '6-Piece Wall Set' }
    ]
  }
};
