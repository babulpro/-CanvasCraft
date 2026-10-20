import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/data/products";

// GET /api/products — Retrieve all catalog products
export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      // Map to frontend Product model
      const formatted = dbProducts.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category as any,
        image: p.imageUrl,
        aspect: p.aspect,
        orientation: p.orientation as any,
        basePrice: p.basePrice,
        tags: p.tags,
        featured: p.featured,
        description: p.description,
      }));
      return NextResponse.json({ success: true, products: formatted, source: "database" });
    }

    // Fallback to static catalog if no products yet in MongoDB
    return NextResponse.json({
      success: true,
      products: PRODUCTS,
      source: "fallback",
    });
  } catch (err) {
    console.warn("[Products API] Database query skipped or failed, using fallback:", err);
    return NextResponse.json({
      success: true,
      products: PRODUCTS,
      source: "fallback",
    });
  }
}

// POST /api/products — Create a new catalog artwork (ADMIN ONLY)
export async function POST(req: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You must be logged in to perform this action.",
        },
        { status: 401 }
      );
    }

    // 2. Authorize admin role
    const user = session.user as typeof session.user & { role?: string };
    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Only users with the 'admin' role can add catalog products (current role: '${user.role || "user"}').`,
        },
        { status: 403 }
      );
    }

    // 3. Parse and validate input data
    const body = await req.json();
    const {
      title,
      category,
      description,
      imageUrl,
      aspect = "portrait",
      orientation = "portrait",
      basePrice,
      tags = [],
      featured = false,
    } = body;

    if (!title || !category || !imageUrl || !basePrice) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, category, imageUrl, and basePrice are mandatory.",
        },
        { status: 400 }
      );
    }

    // Generate unique slug
    const cleanTitle = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${cleanTitle}-${Date.now().toString(36)}`;

    // Process tags array
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    // 4. Save to MongoDB via Prisma
    const newProduct = await prisma.product.create({
      data: {
        slug,
        title,
        category,
        description: description || "",
        imageUrl,
        aspect,
        orientation,
        basePrice: Number(basePrice),
        tags: parsedTags,
        featured: Boolean(featured),
        inStock: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Artwork successfully published to the catalog!",
      product: newProduct,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create product.";
    console.error("[Create Product Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products — Remove a catalog artwork (ADMIN ONLY)
export async function DELETE(req: Request) {
  try {
    // 1. Authenticate user session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You must be signed in as an administrator.",
        },
        { status: 401 }
      );
    }

    // 2. Authorize admin role
    const user = session.user as typeof session.user & { role?: string };
    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Only users with the 'admin' role can delete products (current role: '${user.role || "user"}').`,
        },
        { status: 403 }
      );
    }

    // 3. Extract product ID from query parameter or body
    const { searchParams } = new URL(req.url);
    let productId = searchParams.get("id");

    if (!productId) {
      try {
        const body = await req.json();
        productId = body?.id;
      } catch {
        // Body might be empty if query param was expected
      }
    }

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required to perform deletion.",
        },
        { status: 400 }
      );
    }

    // 4. Verify product exists in database
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found in catalog database.",
        },
        { status: 404 }
      );
    }

    // 5. Delete product from MongoDB via Prisma
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      success: true,
      message: `Artwork "${existingProduct.title}" was permanently removed from the catalog.`,
      deletedId: productId,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete product.";
    console.error("[Delete Product Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
