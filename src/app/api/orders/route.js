import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { generateOrderId } from "@/lib/utils";
import mongoose from "mongoose";

// GET /api/orders  — user's orders
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ user: session.user.id })
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

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      subtotal,
      discount,
      shippingCharge,
      total,
      notes,
    } = body;

    if (!items?.length || !shippingAddress || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    // 1. Resolve user ID if not a valid ObjectId (e.g., NextAuth Google login UUID)
    let dbUserId = session.user.id;
    if (!mongoose.Types.ObjectId.isValid(dbUserId)) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        dbUserId = dbUser._id.toString();
      } else {
        return NextResponse.json(
          { error: "User profile not found in database. Please log out and sign in again." },
          { status: 404 }
        );
      }
    }

    // 2. Validate product IDs in cart items
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return NextResponse.json(
          { error: `Invalid product ID "${item.product}". Your cart contains outdated items. Please clear your cart and add products from the shop again.` },
          { status: 400 }
        );
      }
    }

    const order = await Order.create({
      orderId: generateOrderId(),
      user: dbUserId,
      items,
      shippingAddress,
      subtotal,
      discount: discount || 0,
      shippingCharge: shippingCharge || 0,
      total,
      couponCode,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      notes,
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: dbUserId }, { items: [] });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
