import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthUser } from "@/types";

// GET /api/orders — Fetch customer orders (or all orders if admin)
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");
    const viewAll = searchParams.get("all") === "true";

    const user = session?.user as (AuthUser & Record<string, unknown>) | undefined;
    const isAdmin = user?.role === "admin";

    // 1. Specific order lookup by order number or phone
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
      });
      return NextResponse.json({
        success: true,
        orders: order ? [order] : [],
      });
    }

    if (phone) {
      const orders = await prisma.order.findMany({
        where: { customerPhone: phone.trim() },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        success: true,
        orders,
      });
    }

    // 2. Logged-in User Orders
    if (user) {
      // If admin requested all orders
      if (isAdmin && viewAll) {
        const allOrders = await prisma.order.findMany({
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({
          success: true,
          orders: allOrders,
        });
      }

      // Customer's own orders
      const userOrders = await prisma.order.findMany({
        where: {
          OR: [
            { userId: user.id },
            { customerPhone: user.email }, // fallback
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        orders: userOrders,
      });
    }

    // 3. Guest with no filter
    return NextResponse.json({
      success: true,
      orders: [],
      message: "Please sign in or provide an order number / phone number to track orders.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch orders.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/orders — Place a new canvas print order
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      deliveryZone = "dhaka",
      notes,
      items = [],
      subtotal,
      comboDiscount = 0,
      comboDealName,
      deliveryFee = 100,
      total,
      advancePaid = 0,
      codDue,
      paymentMethod = "bKash/Nagad (30% Adv) + COD",
    } = body;

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required contact details: Name, phone number, and address are required.",
        },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot place order: Shopping bag is empty.",
        },
        { status: 400 }
      );
    }

    // Generate unique order reference (e.g. CC-2026-A8K2)
    const year = new Date().getFullYear();
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `CC-${year}-${randSuffix}`;

    // Map cart items into OrderItem models
    const orderItems = items.map((i: any) => ({
      productId: i.productId || null,
      title: i.title || "Custom Canvas Artwork",
      imageUrl: i.image || i.fullImage || "/assets/canvas_sample.jpg",
      category: i.category || "Custom Studio",
      sizeCode: i.sizeCode || "standard",
      sizeLabel: i.sizeLabel || "Standard Size",
      width: Number(i.width) || 12,
      height: Number(i.height) || 18,
      material: i.material || "canvas",
      frameType: i.frameType || "none",
      quantity: Number(i.quantity) || 1,
      unitPrice: Number(i.unitPrice) || 0,
      totalPrice: Number(i.totalPrice) || 0,
      comboPieces: i.comboImages?.length || null,
      customPhotoUrls: Array.isArray(i.comboImages)
        ? i.comboImages.map((img: any) => img.cloudinaryUrl || img.src).filter(Boolean)
        : [],
    }));

    const finalSubtotal = Number(subtotal) || 0;
    const finalTotal = Number(total) || finalSubtotal + Number(deliveryFee) - Number(comboDiscount);
    const finalAdvance = Number(advancePaid) || Math.round(finalTotal * 0.3);
    const finalDue = Number(codDue) || finalTotal - finalAdvance;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        deliveryZone,
        notes: notes ? notes.trim() : null,
        status: "PENDING",
        subtotal: finalSubtotal,
        comboDiscount: Number(comboDiscount) || 0,
        comboDealName: comboDealName || null,
        deliveryFee: Number(deliveryFee) || 100,
        total: finalTotal,
        advancePaid: finalAdvance,
        codDue: finalDue,
        paymentMethod,
        items: orderItems,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderNumber: newOrder.orderNumber,
      order: newOrder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to place order.";
    console.error("[Create Order Error]:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
