export type MaterialType = 'pvc' | 'canvas';

export type FrameType = 'none' | 'black' | 'walnut' | 'white' | 'gold';

export interface FrameOption {
  type: FrameType;
  name: string;
  price: number;
  tag: string;
  color: string;
}

export interface SizeOption {
  code: string;
  label: string;
  w: number;
  h: number;
  pricePvc: number;
  priceCanvas: number;
  sub: string;
  badge?: string;
}

export interface ComboTier {
  pcs: number;
  price: number;
  cols: number;
  rows: number;
  label: string;
  sub: string;
  badge?: string;
}

export interface ComboPackage {
  key: string;
  name: string;
  tileW: number;
  tileH: number;
  tiers: ComboTier[];
}

export interface Product {
  id: string;
  title: string;
  category: 'Modern Abstract' | 'Islamic Art' | 'Landscape & Nature' | 'Minimalist' | 'Portrait & Classical';
  image: string;
  aspect: string;
  orientation: 'portrait' | 'landscape' | 'square';
  basePrice: number;
  tags: string[];
  featured?: boolean;
  details?: string;
  description?: string;
}

export interface UploadedSlotImage {
  id: number;
  src: string;
  thumb?: string;
  fileName?: string;
  fileSize?: string;
  cloudinaryUrl?: string;
  isUploading?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  fullImage?: string;
  comboImages?: UploadedSlotImage[];
  category: string;
  sizeCode: string;
  sizeLabel: string;
  width: number;
  height: number;
  material: MaterialType;
  materialName: string;
  frameType: FrameType;
  frameName: string;
  borderName?: string;
  basePrice: number;
  framePrice: number;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type DeliveryLocation = 'dhaka' | 'outside';

export interface CartTotals {
  itemsCount: number;
  totalPieces: number;
  rawSubtotal: number;
  comboDiscount: number;
  comboDealName: string;
  totalComboPieces: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  advance: number;
  due: number;
  comboItemsList: CartItem[];
  nonComboItemsList: CartItem[];
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  username?: string | null;
  role?: UserRole;
  banned?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemData {
  productId?: string | null;
  title: string;
  imageUrl: string;
  category?: string | null;
  sizeCode: string;
  sizeLabel: string;
  width: number;
  height: number;
  material: string;
  frameType: string;
  borderName?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  comboPieces?: number | null;
  customPhotoUrls?: string[];
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryZone: string;
  notes?: string | null;
  status: string;
  subtotal: number;
  comboDiscount: number;
  comboDealName?: string | null;
  deliveryFee: number;
  total: number;
  advancePaid: number;
  codDue: number;
  paymentMethod: string;
  items: OrderItemData[];
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

