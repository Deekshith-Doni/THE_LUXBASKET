import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";
import { generateOrderId } from "@/lib/utils";
import mongoose from "mongoose";
import { z } from "zod";
import { resolveDbUserId } from "@/lib/resolveDbUserId";

const checkoutSchema = z.object({
  items: z.array(z.object({
    product: z.string().regex(/^[a-f\d]{24}$/i),
    quantity: z.number().int().min(1).max(20),
    customization: z.string().max(300).optional(),
    clientPrice: z.number().nonnegative().optional(),
  })).min(1).max(30),
  shippingAddress: z.object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^\+?[\d ()-]{10,18}$/),
    line1: z.string().trim().min(4).max(200),
    line2: z.string().trim().max(200).optional().default(""),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pincode: z.string().trim().regex(/^\d{6}$/),
  }),
  paymentMethod: z.literal("online"),
  attribution: z.unknown().optional(),
});

function normalizeCampaignTouch(touch) {
  if (!touch || typeof touch !== "object") return undefined;
  const take = (key, max = 200) =>
    typeof touch[key] === "string" ? touch[key].trim().slice(0, max) : undefined;
  const capturedDate = touch.captured_at ? new Date(touch.captured_at) : null;

  return {
    source: take("utm_source"),
    medium: take("utm_medium"),
    campaign: take("utm_campaign"),
    term: take("utm_term"),
    content: take("utm_content"),
    campaignId: take("utm_id"),
    landingPage: take("landing_page", 500),
    capturedAt: capturedDate && !Number.isNaN(capturedDate.getTime()) ? capturedDate : undefined,
  };
}

function normalizeCampaignAttribution(attribution) {
  if (!attribution || typeof attribution !== "object") return undefined;
  const firstTouch = normalizeCampaignTouch(attribution.first_touch);
  const lastTouch = normalizeCampaignTouch(attribution.last_touch);
  return firstTouch || lastTouch ? { firstTouch, lastTouch } : undefined;
}

// GET /api/orders  — user's orders
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const dbUserId = await resolveDbUserId(session);
    if (!dbUserId) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

    const orders = await Order.find({ user: dbUserId })
      .populate("items.product", "name images slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// POST /api/orders  — create order
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = checkoutSchema.safeParse(await req.json());
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Please check your checkout details" },
        { status: 400 },
      );
    }

    const { items: requestedItems, shippingAddress, attribution } = validation.data;
    if (new Set(requestedItems.map((item) => item.product)).size !== requestedItems.length) {
      return NextResponse.json(
        { error: "Your basket contains repeated products. Please review it and try again." },
        { status: 400 },
      );
    }

    await connectDB();

    const dbUserId = await resolveDbUserId(session);
    if (!dbUserId) {
      return NextResponse.json(
        { error: "User profile not found in database. Please log out and sign in again." },
        { status: 404 },
      );
    }

    // Use current catalog prices and availability; never trust prices posted by the browser.
    const productIds = requestedItems.map((item) => new mongoose.Types.ObjectId(item.product));
    const products = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const orderItems = [];
    let priceChanged = false;

    for (const requested of requestedItems) {
      const product = productsById.get(requested.product);
      if (!product) {
        return NextResponse.json(
          { error: "A product in your basket is no longer available. Please refresh your basket." },
          { status: 409 },
        );
      }
      if (product.stock < requested.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} of ${product.name} are currently available.` },
          { status: 409 },
        );
      }

      const currentPrice = product.discountPrice || product.price;
      if (requested.clientPrice !== undefined && Math.abs(requested.clientPrice - currentPrice) > 0.01) {
        priceChanged = true;
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "/placeholder-product.svg",
        price: currentPrice,
        quantity: requested.quantity,
        customization: requested.customization?.trim().slice(0, 300) || "",
      });
    }

    if (priceChanged) {
      return NextResponse.json(
        {
          error: "A price changed while you were shopping. We updated your basket so you can review it before paying.",
          currentItems: orderItems.map((item) => ({
            id: item.product.toString(),
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            customization: item.customization,
            slug: productsById.get(item.product.toString())?.slug,
          })),
        },
        { status: 409 },
      );
    }

    const subtotal = Math.round(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
    const shippingCharge = subtotal >= 1999 ? 0 : 149;
    const total = Math.round((subtotal + shippingCharge) * 100) / 100;

    const order = await Order.create({
      orderId: generateOrderId(),
      user: dbUserId,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount: 0,
      shippingCharge,
      total,
      attribution: normalizeCampaignAttribution(attribution),
      paymentMethod: "online",
      paymentStatus: "pending",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
