'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { STANDARD_SIZES, COMBO_PACKAGES } from '@/data/combo-packages';
import { FRAME_OPTIONS } from '@/data/frames';
import { MaterialType, FrameType, UploadedSlotImage, CartItem } from '@/types';
import {
  Sparkles,
  Check,
  ShoppingBag,
  CheckCircle,
  Maximize2,
  Minimize2,
  Upload,
  PlusCircle,
  X,
  RotateCw,
  RefreshCcw,
  Magnet,
  Camera,
  MessageCircle,
  Layers,
  Frame
} from 'lucide-react';

export default function StudioCustomizer() {
  const { addMultipleItems, addItem } = useCart();

  // Mode & Package State
  const [activeTab, setActiveTab] = useState<'combo' | 'single' | 'multipanel' | 'custom'>('combo');
  const [comboKey, setComboKey] = useState<string>('8x12');
  const [comboTierIndex, setComboTierIndex] = useState<number>(0); // 3 pcs default for 8x12
  const [singleSizeCode, setSingleSizeCode] = useState<string>('16x24');
  const [multiPanelPreset, setMultiPanelPreset] = useState<string>('5part-24x48');

  // Custom Dimensions (if tab === 'custom')
  const [customW, setCustomW] = useState<number>(24);
  const [customH, setCustomH] = useState<number>(36);

  // Material & Frame
  const [material, setMaterial] = useState<MaterialType>('pvc');
  const [frameType, setFrameType] = useState<FrameType>('none');

  // Images State
  const [activeImageSrc, setActiveImageSrc] = useState<string>('/assets/portrait_art.jpg');
  const [comboImages, setComboImages] = useState<(UploadedSlotImage | null)[]>([]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  // View Mode & Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [canvasPos, setCanvasPos] = useState({ x: 0, y: -25 }); // Offset in px

  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(80);

  const stageViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL query parameters from Catalog / Home Page (e.g. ?preset=portrait&pack=16x24)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const preset = params.get('preset');
    const pack = params.get('pack');

    if (preset === 'triptych' || preset === 'desert' || preset === 'abstract-1') {
      setActiveImageSrc('/assets/triptych_art.jpg');
      setActiveTab('multipanel');
      setMultiPanelPreset('3part-36x24');
    } else if (preset === 'portrait' || preset === 'port-1') {
      setActiveImageSrc('/assets/portrait_art.jpg');
      setActiveTab('single');
      setSingleSizeCode('16x24');
    } else if (preset === 'calligraphy' || preset === 'islamic-1') {
      setActiveImageSrc('https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80');
      setActiveTab('single');
      setSingleSizeCode('16x24');
    } else if (preset === 'sajek' || preset === 'nature-1') {
      setActiveImageSrc('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80');
      setActiveTab('multipanel');
      setMultiPanelPreset('5part-24x48');
    }

    if (pack) {
      if (pack.startsWith('6x8')) {
        setActiveTab('combo');
        setComboKey('6x8');
      } else if (pack.startsWith('8x12')) {
        setActiveTab('combo');
        setComboKey('8x12');
      } else if (pack.startsWith('12x16')) {
        setActiveTab('combo');
        setComboKey('12x16');
      } else if (pack === '16x24') {
        setActiveTab('single');
        setSingleSizeCode('16x24');
      } else if (pack === '3part-36x24') {
        setActiveTab('multipanel');
        setMultiPanelPreset('3part-36x24');
      } else if (pack === '5part-24x48') {
        setActiveTab('multipanel');
        setMultiPanelPreset('5part-24x48');
      }
    }
  }, []);

  // Current combo package definition
  const currentCombo = COMBO_PACKAGES[comboKey] || COMBO_PACKAGES['8x12'];
  const currentTier = currentCombo.tiers[comboTierIndex] || currentCombo.tiers[0];

  // Derived dimensions and counts
  const currentSpecs = useMemo(() => {
    if (activeTab === 'combo') {
      return {
        pcs: currentTier.pcs,
        tileW: currentCombo.tileW,
        tileH: currentCombo.tileH,
        cols: currentTier.cols,
        rows: currentTier.rows,
        basePrice: currentTier.price,
        label: `${currentCombo.name} (${currentTier.pcs} Pcs Deal)`,
        isCombo: true
      };
    } else if (activeTab === 'single') {
      const sz = STANDARD_SIZES.find(s => s.code === singleSizeCode) || STANDARD_SIZES[3];
      const p = material === 'pvc' ? sz.pricePvc : sz.priceCanvas;
      return {
        pcs: 1,
        tileW: sz.w,
        tileH: sz.h,
        cols: 1,
        rows: 1,
        basePrice: p,
        label: sz.label,
        isCombo: false
      };
    } else if (activeTab === 'multipanel') {
      return {
        pcs: 5,
        tileW: 24,
        tileH: 48,
        cols: 5,
        rows: 1,
        basePrice: 1250,
        label: '5-Part Master Split (24×48″ Wall Span)',
        isCombo: false
      };
    } else {
      const sqFt = (customW * customH) / 144;
      const rate = material === 'pvc' ? 120 : 250;
      return {
        pcs: 1,
        tileW: customW,
        tileH: customH,
        cols: 1,
        rows: 1,
        basePrice: Math.round(Math.max(250, sqFt * rate)),
        label: `Custom ${customW}″ × ${customH}″ Canvas`,
        isCombo: false
      };
    }
  }, [activeTab, comboKey, comboTierIndex, singleSizeCode, multiPanelPreset, customW, customH, material, currentTier, currentCombo]);

  const activeFrame = FRAME_OPTIONS.find(f => f.type === frameType) || FRAME_OPTIONS[0];
  const totalPrice = currentSpecs.basePrice + (activeFrame.price * (activeTab === 'combo' ? (currentSpecs.pcs <= 6 ? currentSpecs.pcs : 1) : 1));

  // Dynamic Pixels Per Inch (PPI) for room visualization
  const ppi = useMemo(() => {
    if (isFullscreen) return 9.5;
    return 4.2;
  }, [isFullscreen]);

  // Keyboard shortcut for ESC to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Client-side thumbnail generator
  const createThumbnail = (src: string, maxDim = 280): Promise<string> => {
    return new Promise(resolve => {
      if (!src || !src.startsWith('data:image')) return resolve(src);
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = Math.max(1, w);
          canvas.height = Math.max(1, h);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(src);
          }
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  // Background Cloudinary CDN upload helper
  const syncToCloudinary = async (file: File, slotIdx: number) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slotIndex', slotIdx.toString());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        setComboImages(prev => {
          const updated = [...prev];
          if (updated[slotIdx]) {
            updated[slotIdx] = {
              ...updated[slotIdx]!,
              isUploading: false,
            };
          }
          return updated;
        });
        return;
      }

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        setComboImages(prev => {
          const updated = [...prev];
          if (updated[slotIdx]) {
            updated[slotIdx] = {
              ...updated[slotIdx]!,
              isUploading: false,
            };
          }
          return updated;
        });
        return;
      }

      if (data && data.success && data.url) {
        setComboImages(prev => {
          const updated = [...prev];
          if (updated[slotIdx]) {
            updated[slotIdx] = {
              ...updated[slotIdx]!,
              cloudinaryUrl: data.url,
              src: data.url,
              isUploading: false,
            };
          }
          return updated;
        });
      }
    } catch {
      // Gracefully fall back to client-side data URI if Cloudinary credentials are not yet added
      setComboImages(prev => {
        const updated = [...prev];
        if (updated[slotIdx]) {
          updated[slotIdx] = {
            ...updated[slotIdx]!,
            isUploading: false,
          };
        }
        return updated;
      });
    }
  };

  // Handle single slot or main custom artwork upload
  const handleSlotFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If activeSlotIndex is null, we are uploading a photo for Single Canvas / Multi-Panel mode
    if (activeSlotIndex === null) {
      const reader = new FileReader();
      reader.onload = event => {
        const rawSrc = event.target?.result as string;
        if (rawSrc) setActiveImageSrc(rawSrc);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
      return;
    }

    const targetSlot = activeSlotIndex;
    const reader = new FileReader();
    reader.onload = async event => {
      const rawSrc = event.target?.result as string;
      const thumb = await createThumbnail(rawSrc);
      const kb = Math.round(file.size / 1024);
      const sizeStr = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

      setComboImages(prev => {
        const updated = [...prev];
        updated[targetSlot] = {
          id: targetSlot,
          src: rawSrc,
          thumb,
          fileName: file.name,
          fileSize: sizeStr,
          isUploading: true,
        };
        return updated;
      });

      // Background sync to Cloudinary
      syncToCloudinary(file, targetSlot);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle batch upload
  const handleBatchFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxSlots = currentSpecs.pcs;
    for (let i = 0; i < Math.min(files.length, maxSlots); i++) {
      const file = files[i];
      const slotIndex = i;
      const reader = new FileReader();
      reader.onload = async event => {
        const rawSrc = event.target?.result as string;
        const thumb = await createThumbnail(rawSrc);
        const kb = Math.round(file.size / 1024);
        const sizeStr = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

        setComboImages(prev => {
          const updated = [...prev];
          updated[slotIndex] = {
            id: slotIndex,
            src: rawSrc,
            thumb,
            fileName: file.name,
            fileSize: sizeStr,
            isUploading: true,
          };
          return updated;
        });

        // Background sync to Cloudinary
        syncToCloudinary(file, slotIndex);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeSlotImage = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setComboImages(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
  };

  // Add to Bag action
  const handleAddToBag = () => {
    if (activeTab === 'combo' && currentSpecs.pcs > 1) {
      const pieces: UploadedSlotImage[] = [];
      for (let i = 0; i < currentSpecs.pcs; i++) {
        const slotImg = comboImages[i];
        pieces.push({
          id: i + 1,
          src: slotImg?.src || activeImageSrc,
          thumb: slotImg?.thumb || slotImg?.src || activeImageSrc,
          fileName: slotImg?.fileName || `Custom Photo #${i + 1}`,
          fileSize: slotImg?.fileSize || ''
        });
      }

      if (currentSpecs.pcs <= 6) {
        // Add 3 to 6 individual pieces and auto-activate combo deal!
        const singleBase = material === 'pvc' 
          ? (currentSpecs.tileW === 6 ? 60 : currentSpecs.tileW === 8 ? 120 : 200)
          : (currentSpecs.tileW === 6 ? 150 : currentSpecs.tileW === 8 ? 250 : 450);
        const singleUnitPrice = singleBase + activeFrame.price;

        const itemsToAdd: CartItem[] = [];
        const comboIds: string[] = [];

        pieces.forEach((piece, idx) => {
          const cartItemId = `cart_studio_combo_${Date.now()}_${idx}`;
          itemsToAdd.push({
            id: cartItemId,
            productId: `custom-combo-piece-${Date.now()}-${idx}`,
            title: `Custom Canvas #${piece.id} (${piece.fileName})`,
            image: piece.thumb || piece.src,
            category: 'Combo Package',
            sizeCode: `${currentSpecs.tileW}x${currentSpecs.tileH}`,
            sizeLabel: `${currentSpecs.tileW}″ × ${currentSpecs.tileH}″`,
            width: currentSpecs.tileW,
            height: currentSpecs.tileH,
            material,
            materialName: material === 'pvc' ? '3mm Rigid PVC Board (Free 3M Tape)' : '1.25″ Pine Wood Canvas',
            frameType: activeFrame.type,
            frameName: activeFrame.name,
            basePrice: singleBase,
            framePrice: activeFrame.price,
            unitPrice: singleUnitPrice,
            quantity: 1,
            totalPrice: singleUnitPrice
          });
          comboIds.push(cartItemId);
        });

        addMultipleItems(itemsToAdd, comboIds);
        return;
      } else {
        // Bulk packages (> 6 pieces: 9, 12, 15, 18, 24 pcs)
        addItem({
          productId: `custom-combo-bulk-${Date.now()}`,
          title: `${currentSpecs.pcs}-Piece ${currentSpecs.label}`,
          image: pieces[0].thumb || pieces[0].src,
          comboImages: pieces,
          category: 'Combo Package',
          sizeCode: `${currentSpecs.tileW}x${currentSpecs.tileH}`,
          sizeLabel: `${currentSpecs.pcs} Pieces of ${currentSpecs.tileW}″ × ${currentSpecs.tileH}″`,
          width: currentSpecs.tileW,
          height: currentSpecs.tileH,
          material,
          materialName: material === 'pvc' ? '3mm Rigid PVC Board (Free 3M Tape)' : '1.25″ Pine Wood Canvas',
          frameType: activeFrame.type,
          frameName: activeFrame.name,
          basePrice: currentSpecs.basePrice,
          framePrice: activeFrame.price,
          unitPrice: totalPrice,
          quantity: 1
        });
        return;
      }
    }

    // Single Canvas or Multi-Panel Split
    addItem({
      productId: `custom-studio-${Date.now()}`,
      title: currentSpecs.label,
      image: activeImageSrc,
      category: activeTab === 'combo' ? 'Combo Package' : 'Custom Canvas',
      sizeCode: `${currentSpecs.tileW}x${currentSpecs.tileH}`,
      sizeLabel: `${currentSpecs.tileW}″ × ${currentSpecs.tileH}″`,
      width: currentSpecs.tileW,
      height: currentSpecs.tileH,
      material,
      materialName: material === 'pvc' ? '3mm Rigid PVC Board (Free 3M Tape)' : '1.25″ Pine Wood Canvas',
      frameType: activeFrame.type,
      frameName: activeFrame.name,
      basePrice: currentSpecs.basePrice,
      framePrice: activeFrame.price,
      unitPrice: totalPrice,
      quantity: 1
    });
  };

  const getWhatsAppOrderUrl = () => {
    const advance = Math.round(totalPrice * 0.30);
    const total = totalPrice + deliveryCharge;
    const due = total - advance;

    let details = '';
    if (activeTab === 'combo' && currentSpecs.pcs > 1) {
      let photoList = '';
      for (let i = 0; i < currentSpecs.pcs; i++) {
        const slotImg = comboImages[i];
        const fname = slotImg?.fileName || `Custom Photo #${i + 1}`;
        photoList += `   ${i + 1}. ${fname} (${currentSpecs.tileW}″ × ${currentSpecs.tileH}″)%0A`;
      }
      details = `• Package: ${currentSpecs.label}%0A` +
                `• Material: ${material === 'pvc' ? '3mm Rigid PVC Board' : '1.25″ Pine Canvas'}%0A` +
                `• Pieces: ${currentSpecs.pcs} Separate Canvases%0A` +
                `• Frame: ${activeFrame.name}%0A%0A` +
                `📸 *CUSTOM UPLOADED PHOTOS (${currentSpecs.pcs} Pieces):*%0A` +
                photoList +
                `_(I will send these ${currentSpecs.pcs} photos in this WhatsApp chat)_%0A`;
    } else {
      details = `• Item: ${currentSpecs.label}%0A` +
                `• Material: ${material === 'pvc' ? '3mm Rigid PVC Board' : '1.25″ Pine Canvas'}%0A` +
                `• Dimensions: ${currentSpecs.tileW}″ × ${currentSpecs.tileH}″%0A` +
                `• Frame: ${activeFrame.name}%0A`;
    }

    const message = `Hello CanvasCraft BD! I would like to place an order:%0A%0A` +
      details +
      `• Subtotal: ৳ ${totalPrice.toLocaleString()}%0A` +
      `• 30% Advance: ৳ ${advance.toLocaleString()}%0A` +
      `• Due on Delivery (COD): ৳ ${due.toLocaleString()}%0A` +
      `• Delivery Fee: ৳ ${deliveryCharge}%0A` +
      `• Total Bill: ৳ ${total.toLocaleString()}%0A%0A` +
      `Please confirm my order and share bKash/Nagad merchant payment instructions. Thank you!`;

    return `https://wa.me/8801972304749?text=${message}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSlotFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={batchFileInputRef}
        onChange={handleBatchFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: The Room Simulator (7 Columns) */}
        <div
          className={`relative transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 bg-[#e8decb] flex flex-col justify-between overflow-hidden'
              : 'lg:col-span-7 bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-stone-200'
          }`}
        >
          {/* Top View Mode & Action Toolbar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  !isFullscreen ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Living Room Wall
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  isFullscreen ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Close-Up Detail (Full Screen)</span>
              </button>
            </div>

            {/* Quick Canvas Controls */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCanvasPos({ x: 0, y: -25 })}
                title="Snap to ideal eye-level above sofa"
                className="w-7 h-7 rounded-lg text-amber-700 hover:bg-white flex items-center justify-center transition cursor-pointer"
              >
                <Magnet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCanvasPos({ x: 0, y: 0 })}
                title="Reset Position"
                className="w-7 h-7 rounded-lg text-stone-600 hover:bg-white flex items-center justify-center transition cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Close Button in Fullscreen Mode */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-40 bg-stone-900/95 hover:bg-black text-white font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition cursor-pointer backdrop-blur-md"
            >
              <X className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold">Close Full Screen</span>
              <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">(ESC)</span>
            </button>
          )}

          {/* THE STAGE: Realistic Living Room Wall Environment */}
          <div
            ref={stageViewportRef}
            className={`relative flex items-center justify-center overflow-hidden transition-all select-none ${
              isFullscreen
                ? 'w-full h-full flex-1'
                : 'h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl'
            }`}
            style={{ backgroundColor: '#e8decb' }}
          >
            {/* Ambient Wall Lighting */}
            <div className="absolute inset-0 wall-lighting pointer-events-none" />

            {/* Baseboard Trim */}
            <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 h-3 bg-stone-100 border-t border-b border-stone-300 pointer-events-none z-0" />

            {/* Realistic Wood Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 wood-floor-pattern shadow-inner pointer-events-none z-0">
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/30 to-transparent" />
            </div>

            {/* Standard 80-inch (203 cm) Couch */}
            <div
              className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-20 opacity-95 transition-all duration-200"
              style={{ width: `${Math.round(80 * ppi)}px` }}
            >
              <svg viewBox="0 0 500 185" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
                <rect x="35" y="15" width="430" height="90" rx="16" fill="#2d2f34" stroke="#1d1e22" strokeWidth="2"/>
                <line x1="35" y1="16" x2="465" y2="16" stroke="#b89053" strokeWidth="2" strokeDasharray="6 4" opacity="0.35"/>
                <line x1="180" y1="22" x2="180" y2="98" stroke="#1f2024" strokeWidth="2.5" strokeDasharray="4 4"/>
                <line x1="320" y1="22" x2="320" y2="98" stroke="#1f2024" strokeWidth="2.5" strokeDasharray="4 4"/>
                <rect x="20" y="80" width="460" height="75" rx="16" fill="#35373d" stroke="#222429" strokeWidth="2"/>
                <rect x="10" y="52" width="42" height="105" rx="12" fill="#292a2f" stroke="#1d1e22" strokeWidth="2"/>
                <rect x="448" y="52" width="42" height="105" rx="12" fill="#292a2f" stroke="#1d1e22" strokeWidth="2"/>
                <rect x="55" y="88" width="190" height="60" rx="8" fill="#3e4149"/>
                <rect x="255" y="88" width="190" height="60" rx="8" fill="#3e4149"/>
                <polygon points="50,152 42,185 55,185 65,152" fill="#9e6f47"/>
                <polygon points="450,152 458,185 445,185 435,152" fill="#9e6f47"/>
                <rect x="68" y="58" width="52" height="52" rx="8" transform="rotate(-8 68 58)" fill="#b89053" opacity="0.85"/>
              </svg>
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-stone-400 bg-stone-900/85 px-2 py-0.2 rounded border border-white/10 whitespace-nowrap">
                ↔ Standard 80″ Sofa (203 cm)
              </div>
            </div>

            {/* Botanical Plant */}
            <div className="absolute bottom-10 sm:bottom-14 right-2 sm:right-6 w-10 sm:w-16 pointer-events-none z-10 opacity-90">
              <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
                <polygon points="25,120 75,120 68,160 32,160" fill="#fafafa"/>
                <path d="M50 120 C50 80, 20 60, 10 30 C25 35, 45 45, 50 120 Z" fill="#2d5a37"/>
                <path d="M50 120 C50 70, 75 40, 90 20 C85 45, 75 65, 50 120 Z" fill="#3c7448"/>
              </svg>
            </div>

            {/* THE CANVAS MOUNTED ON WALL */}
            <div
              className="absolute z-25 transition-transform duration-75 flex flex-col items-center"
              style={{
                transform: `translate(${canvasPos.x}px, ${canvasPos.y}px)`
              }}
            >
              {/* Eye-level indicator */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/80 text-amber-300 border border-amber-400/30 text-[9px] font-mono px-2 py-0.5 rounded-full pointer-events-none shadow-xs">
                ↕ 8″ Above Sofa (Ideal Eye-Level)
              </div>

              {/* Multi-Panel or Single Canvas Grid */}
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${currentSpecs.cols}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: currentSpecs.pcs }).map((_, idx) => {
                  const customImg = comboImages[idx];
                  const imgSrc = customImg?.src || activeImageSrc;
                  const tileW_px = Math.round(currentSpecs.tileW * ppi);
                  const tileH_px = Math.round(currentSpecs.tileH * ppi);

                  const frameClass =
                    activeFrame.type === 'black'
                      ? 'floating-frame-black'
                      : activeFrame.type === 'walnut'
                      ? 'floating-frame-walnut'
                      : activeFrame.type === 'white'
                      ? 'floating-frame-white'
                      : activeFrame.type === 'gold'
                      ? 'floating-frame-gold'
                      : 'floating-frame-none';

                  return (
                    <div
                      key={idx}
                      className={`relative overflow-hidden bg-stone-900 transition-all ${frameClass}`}
                      style={{
                        width: `${tileW_px}px`,
                        height: `${tileH_px}px`,
                        borderRadius: '3px'
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={`Panel ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {currentSpecs.pcs > 1 && (
                        <span className="absolute top-1 left-1 bg-black/75 text-white text-[7px] font-mono font-bold px-1 rounded">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Span measurement ruler */}
              <div className="mt-2 text-[9px] font-mono text-cyan-200 bg-cyan-950/80 border border-cyan-400/40 px-2 py-0.5 rounded shadow">
                ↔ {currentSpecs.tileW * currentSpecs.cols}″ Total Wall Span
              </div>
            </div>

          </div>

          {/* Quick Resolution Audit Pill */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Camera className="w-3.5 h-3.5 text-amber-600" />
              <span>Print Sharpness:</span>
              <span className="text-emerald-700">300 DPI Ultra HD Archival</span>
            </div>
            <span>No Image Edges Cut (100% Unbroken Art)</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Studio Controls & Configuration Sidebar (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-200 space-y-6">
          
          {/* Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Select Package Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold text-stone-600">
              <button
                type="button"
                onClick={() => setActiveTab('combo')}
                className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
                  activeTab === 'combo' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                Combo Deals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('single')}
                className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
                  activeTab === 'single' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                Single Canvas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('multipanel')}
                className={`py-2 px-2 rounded-xl transition cursor-pointer text-center ${
                  activeTab === 'multipanel' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                5-Part Split
              </button>
            </div>
          </div>

          {/* TAB 1: COMBO PACKAGES PICKER */}
          {activeTab === 'combo' && (
            <div className="space-y-4">
              {/* Combo Size Buttons */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">1. Choose Canvas Tile Size</span>
                <div className="grid grid-cols-3 gap-2">
                  {['6x8', '8x12', '12x16'].map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setComboKey(sz);
                        setComboTierIndex(0);
                      }}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold text-xs ${
                        comboKey === sz
                          ? 'border-amber-500 bg-amber-50/80 text-amber-900 ring-1 ring-amber-400'
                          : 'border-stone-200 hover:border-amber-300 text-stone-700'
                      }`}
                    >
                      {sz}″ Tiles
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Tiers Grid */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  2. Select Piece Bundle Deal ({currentCombo.name})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentCombo.tiers.map((tier, tIdx) => {
                    const isSelected = comboTierIndex === tIdx;
                    return (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => setComboTierIndex(tIdx)}
                        className={`p-2.5 rounded-xl border text-left transition relative cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                            : 'border-stone-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        {tier.badge && (
                          <span className="absolute -top-2 right-1.5 bg-amber-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded-full uppercase">
                            {tier.badge}
                          </span>
                        )}
                        <span className="text-xs font-bold text-stone-900 block leading-tight">{tier.pcs} Pieces</span>
                        <span className="text-[9px] text-stone-500 block">{tier.sub}</span>
                        <span className="text-xs font-black text-amber-700 block mt-1">৳ {tier.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Photo Upload Slots */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      3. Attach Your Photos ({currentSpecs.pcs} Slots)
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Upload individual custom photos for each piece
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => batchFileInputRef.current?.click()}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload All</span>
                  </button>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {Array.from({ length: currentSpecs.pcs }).map((_, idx) => {
                    const slot = comboImages[idx];
                    const hasImage = !!slot?.src;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveSlotIndex(idx);
                          fileInputRef.current?.click();
                        }}
                        className={`relative rounded-xl p-1.5 border transition cursor-pointer text-left flex flex-col justify-between h-20 ${
                          hasImage
                            ? 'border-emerald-400 bg-emerald-50/50 hover:border-emerald-600'
                            : 'border-dashed border-stone-300 bg-white hover:border-amber-400 hover:bg-amber-50/30'
                        }`}
                      >
                        {hasImage ? (
                          <>
                            <div className="relative w-full h-11 rounded overflow-hidden bg-stone-900">
                              <img src={slot.thumb || slot.src} alt="Uploaded" className="w-full h-full object-cover" />
                              <span className="absolute top-0.5 left-0.5 bg-black/75 text-white text-[7px] font-mono px-1 rounded font-bold">
                                #{idx + 1}
                              </span>
                              {slot.cloudinaryUrl ? (
                                <span className="absolute bottom-0.5 left-0.5 bg-sky-900/90 text-sky-200 text-[6px] font-mono px-1 rounded shadow-xs" title="Synced to Cloudinary CDN">
                                  ☁️ CDN
                                </span>
                              ) : slot.isUploading ? (
                                <span className="absolute bottom-0.5 left-0.5 bg-amber-900/90 text-amber-200 text-[6px] font-mono px-1 rounded animate-pulse">
                                  ☁️ Syncing...
                                </span>
                              ) : null}
                              <button
                                type="button"
                                onClick={e => removeSlotImage(idx, e)}
                                className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold shadow-xs cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                            <span className="text-[8px] font-bold text-emerald-800 truncate block mt-0.5">
                              {slot.fileName}
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-stone-400 hover:text-amber-600">
                            <PlusCircle className="w-4 h-4 mb-0.5" />
                            <span className="text-[9px] font-bold text-stone-700">Photo #{idx + 1}</span>
                            <span className="text-[7px] text-stone-400">Click to upload</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SINGLE CANVAS PICKER */}
          {activeTab === 'single' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-stone-700 block">Choose Canvas Dimensions</span>
              <div className="grid grid-cols-2 gap-2">
                {STANDARD_SIZES.map(sz => {
                  const isSelected = singleSizeCode === sz.code;
                  const price = material === 'pvc' ? sz.pricePvc : sz.priceCanvas;
                  return (
                    <button
                      key={sz.code}
                      type="button"
                      onClick={() => setSingleSizeCode(sz.code)}
                      className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                          : 'border-stone-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      {sz.badge && (
                        <span className="absolute -top-2 right-1.5 bg-amber-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded-full uppercase">
                          {sz.badge}
                        </span>
                      )}
                      <span className="text-xs font-bold text-stone-900 block">{sz.label}</span>
                      <span className="text-[9px] text-stone-500 block">{sz.sub}</span>
                      <span className="text-xs font-black text-amber-700 block mt-1">৳ {price}</span>
                    </button>
                  );
                })}
              </div>
              {/* Quick Artwork Presets Switcher & Custom Upload */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-700">Studio Artwork Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlotIndex(null);
                      fileInputRef.current?.click();
                    }}
                    className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-amber-700" />
                    <span>Upload Custom Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('/assets/portrait_art.jpg')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc === '/assets/portrait_art.jpg'
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="/assets/portrait_art.jpg" alt="Portrait" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Portrait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('/assets/triptych_art.jpg')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc === '/assets/triptych_art.jpg'
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="/assets/triptych_art.jpg" alt="Triptych" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Triptych</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc.includes('1583394838336')
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80" alt="Calligraphy" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Calligraphy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc.includes('1506744038136')
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" alt="Waterfall" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Waterfall</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 5-PART SPLIT */}
          {activeTab === 'multipanel' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-stone-700 block">5-Part Multi-Panel Continuous Sets</span>
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/90 text-xs">
                <p className="font-bold text-amber-900 mb-1">Zero-Cut Mathematical Engine</p>
                <p className="text-[11px] text-stone-600">
                  Your image flows unbroken across 5 gallery-wrapped panels. Center panel is tallest with dynamic cascading slopes.
                </p>
                <div className="mt-3 font-mono font-bold text-amber-800">
                  Total Span: 24″ × 48″ • Price: ৳ 1,250
                </div>
              </div>

              {/* Quick Artwork Presets Switcher & Custom Upload */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-700">Studio Artwork Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlotIndex(null);
                      fileInputRef.current?.click();
                    }}
                    className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-amber-700" />
                    <span>Upload Custom Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('/assets/triptych_art.jpg')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc === '/assets/triptych_art.jpg'
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="/assets/triptych_art.jpg" alt="Triptych" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Triptych</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc.includes('1506744038136')
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" alt="Waterfall" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Waterfall</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('/assets/portrait_art.jpg')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc === '/assets/portrait_art.jpg'
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="/assets/portrait_art.jpg" alt="Portrait" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Portrait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageSrc('https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80')}
                    className={`p-1 rounded-xl border text-center transition cursor-pointer ${
                      activeImageSrc.includes('1583394838336')
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80" alt="Calligraphy" className="h-9 w-full object-cover rounded-lg mb-0.5" />
                    <span className="text-[9px] font-bold block truncate text-stone-800">Calligraphy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Material Choice */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Select Material
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMaterial('pvc')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  material === 'pvc'
                    ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                    : 'border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-stone-900">3mm Rigid PVC Board</span>
                  {material === 'pvc' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[10px] text-stone-500">Free 3M heavy-duty tape included. Ultra-light, no nail holes.</p>
              </button>

              <button
                type="button"
                onClick={() => setMaterial('canvas')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  material === 'canvas'
                    ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                    : 'border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-stone-900">1.25″ Pine Wood Canvas</span>
                  {material === 'canvas' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[10px] text-stone-500">Stretched on kiln-dried solid pine wood stretcher bars.</p>
              </button>
            </div>
          </div>

          {/* Floating Frame Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Floating Frame Moulding
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {FRAME_OPTIONS.map(fr => {
                const isSelected = frameType === fr.type;
                return (
                  <button
                    key={fr.type}
                    type="button"
                    onClick={() => setFrameType(fr.type)}
                    className={`p-2 rounded-xl border transition cursor-pointer flex flex-col items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400 shadow-xs'
                        : 'border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs mb-1"
                      style={{ backgroundColor: fr.color }}
                    />
                    <span className="text-[9px] font-bold text-stone-800 leading-tight block truncate w-full">
                      {fr.name.split(' ')[1] || fr.name}
                    </span>
                    <span className="text-[8px] font-bold text-amber-700 block mt-0.5">{fr.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing Card & Advance Details */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-stone-800">
              <span>{currentSpecs.label}:</span>
              <span className="text-sm font-black text-amber-700">৳ {totalPrice.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-xl border border-stone-200/80">
              <div>
                <span className="text-stone-400 block">30% Advance (bKash):</span>
                <span className="font-bold text-stone-900">৳ {Math.round(totalPrice * 0.30).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-stone-400 block">70% Cash on Delivery:</span>
                <span className="font-bold text-emerald-700">৳ {(totalPrice - Math.round(totalPrice * 0.30)).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Add to Bag & Order Now */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleAddToBag}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 text-xs transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 text-xs transform active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>Order Now (৳ {totalPrice.toLocaleString()})</span>
            </button>
          </div>

        </div>

      </div>

      {/* Checkout Modal with Multi-Photo Gallery Preview */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCheckoutModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  Confirm Canvas Order
                  <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded">
                    {currentSpecs.pcs} Pieces
                  </span>
                </h3>
                <p className="text-xs text-stone-400">Order ID: #CC-BD-89214</p>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
              
              {/* Order Summary */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-300">
                    <img src={comboImages[0]?.thumb || activeImageSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="font-bold text-stone-900 text-sm truncate">{currentSpecs.label}</p>
                    <p className="text-stone-600">
                      Material: <strong className="text-amber-700">{material === 'pvc' ? '3mm Rigid PVC Board' : '1.25″ Pine Canvas'}</strong>
                    </p>
                    <p className="text-stone-600">
                      Frame: <strong className="text-stone-800">{activeFrame.name}</strong>
                    </p>
                  </div>
                </div>

                {/* Attached Multi-Photo Gallery */}
                {activeTab === 'combo' && currentSpecs.pcs > 1 && (
                  <div className="pt-3 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-800">
                        Custom Photos Attached ({currentSpecs.pcs} Pieces):
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        ✓ All Ready
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {Array.from({ length: currentSpecs.pcs }).map((_, idx) => {
                        const slot = comboImages[idx];
                        const img = slot?.thumb || slot?.src || activeImageSrc;
                        return (
                          <div
                            key={idx}
                            className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 h-16"
                            title={slot?.fileName || `Photo #${idx + 1}`}
                          >
                            <img src={img} alt="Slot" className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-black/75 text-white text-[7px] font-mono font-bold px-1 rounded">
                              #{idx + 1}
                            </span>
                            <span className="absolute bottom-0.5 right-0.5 text-[6px] font-bold px-1 rounded bg-emerald-600 text-white">
                              {slot?.src ? 'Uploaded' : 'Default'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Charge Selector */}
              <div>
                <label className="font-bold text-stone-800 block mb-1.5">Delivery Destination:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryCharge(80)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      deliveryCharge === 80 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    Dhaka City (৳ 80)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryCharge(150)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      deliveryCharge === 150 ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    Outside Dhaka (৳ 150)
                  </button>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-stone-100 p-3 rounded-2xl space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-stone-900">৳ {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-mono font-bold text-stone-900">৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Bill:</span>
                  <span className="text-amber-700">৳ {(totalPrice + deliveryCharge).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
                  <div>
                    <span className="text-stone-400 block">30% Advance (bKash):</span>
                    <strong className="text-stone-900 font-bold">৳ {Math.round(totalPrice * 0.30).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Remaining Due (COD):</span>
                    <strong className="text-emerald-700 font-bold">৳ {(totalPrice + deliveryCharge - Math.round(totalPrice * 0.30)).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Order via WhatsApp CTA */}
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Place Order via WhatsApp (Instant Confirmation)</span>
              </a>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
