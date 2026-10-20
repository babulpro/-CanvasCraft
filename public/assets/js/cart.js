/**
 * CanvasCraft BD - Universal E-Commerce Cart & Combo Deal Engine
 * Supports cross-page persistence, live size/material/frame customization, 
 * and Max 6-Piece Combo Deal bundling with instant WhatsApp ordering.
 */

const CART_STORAGE_KEY = 'canvascraft_cart_v1';
const COMBO_SELECTION_KEY = 'canvascraft_combo_v1';

// Standard Single Sizing Table & Pricing (in BDT)
const STANDARD_SIZES = [
  { code: '6x8', label: '6×8″ Mini Photo Tile', w: 6, h: 8, pricePvc: 60, priceCanvas: 150, sub: 'Desk / Accent Tile' },
  { code: '8x12', label: '8×12″ Classic Wall Board', w: 8, h: 12, pricePvc: 120, priceCanvas: 250, sub: 'Standard Wall Board' },
  { code: '12x16', label: '12×16″ Medium Print', w: 12, h: 16, pricePvc: 200, priceCanvas: 450, sub: 'Bedside & Gallery Wall' },
  { code: '16x24', label: '16×24″ Studio Canvas (Solo Promo)', w: 16, h: 24, pricePvc: 350, priceCanvas: 650, sub: 'Statement Solo Canvas', badge: 'Solo Promo' },
  { code: '20x30', label: '20×30″ Large Statement Canvas', w: 20, h: 30, pricePvc: 550, priceCanvas: 950, sub: 'Living Room Eye-Level' },
  { code: '24x36', label: '24×36″ Grand Gallery Canvas', w: 24, h: 36, pricePvc: 750, priceCanvas: 1350, sub: 'Oversized Masterpiece', badge: 'Grand Scale' }
];

const FRAME_OPTIONS = [
  { type: 'none', name: 'Rimless Gallery Wrap', price: 0, tag: 'Free' },
  { type: 'black', name: 'Floating Black Oak', price: 400, tag: '+৳ 400' },
  { type: 'walnut', name: 'Floating Warm Walnut', price: 500, tag: '+৳ 500' },
  { type: 'white', name: 'Floating Modern White', price: 400, tag: '+৳ 400' },
  { type: 'gold', name: 'Classic Italian Gold', price: 500, tag: '+৳ 500' }
];

// Helper: Get cart from localStorage
function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading cart:', e);
    return [];
  }
}

// Helper: Save cart to localStorage
function saveCartItems(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartBadges();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

// Helper: Get selected combo item IDs from localStorage
function getComboSelectedIds() {
  try {
    const raw = localStorage.getItem(COMBO_SELECTION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveComboSelectedIds(ids) {
  try {
    localStorage.setItem(COMBO_SELECTION_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Error saving combo IDs:', e);
  }
}

// Update badges on all pages
function updateCartBadges() {
  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  document.querySelectorAll('.cart-count-badge, #cartBadge').forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.textContent = '0';
    }
  });
}

// Add item to cart
function addItemToCart(item) {
  const items = getCartItems();
  
  // Check if identical item already exists (same artwork, size, material, frame)
  const existingIdx = items.findIndex(i => 
    i.productId === item.productId &&
    i.sizeCode === item.sizeCode &&
    i.material === item.material &&
    i.frameType === item.frameType
  );

  if (existingIdx >= 0) {
    items[existingIdx].quantity += (item.quantity || 1);
    items[existingIdx].totalPrice = items[existingIdx].quantity * items[existingIdx].unitPrice;
  } else {
    items.push({
      id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      productId: item.productId,
      title: item.title,
      image: item.image,
      comboImages: item.comboImages || [],
      category: item.category || 'Artwork',
      sizeCode: item.sizeCode,
      sizeLabel: item.sizeLabel,
      width: item.width,
      height: item.height,
      material: item.material, // 'pvc' | 'canvas'
      materialName: item.materialName,
      frameType: item.frameType, // 'none' | 'black' | 'walnut' | 'white' | 'gold'
      frameName: item.frameName,
      basePrice: item.basePrice,
      framePrice: item.framePrice,
      unitPrice: item.unitPrice,
      quantity: item.quantity || 1,
      totalPrice: (item.quantity || 1) * item.unitPrice
    });
  }

  saveCartItems(items);
  showToastNotification(`Added "${item.title}" (${item.sizeCode}) to your bag!`);
  renderCartDrawer();
  openCartDrawer();
}

// Update quantity
function updateCartQuantity(cartItemId, delta) {
  const items = getCartItems();
  const idx = items.findIndex(i => i.id === cartItemId);
  if (idx < 0) return;

  items[idx].quantity += delta;
  if (items[idx].quantity <= 0) {
    items.splice(idx, 1);
    // Remove from combo selection if present
    const comboIds = getComboSelectedIds().filter(id => id !== cartItemId);
    saveComboSelectedIds(comboIds);
  } else {
    items[idx].totalPrice = items[idx].quantity * items[idx].unitPrice;
  }

  saveCartItems(items);
  renderCartDrawer();
}

// Remove item completely
function removeCartItem(cartItemId) {
  const items = getCartItems().filter(i => i.id !== cartItemId);
  const comboIds = getComboSelectedIds().filter(id => id !== cartItemId);
  saveCartItems(items);
  saveComboSelectedIds(comboIds);
  renderCartDrawer();
}

// Clear all cart
function clearEntireCart() {
  saveCartItems([]);
  saveComboSelectedIds([]);
  renderCartDrawer();
}

// Toggle item into/out of the Max 6-Piece Combo Deal
function toggleComboItem(cartItemId) {
  let comboIds = getComboSelectedIds();
  const items = getCartItems();
  
  if (comboIds.includes(cartItemId)) {
    comboIds = comboIds.filter(id => id !== cartItemId);
  } else {
    // Check total piece count of currently selected items
    let currentPieceCount = 0;
    comboIds.forEach(id => {
      const it = items.find(i => i.id === id);
      if (it) currentPieceCount += it.quantity;
    });

    const targetItem = items.find(i => i.id === cartItemId);
    const addedCount = targetItem ? targetItem.quantity : 1;

    if (currentPieceCount + addedCount > 6) {
      alert('Maximum 6 pieces allowed in a single Combo Deal! Please select up to 6 pieces.');
      return;
    }
    comboIds.push(cartItemId);
  }

  saveComboSelectedIds(comboIds);
  renderCartDrawer();
}

// Select all eligible items up to 6 pieces into combo
function autoSelectComboDeal() {
  const items = getCartItems();
  let selected = [];
  let count = 0;

  for (let it of items) {
    if (count + it.quantity <= 6) {
      selected.push(it.id);
      count += it.quantity;
    } else if (count < 6) {
      selected.push(it.id);
      break;
    }
  }

  saveComboSelectedIds(selected);
  renderCartDrawer();
}

// Calculate Combo Discount & Pricing
function calculateCartTotals() {
  const items = getCartItems();
  const comboIds = getComboSelectedIds();
  
  let rawSubtotal = 0;
  let comboItemsList = [];
  let nonComboItemsList = [];

  items.forEach(it => {
    rawSubtotal += it.totalPrice;
    if (comboIds.includes(it.id)) {
      comboItemsList.push(it);
    } else {
      nonComboItemsList.push(it);
    }
  });

  let totalComboPieces = comboItemsList.reduce((sum, i) => sum + i.quantity, 0);
  let comboDiscount = 0;
  let comboDealName = '';

  if (totalComboPieces >= 3 && totalComboPieces <= 6) {
    // Check if all combo items share the same standard size
    const allSameSize = comboItemsList.every(i => i.sizeCode === comboItemsList[0].sizeCode);
    const firstSize = comboItemsList[0]?.sizeCode;

    if (allSameSize && firstSize === '6x8' && totalComboPieces === 6) {
      // 6x8" 6 pcs deal = ৳ 300
      const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
      comboDiscount = Math.max(0, standardCost - 300);
      comboDealName = '6-Piece 6×8″ Mini Tile Combo Deal (Only ৳ 300)';
    } else if (allSameSize && firstSize === '8x12' && totalComboPieces === 3) {
      // 8x12" 3 pcs deal = ৳ 300
      const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
      comboDiscount = Math.max(0, standardCost - 300);
      comboDealName = '3-Piece 8×12″ Wall Board Combo Deal (Only ৳ 300)';
    } else if (allSameSize && firstSize === '8x12' && totalComboPieces === 6) {
      // 8x12" 6 pcs deal = ৳ 550
      const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
      comboDiscount = Math.max(0, standardCost - 550);
      comboDealName = '6-Piece 8×12″ Gallery Board Combo Deal (Only ৳ 550)';
    } else if (allSameSize && firstSize === '12x16' && totalComboPieces === 3) {
      // 12x16" 3 pcs deal = ৳ 550
      const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
      comboDiscount = Math.max(0, standardCost - 550);
      comboDealName = '3-Piece 12×16″ Medium Canvas Combo Deal (Only ৳ 550)';
    } else if (allSameSize && firstSize === '12x16' && totalComboPieces === 6) {
      // 12x16" 6 pcs deal = ৳ 1050
      const standardCost = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
      comboDiscount = Math.max(0, standardCost - 1050);
      comboDealName = '6-Piece 12×16″ Medium Canvas Combo Deal (Only ৳ 1,050)';
    } else {
      // Mixed size combo deal: 15% bundle discount on bundled items!
      const comboRaw = comboItemsList.reduce((sum, i) => sum + i.totalPrice, 0);
      comboDiscount = Math.round(comboRaw * 0.15);
      comboDealName = `${totalComboPieces}-Piece Curated Art Combo Deal (15% Bundle Discount)`;
    }
  }

  const subtotal = Math.max(0, rawSubtotal - comboDiscount);
  const deliveryCharge = getDeliveryCharge();
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
}

let currentDeliveryLocation = 'dhaka'; // 'dhaka' (৳ 80) or 'outside' (৳ 150)
function getDeliveryCharge() {
  return currentDeliveryLocation === 'dhaka' ? 80 : 150;
}

function setDeliveryLocation(loc) {
  currentDeliveryLocation = loc;
  renderCartDrawer();
}

// Slide-Over Drawer Controls
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'auto';
  }
}

// Render the entire Cart Drawer DOM
function renderCartDrawer() {
  const itemsContainer = document.getElementById('cartDrawerItems');
  const footerContainer = document.getElementById('cartDrawerFooter');
  const emptyState = document.getElementById('cartDrawerEmpty');
  if (!itemsContainer || !footerContainer) return;

  const items = getCartItems();
  const comboIds = getComboSelectedIds();
  const totals = calculateCartTotals();

  if (items.length === 0) {
    itemsContainer.innerHTML = '';
    emptyState?.classList.remove('hidden');
    footerContainer.classList.add('hidden');
    updateCartBadges();
    return;
  }

  emptyState?.classList.add('hidden');
  footerContainer.classList.remove('hidden');

  // Render Items List with Combo Checkbox
  itemsContainer.innerHTML = `
    <!-- COMBO DEAL MAKER BANNER (Max 6 Pieces) -->
    <div class="mb-4 bg-gradient-to-br from-brand-50 to-amber-50/60 p-3 rounded-2xl border border-brand-200/90 shadow-2xs">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-bold text-stone-900 flex items-center gap-1.5">
          <i data-lucide="sparkles" class="w-4 h-4 text-brand-600"></i>
          <span>Combo Deal Maker (Max 6 Pcs)</span>
        </span>
        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${totals.totalComboPieces >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}">
          ${totals.totalComboPieces} of 6 Pcs in Combo
        </span>
      </div>

      <p class="text-[10px] text-stone-600 mb-2">
        Bundle 3 to 6 pieces to unlock discounted package pricing (or up to 15% off)!
      </p>

      ${totals.comboDiscount > 0 ? `
        <div class="bg-emerald-100/90 border border-emerald-300 text-emerald-900 px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-between mb-2">
          <span class="flex items-center gap-1">
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
            ${totals.comboDealName}
          </span>
          <span class="bg-emerald-600 text-white px-2 py-0.2 rounded-full text-[9px]">Saved ৳ ${totals.comboDiscount}</span>
        </div>
      ` : totals.totalComboPieces > 0 && totals.totalComboPieces < 3 ? `
        <div class="text-[10px] text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-xl mb-2 flex items-center gap-1">
          <i data-lucide="info" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
          <span>Add ${3 - totals.totalComboPieces} more piece to activate the Combo Deal discount!</span>
        </div>
      ` : totals.totalPieces >= 3 && totals.totalComboPieces === 0 ? `
        <button onclick="autoSelectComboDeal()" class="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition shadow-xs flex items-center justify-center gap-1.5 mb-1">
          <i data-lucide="zap" class="w-3.5 h-3.5"></i>
          <span>Auto-Bundle eligible ${Math.min(6, totals.totalPieces)} pieces as Combo Deal</span>
        </button>
      ` : ''}

      <!-- Visual 6 Mini Slots -->
      <div class="grid grid-cols-6 gap-1 mt-1">
        ${[0, 1, 2, 3, 4, 5].map(idx => {
          const isFilled = idx < totals.totalComboPieces;
          return `
            <div class="h-6 rounded border flex items-center justify-center text-[8px] font-mono font-bold transition ${isFilled ? 'bg-brand-600 text-white border-brand-700' : 'bg-white/80 border-dashed border-stone-300 text-stone-400'}">
              ${isFilled ? '✓' : '#' + (idx + 1)}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- CART ITEMS LIST -->
    <div class="space-y-3">
      ${items.map(it => {
        const isSelectedInCombo = comboIds.includes(it.id);
        return `
          <div class="p-3 bg-white rounded-2xl border ${isSelectedInCombo ? 'border-brand-500 ring-1 ring-brand-400 bg-brand-50/20' : 'border-stone-200'} shadow-2xs transition flex gap-3 relative group">
            
            <!-- Thumbnail -->
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 relative">
              <img src="${it.image}" alt="${it.title}" class="w-full h-full object-cover">
              <span class="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[7px] font-mono px-1 rounded">${it.sizeCode}</span>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-1">
                  <h4 class="text-xs font-bold text-stone-900 truncate leading-tight">${it.title}</h4>
                  <button onclick="removeCartItem('${it.id}')" class="text-stone-400 hover:text-red-500 transition p-0.5" title="Remove Item">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
                
                <div class="text-[9px] text-stone-500 space-y-0.5 mt-0.5">
                  <p class="font-medium text-stone-700">${it.sizeLabel} • <span class="capitalize">${it.material === 'pvc' ? '3mm PVC Board' : 'Pine Canvas'}</span></p>
                  <p class="text-stone-500">Frame: <strong class="text-stone-800">${it.frameName}</strong></p>
                </div>
                ${it.comboImages && it.comboImages.length > 0 ? `
                  <div class="mt-2 pt-1.5 border-t border-stone-100">
                    <div class="flex items-center justify-between text-[8px] font-bold text-stone-600 mb-1">
                      <span>Attached Photos (${it.comboImages.length} Pcs):</span>
                      <span class="text-emerald-700">✓ All Attached</span>
                    </div>
                    <div class="grid grid-cols-4 sm:grid-cols-6 gap-1">
                      ${it.comboImages.map((p, pIdx) => `
                        <div class="relative rounded-md overflow-hidden bg-stone-900 border border-stone-200 h-9" title="${p.fileName || 'Photo ' + (pIdx + 1)}">
                          <img src="${p.thumb || p.src}" class="w-full h-full object-cover">
                          <span class="absolute top-0.5 left-0.5 bg-black/75 text-white text-[6px] font-mono font-bold px-0.5 rounded">#${pIdx + 1}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Bottom Row: Price, Stepper & Combo Checkbox -->
              <div class="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                <div class="flex items-center gap-1.5">
                  <!-- Stepper -->
                  <div class="flex items-center border border-stone-200 rounded-lg bg-stone-50 text-[10px]">
                    <button onclick="updateCartQuantity('${it.id}', -1)" class="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-l transition font-bold">−</button>
                    <span class="w-6 text-center font-bold text-stone-900">${it.quantity}</span>
                    <button onclick="updateCartQuantity('${it.id}', 1)" class="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-r transition font-bold">+</button>
                  </div>
                  <span class="text-xs font-black text-stone-900">৳ ${it.totalPrice.toLocaleString()}</span>
                </div>

                <!-- Combo inclusion toggle -->
                <button type="button" onclick="toggleComboItem('${it.id}')" 
                        class="text-[9px] font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 ${isSelectedInCombo ? 'bg-brand-600 text-white border-brand-600' : 'bg-stone-100 text-stone-600 border-stone-200 hover:border-brand-400'}">
                  <i data-lucide="${isSelectedInCombo ? 'check-square' : 'square'}" class="w-3 h-3"></i>
                  <span>${isSelectedInCombo ? 'In Combo' : '+ Combo'}</span>
                </button>
              </div>

            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Render Footer with Breakdown, Delivery, & WhatsApp Checkout
  footerContainer.innerHTML = `
    <!-- Delivery Location Selector -->
    <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-200 mb-3 text-[10px]">
      <span class="font-bold text-stone-800 block mb-1.5 flex items-center gap-1">
        <i data-lucide="truck" class="w-3.5 h-3.5 text-brand-600"></i> Delivery Location:
      </span>
      <div class="grid grid-cols-2 gap-1.5">
        <button type="button" onclick="setDeliveryLocation('dhaka')" class="py-1 px-2 rounded-lg text-center font-bold border transition ${currentDeliveryLocation === 'dhaka' ? 'bg-stone-900 text-white border-stone-900 shadow-2xs' : 'bg-white text-stone-600 border-stone-300'}">
          Dhaka City (৳ 80)
        </button>
        <button type="button" onclick="setDeliveryLocation('outside')" class="py-1 px-2 rounded-lg text-center font-bold border transition ${currentDeliveryLocation === 'outside' ? 'bg-stone-900 text-white border-stone-900 shadow-2xs' : 'bg-white text-stone-600 border-stone-300'}">
          Outside Dhaka (৳ 150)
        </button>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="space-y-1.5 text-xs text-stone-600 pb-3 border-b border-stone-200">
      <div class="flex items-center justify-between">
        <span>Cart Items Subtotal (${totals.totalPieces} pcs):</span>
        <span class="font-mono font-bold text-stone-900">৳ ${totals.rawSubtotal.toLocaleString()}</span>
      </div>

      ${totals.comboDiscount > 0 ? `
        <div class="flex items-center justify-between text-emerald-700 font-bold">
          <span class="flex items-center gap-1">
            <i data-lucide="tag" class="w-3 h-3"></i> Combo Deal Discount:
          </span>
          <span class="font-mono">− ৳ ${totals.comboDiscount.toLocaleString()}</span>
        </div>
      ` : ''}

      <div class="flex items-center justify-between">
        <span>Delivery Fee (${currentDeliveryLocation === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}):</span>
        <span class="font-mono font-bold text-stone-900">৳ ${totals.deliveryCharge}</span>
      </div>

      <div class="flex items-center justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-200">
        <span>Total Payable:</span>
        <span class="text-base text-brand-700">৳ ${totals.total.toLocaleString()}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-[10px] bg-stone-100 p-2 rounded-lg mt-2 text-stone-600">
        <div>
          <span class="block text-stone-400">30% Advance (bKash/Nagad):</span>
          <strong class="text-stone-900 font-bold">৳ ${totals.advance.toLocaleString()}</strong>
        </div>
        <div>
          <span class="block text-stone-400">Due on Delivery (COD):</span>
          <strong class="text-emerald-700 font-bold">৳ ${totals.due.toLocaleString()}</strong>
        </div>
      </div>
    </div>

    <!-- Order CTA Buttons -->
    <div class="pt-3 space-y-2">
      <button onclick="checkoutViaWhatsApp()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-98">
        <i data-lucide="message-circle" class="w-4 h-4"></i>
        <span>Place Order via WhatsApp (Instant Confirmation)</span>
      </button>

      <div class="flex items-center justify-between text-[10px] text-stone-400 px-1">
        <button onclick="clearEntireCart()" class="hover:text-red-500 transition">Clear Cart</button>
        <span class="flex items-center gap-1">
          <i data-lucide="shield-check" class="w-3 h-3 text-emerald-600"></i>
          100% Quality Assurance
        </span>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// Generate WhatsApp order message with full itemization and combo deal breakdown
function checkoutViaWhatsApp() {
  const items = getCartItems();
  if (items.length === 0) return;

  const totals = calculateCartTotals();
  let detailsText = '';

  items.forEach((it, idx) => {
    const isCombo = getComboSelectedIds().includes(it.id);
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
    `• Delivery Fee (${currentDeliveryLocation === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}): ৳ ${totals.deliveryCharge}%0A` +
    `• *Total Bill:* ৳ ${totals.total.toLocaleString()}%0A%0A` +
    `💵 *PAYMENT TERMS:*%0A` +
    `• 30% Advance: ৳ ${totals.advance.toLocaleString()}%0A` +
    `• Remaining COD: ৳ ${totals.due.toLocaleString()}%0A%0A` +
    `Please confirm my order and share bKash / Nagad merchant details. Thank you!`;

  window.open(`https://wa.me/8801972304749?text=${message}`, '_blank');
}

// Global Modal State for "Add to Cart" Configuration
let activeModalProduct = null;
let modalSelectedSize = STANDARD_SIZES[3]; // default 16x24
let modalSelectedMaterial = 'pvc'; // 'pvc' | 'canvas'
let modalSelectedFrame = FRAME_OPTIONS[0]; // default none (rimless)
let modalQuantity = 1;

function openAddToCartModal(productId) {
  // Find product from PRODUCTS global in products.html or fallback
  if (typeof PRODUCTS !== 'undefined') {
    activeModalProduct = PRODUCTS.find(p => p.id === productId);
  }
  if (!activeModalProduct) return;

  modalSelectedSize = STANDARD_SIZES[3]; // 16x24 default
  modalSelectedMaterial = 'pvc';
  modalSelectedFrame = FRAME_OPTIONS[0];
  modalQuantity = 1;

  const modal = document.getElementById('addToCartModal');
  if (!modal) return;

  renderAddToCartModalContent();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAddToCartModal() {
  const modal = document.getElementById('addToCartModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function renderAddToCartModalContent() {
  if (!activeModalProduct) return;

  const p = activeModalProduct;
  document.getElementById('modalProductImg').src = p.image;
  document.getElementById('modalProductTitle').textContent = p.title;
  document.getElementById('modalProductCategory').textContent = p.categoryLabel;

  // Render Size Options
  const sizeContainer = document.getElementById('modalSizeSelector');
  if (sizeContainer) {
    sizeContainer.innerHTML = STANDARD_SIZES.map(s => {
      const isSelected = modalSelectedSize.code === s.code;
      const price = modalSelectedMaterial === 'pvc' ? s.pricePvc : s.priceCanvas;
      return `
        <button type="button" onclick="selectModalSize('${s.code}')" 
                class="p-2 rounded-xl border text-left transition flex flex-col justify-between ${isSelected ? 'border-brand-500 bg-brand-50/70 ring-1 ring-brand-500 shadow-2xs' : 'border-stone-200 bg-white hover:border-brand-300'}">
          <div>
            <span class="text-xs font-bold text-stone-900 block leading-tight">${s.w}×${s.h}″</span>
            <span class="text-[9px] text-stone-500 block">${s.sub}</span>
          </div>
          <span class="text-[10px] font-extrabold text-brand-700 mt-1 block">৳ ${price.toLocaleString()}</span>
        </button>
      `;
    }).join('');
  }

  // Update Material Buttons
  const pvcBtn = document.getElementById('modalMatPvcBtn');
  const canvasBtn = document.getElementById('modalMatCanvasBtn');
  if (pvcBtn && canvasBtn) {
    if (modalSelectedMaterial === 'pvc') {
      pvcBtn.className = 'p-2 rounded-xl border-2 border-brand-500 bg-brand-50/70 text-left transition shadow-xs';
      canvasBtn.className = 'p-2 rounded-xl border border-stone-200 bg-white text-left transition hover:border-brand-300';
    } else {
      canvasBtn.className = 'p-2 rounded-xl border-2 border-brand-500 bg-brand-50/70 text-left transition shadow-xs';
      pvcBtn.className = 'p-2 rounded-xl border border-stone-200 bg-white text-left transition hover:border-brand-300';
    }
  }

  // Render Frame Options
  const frameContainer = document.getElementById('modalFrameSelector');
  if (frameContainer) {
    frameContainer.innerHTML = FRAME_OPTIONS.map(f => {
      const isSelected = modalSelectedFrame.type === f.type;
      return `
        <button type="button" onclick="selectModalFrame('${f.type}')" 
                class="p-1.5 rounded-xl border text-center transition flex flex-col items-center ${isSelected ? 'border-brand-500 bg-brand-50/70 ring-1 ring-brand-500 shadow-2xs' : 'border-stone-200 bg-white hover:border-brand-300'}">
          <span class="text-[9px] font-bold text-stone-800 leading-tight block">${f.name.replace('Floating ', '')}</span>
          <span class="text-[8px] text-brand-700 font-semibold mt-0.5">${f.tag}</span>
        </button>
      `;
    }).join('');
  }

  // Quantity Display
  const qtyDisplay = document.getElementById('modalQtyDisplay');
  if (qtyDisplay) qtyDisplay.textContent = modalQuantity;

  // Price Calculation
  const basePrice = modalSelectedMaterial === 'pvc' ? modalSelectedSize.pricePvc : modalSelectedSize.priceCanvas;
  const framePrice = modalSelectedFrame.price;
  const unitPrice = basePrice + framePrice;
  const subtotal = unitPrice * modalQuantity;

  const priceTag = document.getElementById('modalSubtotalDisplay');
  if (priceTag) priceTag.textContent = `৳ ${subtotal.toLocaleString()}`;

  if (window.lucide) lucide.createIcons();
}

function selectModalSize(code) {
  const s = STANDARD_SIZES.find(item => item.code === code);
  if (s) modalSelectedSize = s;
  renderAddToCartModalContent();
}

function selectModalMaterial(mat) {
  modalSelectedMaterial = mat;
  renderAddToCartModalContent();
}

function selectModalFrame(type) {
  const f = FRAME_OPTIONS.find(item => item.type === type);
  if (f) modalSelectedFrame = f;
  renderAddToCartModalContent();
}

function changeModalQty(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  renderAddToCartModalContent();
}

function confirmAddToCartFromModal() {
  if (!activeModalProduct) return;

  const basePrice = modalSelectedMaterial === 'pvc' ? modalSelectedSize.pricePvc : modalSelectedSize.priceCanvas;
  const framePrice = modalSelectedFrame.price;
  const unitPrice = basePrice + framePrice;

  addItemToCart({
    productId: activeModalProduct.id,
    title: activeModalProduct.title,
    image: activeModalProduct.image,
    category: activeModalProduct.categoryLabel,
    sizeCode: modalSelectedSize.code,
    sizeLabel: modalSelectedSize.label,
    width: modalSelectedSize.w,
    height: modalSelectedSize.h,
    material: modalSelectedMaterial,
    materialName: modalSelectedMaterial === 'pvc' ? '3mm Rigid PVC Board (Free Tape)' : '1.25″ Pine Wood Canvas',
    frameType: modalSelectedFrame.type,
    frameName: modalSelectedFrame.name,
    basePrice: basePrice,
    framePrice: framePrice,
    unitPrice: unitPrice,
    quantity: modalQuantity
  });

  closeAddToCartModal();
}

// Toast notification helper
function showToastNotification(message) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.className = 'fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-stone-700 transition-all duration-300 transform translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i><span>${message}</span>`;
  if (window.lucide) lucide.createIcons();

  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
});
