# CanvasCraft BD — Premium Custom Canvas & Wall Art E-Commerce Platform

A production-grade, full-stack custom canvas printing and museum framing e-commerce web application crafted with **Next.js 16 (App Router with Turbopack)**, **React 19**, **TypeScript 5**, **Tailwind CSS v4**, **Better Auth with RBAC**, **Prisma (MongoDB)**, and **Cloudinary CDN**.

---

## 🎨 Core Features & Architecture

### 1. Next.js 16 Proxy & Role-Based Access Control (RBAC)
- **Edge/Network Proxy Boundary (`proxy.ts`)**: Next.js 16 file convention that intercepts all requests matching `/admin`, `/admin/:path*`, and `/api/admin/:path*`.
  - Unauthenticated visitors are automatically redirected to `/sign-in?callbackUrl=...` (or `401 Unauthorized` for API routes).
  - Authenticated non-admin accounts (`user` or `moderator`) are blocked from all admin files and redirected to `/profile?error=admin_required` (or `403 Forbidden` for API routes).
- **Three-Tier User Hierarchy**:
  - `admin`: Full administrative control, catalog publishing, artwork deletion, user role governance.
  - `moderator`: Assisted catalog curation and customer mockup review.
  - `user`: Standard customer privileges, Live Studio customizer, combo ordering, order tracking.
- **Admin-Controlled Role Governance (`/admin/users`)**: New users strictly receive the `user` role upon registration. Only an active Administrator can promote accounts to `moderator` or `admin`.
- **Social OAuth & Credentials**: Native authentication via **Google OAuth**, **GitHub OAuth**, and Email/Username with Better Auth plugins.

### 2. Admin Studio & Catalog Management (`/admin`)
- **Executive KPI Metrics**: Real-time stats for Total Artworks, Featured Items, Artistic Categories, and MongoDB connection status.
- **Live Catalog Inventory**: Interactive table/grid with high-res thumbnails, categories, aspect ratios, and base pricing in BDT (৳).
- **Artwork Upload Studio (`/admin/add-product`)**: Direct master image upload to Cloudinary with WebP/AVIF compression and persistent creation in MongoDB via Prisma.
- **Permanent Artwork Deletion**: Secure `DELETE /api/products?id=...` endpoint with confirmation modal to prevent accidental data loss.

### 3. Interactive Living Room Studio Customizer (`/customize`)
- **80″ Proportional Sofa & Museum Wall Simulator**: True-to-scale visualizer displaying proportional canvas spacing above standard living room furniture.
- **Full-Screen Immersive Room Mode**: High-PPI canvas preview mode with dynamic wall lighting simulation and `ESC` key support.
- **Multi-Photo Combo Upload Pipeline**: Upload multiple high-resolution photos into individual canvas slots (up to 24 pieces).
- **5 Museum Floating Frame Mouldings**:
  - Rimless Gallery Wrap (Frameless)
  - Floating Matte Black Oak
  - Warm Natural Walnut
  - Scandinavian Modern White
  - Italian Gold Leaf Finish
- **3D Frame Depths & Bevels**: Realistic drop shadows, canvas linen weave micro-textures, and hardwood floor rendering.

### 4. Dedicated Shopping Cart & Checkout (`/cart`)
- **Detailed Item Breakdown**: Large artwork thumbnails, material tags (3mm Rigid PVC Board vs 1.25″ Solid Pine Wood Stretched Canvas), floating frames, dimensions, and quantity controls.
- **Combo Deal Builder**: Select 3 to 6 matching prints to automatically apply bundled package discounts (e.g. 6 pcs 6×8″ for ৳300, 3 pcs 8×12″ for ৳300, 6 pcs 8×12″ for ৳550, 3 pcs 12×16″ for ৳550).
- **Delivery Zone Selector**: Toggle between **Inside Dhaka (৳100)** and **Outside Dhaka (৳180)** across all 64 districts.
- **Transparent Split Payment Calculation**: Computes 30% bKash/Nagad advance payment vs remaining 70% Cash on Delivery (COD).
- **Direct Order Placement**: Saves complete orders and embedded items directly into MongoDB via `POST /api/orders`.

### 5. My Orders & Delivery Tracking (`/orders`)
- **Real-Time Order Tracking**: Multi-step visual progress timeline:
  - `PENDING` (Registered, awaiting 30% advance confirmation)
  - `CONFIRMED` (Advance verified, sent to Dhaka workshop)
  - `IN_PRODUCTION` (Printing on archival canvas & handcrafted framing)
  - `SHIPPED` (Handed over to courier service)
  - `DELIVERED` (Completed delivery)
- **Lookup Bar**: Accessible by unique Order Number (e.g. `CC-2026-XXXX`) or Customer Phone Number.
- **1-Click WhatsApp Support**: Pre-filled inquiry link with embedded order reference.

### 6. Mobile Responsiveness & Editorial Typography
- **Direct Mobile Sign-In Visibility**: The **Sign In** button (or user avatar) is always directly visible in the top navbar on all phone screens.
- **Mobile Navigation Drawer**: Slide-down drawer with backdrop blur, account card, navigation links, quick phone hotline, and WhatsApp concierge.
- **Official WhatsApp Integration**: Connected to **`+880 1972304749`** (`https://wa.me/8801972304749`).
- **Luxury Google Typography**: Editorial headlines powered by **Playfair Display** paired with modern, high-contrast body copy in **Plus Jakarta Sans**.

---

## 📁 Project Structure

```
canvascraft/
├── app/
│   ├── admin/
│   │   ├── page.tsx               # Admin Studio Dashboard (Inventory & Deletion)
│   │   ├── add-product/page.tsx   # Artwork Publishing Studio (Cloudinary + Prisma)
│   │   └── users/page.tsx         # User Role Governance Portal (Admin-Only)
│   ├── api/
│   │   ├── admin/
│   │   │   ├── role/route.ts      # Assign/Update User Roles (Admin-Only)
│   │   │   └── users/route.ts     # Retrieve Registered Users (Admin-Only)
│   │   ├── auth/[...all]/route.ts # Better Auth Multi-Provider Catch-All Handler
│   │   ├── orders/route.ts        # Orders API (GET user orders, POST new order)
│   │   ├── products/route.ts      # Products API (GET catalog, POST add, DELETE product)
│   │   └── upload/route.ts        # Cloudinary Image Upload & Processing Pipeline
│   ├── cart/page.tsx              # Dedicated Full-Page Shopping Cart & Checkout
│   ├── customize/page.tsx         # Interactive Studio Wall Simulator
│   ├── orders/page.tsx            # My Orders & Delivery Status Tracking
│   ├── products/page.tsx          # Filterable & Searchable Art Catalog
│   ├── profile/page.tsx           # Member Dashboard, Role Badges & Admin Shortcuts
│   ├── sign-in/page.tsx           # Authentication (Credentials, Google, GitHub)
│   ├── sign-up/page.tsx           # Member Registration
│   ├── globals.css                # Tailwind CSS v4 Theme, Fonts & Frame Shadows
│   ├── layout.tsx                 # Root Layout with Font Providers & Cart State
│   └── page.tsx                   # Storefront Homepage (Hero, Combos, Workshop)
├── components/
│   ├── cart/
│   │   └── CartDrawer.tsx         # Slide-Over Quick Bag & WhatsApp Checkout
│   ├── layout/
│   │   ├── Navbar.tsx             # Responsive Header, Login Pill & Mobile Drawer
│   │   └── Footer.tsx             # Guarantees, Dhaka Workshop & Contact Info
│   ├── products/
│   │   └── AddToCartModal.tsx     # Quick Size, Material & Frame Selector
│   └── studio/
│       └── StudioCustomizer.tsx   # Living Room Simulator, Scaling & Upload Engine
├── context/
│   └── CartContext.tsx            # Universal Cart State & WhatsApp URL Builder
├── data/
│   ├── combo-packages.ts          # Standard Dimensions & Multi-Piece Pricing
│   ├── frames.ts                  # Floating Frame Options & Depths
│   └── products.ts                # Fallback Catalog Artworks
├── lib/
│   ├── auth.ts                    # Better Auth Server Configuration & Hooks
│   ├── auth-client.ts             # Better Auth Client SDK Instance
│   ├── cloudinary.ts              # Cloudinary SDK Configuration & Upload Helpers
│   ├── mongodb.ts                 # MongoDB Native Client Singleton
│   └── prisma.ts                  # Prisma Client Singleton with MongoDB Adapter
├── prisma/
│   └── schema.prisma              # Data Schema (User, Session, Product, Order, etc.)
├── proxy.ts                       # Next.js 16 Edge / Network Proxy for Admin Security
└── types/
    └── index.ts                   # TypeScript Interfaces & Common Types
```

---

## 🗄️ Database Schema (`prisma/schema.prisma`)

| Model | Purpose | Key Attributes |
| :--- | :--- | :--- |
| **`User`** | Customer & Admin Accounts | `id`, `name`, `email`, `username`, `role` (`admin`/`moderator`/`user`), `createdAt` |
| **`Session`** | Better Auth Sessions | `id`, `token`, `userId`, `expiresAt`, `ipAddress`, `userAgent` |
| **`Account`** | OAuth Account Linking | `id`, `userId`, `providerId` (`google`/`github`), `password` |
| **`Product`** | Catalog Artworks | `id`, `slug`, `title`, `category`, `imageUrl`, `aspect`, `orientation`, `basePrice`, `tags`, `featured`, `inStock` |
| **`Order`** | Customer Orders | `id`, `orderNumber`, `customerName`, `customerPhone`, `customerAddress`, `deliveryZone`, `status`, `subtotal`, `comboDiscount`, `deliveryFee`, `total`, `advancePaid`, `codDue`, `items` (embedded `OrderItem[]`) |
| **`SavedDesign`** | Studio Configurations | `id`, `layoutType`, `slotsCount`, `sizeCode`, `material`, `frameType`, `uploadedPhotos` (embedded `UploadedPhoto[]`) |

---

## 🔑 Environment Setup (`.env`)

Create a `.env` file in the project root:

```env
# ==============================================================================
# Better Auth Configuration
# ==============================================================================
BETTER_AUTH_SECRET=your_at_least_32_characters_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Optional: Comma-separated list of emails auto-assigned 'admin' upon registration
ADMIN_EMAILS=your_email@gmail.com

# ==============================================================================
# MongoDB Database Connection
# ==============================================================================
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/canvascraft?retryWrites=true&w=majority

# ==============================================================================
# Google OAuth Credentials
# ==============================================================================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ==============================================================================
# GitHub OAuth Credentials
# ==============================================================================
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ==============================================================================
# Cloudinary CDN Configuration
# ==============================================================================
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **MongoDB**: MongoDB Atlas database connection string
- **Cloudinary**: Free or paid account for CDN uploads

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/canvascraft.git
cd canvascraft

# Install dependencies
npm install

# Generate Prisma Client (Prisma 6.19.3 for MongoDB)
npx prisma generate
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```
The application compiles all 19 routes cleanly with Next.js Turbopack and registers `ƒ Proxy (Middleware)`.

---

## 🛡️ Administrative Workflow

1. **Bootstrap Admin**:
   - Add your email to `ADMIN_EMAILS=your_email@gmail.com` in `.env` before registering, OR
   - If 0 administrators exist in MongoDB, the first authenticated user can assign the `admin` role via `POST /api/admin/role`.
2. **Access Admin Studio**:
   - Navigate to [`/admin`](http://localhost:3000/admin) to view catalog inventory and metrics.
   - Non-admin visitors attempting to load `/admin` are intercepted by `proxy.ts` and redirected to `/sign-in` or `/profile`.
3. **Publish New Artwork**:
   - Navigate to [`/admin/add-product`](http://localhost:3000/admin/add-product).
   - Upload high-resolution artwork to Cloudinary CDN, enter title, category, starting price, and orientation.
4. **Delete Artwork**:
   - Click the delete button on any product row in [`/admin`](http://localhost:3000/admin) and confirm the prompt to permanently remove it from MongoDB.
5. **Manage User Roles**:
   - Navigate to [`/admin/users`](http://localhost:3000/admin/users) to promote members to `Moderator` or `Admin`.

---

## 📞 Customer Concierge & Support

- **Official WhatsApp**: [+880 1972304749](https://wa.me/8801972304749)
- **Phone Hotline**: `+880 1972-304749`
- **Workshop**: Mirpur DOHS, Dhaka, Bangladesh
- **Delivery**: Express delivery across all 64 districts in Bangladesh

---

## 📄 License

This project is proprietary software developed for **CanvasCraft BD**. All rights reserved.
