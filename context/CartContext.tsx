'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, CartTotals, DeliveryLocation } from '@/types';

const CART_STORAGE_KEY = 'canvascraft_cart_v1';
const COMBO_SELECTION_KEY = 'canvascraft_combo_v1';

interface CartContextType {
  items: CartItem[];
  comboSelectedIds: string[];
  deliveryLocation: DeliveryLocation;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  addMultipleItems: (itemsToAdd: CartItem[], autoComboIds?: string[]) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  toggleComboItem: (cartItemId: string) => void;
  autoSelectComboDeal: () => void;
  setDeliveryLocation: (loc: DeliveryLocation) => void;
  totals: CartTotals;
  getWhatsAppCheckoutUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [comboSelectedIds, setComboSelectedIds] = useState<string[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>('dhaka');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) setItems(JSON.parse(storedItems));

      const storedCombo = localStorage.getItem(COMBO_SELECTION_KEY);
      if (storedCombo) setComboSelectedIds(JSON.parse(storedCombo));
    } catch (e) {
      console.error('Error loading cart state:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(COMBO_SELECTION_KEY, JSON.stringify(comboSelectedIds));
    } catch (e) {
      console.error('Error saving cart state:', e);
    }
  }, [items, comboSelectedIds, isLoaded]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem = (item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(i =>
        i.productId === item.productId &&
        i.sizeCode === item.sizeCode &&
        i.material === item.material &&
        i.frameType === item.frameType &&
        (!item.comboImages || item.comboImages.length === 0)
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + (item.quantity || 1);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: newQty * updated[existingIdx].unitPrice
        };
        return updated;
      }

      const newItem: CartItem = {
        ...item,
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        quantity: item.quantity || 1,
        totalPrice: (item.quantity || 1) * item.unitPrice
      };
      return [...prev, newItem];
    });
    openDrawer();
  };

  const addMultipleItems = (itemsToAdd: CartItem[], autoComboIds?: string[]) => {
    setItems(prev => [...prev, ...itemsToAdd]);
    if (autoComboIds && autoComboIds.length > 0) {
      setComboSelectedIds(autoComboIds);
    }
    openDrawer();
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === cartItemId);
      if (idx < 0) return prev;

      const newQty = prev[idx].quantity + delta;
      if (newQty <= 0) {
        setComboSelectedIds(c => c.filter(id => id !== cartItemId));
        return prev.filter(i => i.id !== cartItemId);
      }

      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        quantity: newQty,
        totalPrice: newQty * updated[idx].unitPrice
      };
      return updated;
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.id !== cartItemId));
    setComboSelectedIds(prev => prev.filter(id => id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setComboSelectedIds([]);
  };

  const toggleComboItem = (cartItemId: string) => {
    if (comboSelectedIds.includes(cartItemId)) {
      setComboSelectedIds(prev => prev.filter(id => id !== cartItemId));
    } else {
      let currentCount = 0;
      comboSelectedIds.forEach(id => {
        const it = items.find(i => i.id === id);
        if (it) currentCount += it.quantity;
      });

      const target = items.find(i => i.id === cartItemId);
      const added = target ? target.quantity : 1;

      if (currentCount + added > 6) {
        alert('Maximum 6 pieces allowed in a single Combo Deal! Please select up to 6 pieces.');
        return;
      }
      setComboSelectedIds(prev => [...prev, cartItemId]);
    }
  };

  const autoSelectComboDeal = () => {
    let selected: string[] = [];
    let count = 0;
    for (const it of items) {
      if (count + it.quantity <= 6) {
        selected.push(it.id);
        count += it.quantity;
      }
    }
    setComboSelectedIds(selected);
  };

  const totals: CartTotals = useMemo(() => {
    let rawSubtotal = 0;
    const comboItemsList: CartItem[] = [];
    const nonComboItemsList: CartItem[] = [];

    items.forEach(it => {
      rawSubtotal += it.totalPrice;
      if (comboSelectedIds.includes(it.id)) {
        comboItemsList.push(it);
      } else {
        nonComboItemsList.push(it);
      }
    });

    const totalComboPieces = comboItemsList.reduce((sum, i) => sum + i.quantity, 0);
    let comboDiscount = 0;
    let comboDealName = '';

    if (totalComboPieces >= 3 && totalComboPieces <= 6) {
      const allSameSize = comboItemsList.every(i => i.sizeCode === comboItemsList[0].sizeCode);
      const firstSize = comboItemsList[0]?.sizeCode;

      if (allSameSize && firstSize === '6x8' && totalComboPieces === 6) {
        const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
        comboDiscount = Math.max(0, standardCost - 300);
        comboDealName = '6-Piece 6×8″ Mini Tile Combo Deal (Only ৳ 300)';
      } else if (allSameSize && firstSize === '8x12' && totalComboPieces === 3) {
        const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
        comboDiscount = Math.max(0, standardCost - 300);
        comboDealName = '3-Piece 8×12″ Wall Board Combo Deal (Only ৳ 300)';
      } else if (allSameSize && firstSize === '8x12' && totalComboPieces === 6) {
        const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
        comboDiscount = Math.max(0, standardCost - 550);
        comboDealName = '6-Piece 8×12″ Gallery Board Combo Deal (Only ৳ 550)';
      } else if (allSameSize && firstSize === '12x16' && totalComboPieces === 3) {
        const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
        comboDiscount = Math.max(0, standardCost - 550);
        comboDealName = '3-Piece 12×16″ Medium Canvas Combo Deal (Only ৳ 550)';
      } else if (allSameSize && firstSize === '12x16' && totalComboPieces === 6) {
        const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
        comboDiscount = Math.max(0, standardCost - 1050);
        comboDealName = '6-Piece 12×16″ Medium Canvas Combo Deal (Only ৳ 1,050)';
      } else {
        const comboRaw = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
        comboDiscount = Math.round(comboRaw * 0.15);
        comboDealName = `${totalComboPieces}-Piece Curated Art Combo Deal (15% Bundle Discount)`;
      }
    }

    const subtotal = Math.max(0, rawSubtotal - comboDiscount);
    const deliveryCharge = deliveryLocation === 'dhaka' ? 80 : 150;
    const total = subtotal + deliveryCharge;
    const advance = Math.round(total * 0.30);
    const due = total - advance;

    return {
      itemsCount: items.length,
      totalPieces: items.reduce((sum, i) => sum + i.quantity, 0),
      rawSubtotal,
      comboDiscount,
      comboDealName,
      totalComboPieces,
      subtotal,
      deliveryCharge,
      total,
      advance,
      due,
      comboItemsList,
      nonComboItemsList
    };
  }, [items, comboSelectedIds, deliveryLocation]);

  const getWhatsAppCheckoutUrl = () => {
    if (items.length === 0) return '#';

    let detailsText = '';
    items.forEach((it, idx) => {
      const isCombo = comboSelectedIds.includes(it.id);
      let attachedPhotosText = '';
      if (it.comboImages && it.comboImages.length > 0) {
        attachedPhotosText = `• Attached Custom Photos (${it.comboImages.length} Pcs):%0A` +
          it.comboImages.map((p, pIdx) => `   ${pIdx + 1}. ${p.fileName || 'Photo ' + (pIdx + 1)}`).join('%0A') + '%0A';
      }

      detailsText += `[Item ${idx + 1}] ${it.title}%0A` +
                     `• Size: ${it.sizeLabel}%0A` +
                     `• Material: ${it.materialName}%0A` +
                     `• Frame: ${it.frameName}%0A` +
                     `• Quantity: ${it.quantity} pc(s)%0A` +
                     attachedPhotosText +
                     `• Price: ৳ ${it.totalPrice.toLocaleString()}${isCombo ? ' (Included in Combo Deal)' : ''}%0A%0A`;
    });

    let comboSummary = '';
    if (totals.comboDiscount > 0) {
      comboSummary = `🎁 *COMBO DEAL SAVINGS:*%0A` +
                     `• ${totals.comboDealName}%0A` +
                     `• Total Combo Discount: -৳ ${totals.comboDiscount.toLocaleString()}%0A%0A`;
    }

    const message = `Hello CanvasCraft BD! I would like to place an order from my bag:%0A%0A` +
      `🛒 *ORDER ITEMS:*%0A` +
      detailsText +
      comboSummary +
      `💰 *BILLING BREAKDOWN:*%0A` +
      `• Items Subtotal: ৳ ${totals.rawSubtotal.toLocaleString()}%0A` +
      (totals.comboDiscount > 0 ? `• Combo Deal Discount: -৳ ${totals.comboDiscount.toLocaleString()}%0A` : '') +
      `• Delivery Fee (${deliveryLocation === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}): ৳ ${totals.deliveryCharge}%0A` +
      `• *Total Bill:* ৳ ${totals.total.toLocaleString()}%0A%0A` +
      `💵 *PAYMENT TERMS:*%0A` +
      `• 30% Advance: ৳ ${totals.advance.toLocaleString()}%0A` +
      `• Remaining COD: ৳ ${totals.due.toLocaleString()}%0A%0A` +
      `Please confirm my order and share bKash / Nagad merchant details. Thank you!`;

    return `https://wa.me/8801972304749?text=${message}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        comboSelectedIds,
        deliveryLocation,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        addMultipleItems,
        updateQuantity,
        removeItem,
        clearCart,
        toggleComboItem,
        autoSelectComboDeal,
        setDeliveryLocation,
        totals,
        getWhatsAppCheckoutUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
