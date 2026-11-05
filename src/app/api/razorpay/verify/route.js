import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/resolveDbUserId";

async function clearSavedCart(userId) {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] }).catch((error) => {
    console.error("Could not clear saved cart after payment:", error);
  });
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mongo_order_id,
    } = await req.json();

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      typeof mongo_order_id !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 503 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (typeof razorpay_signature !== "string" || !/^[a-f\d]{64}$/i.test(razorpay_signature)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const actualBuffer = Buffer.from(razorpay_signature, "hex");
    const isAuthentic = expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);

    if (!isAuthentic) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    await connectDB();
    const dbUserId = await resolveDbUserId(session);
    if (!dbUserId) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

    const orderRecord = await Order.findOne({
      orderId: mongo_order_id,
      user: dbUserId,
      razorpayOrderId: razorpay_order_id,
    });
    if (!orderRecord) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (
      orderRecord.paymentStatus === "paid" &&
      orderRecord.razorpayPaymentId === razorpay_payment_id
    ) {
      await clearSavedCart(dbUserId);
      return NextResponse.json({ success: true, order: orderRecord }, { status: 200 });
    }
    if (orderRecord.paymentStatus !== "pending") {
      return NextResponse.json({ error: "Order is not awaiting payment" }, { status: 409 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const expectedAmount = Math.round(Number(orderRecord.total) * 100);
    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return NextResponse.json({ error: "Payment could not be confirmed" }, { status: 400 });
    }

    // Require the payment's Razorpay order to match the pending order created by this account.
    const order = await Order.findOneAndUpdate(
      {
        orderId: mongo_order_id,
        user: dbUserId,
        paymentStatus: "pending",
        razorpayOrderId: razorpay_order_id,
      },
      {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!order) {
      const alreadyPaid = await Order.findOne({
        orderId: mongo_order_id,
        user: dbUserId,
        paymentStatus: "paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
      if (alreadyPaid) {
        await clearSavedCart(dbUserId);
        return NextResponse.json({ success: true, order: alreadyPaid }, { status: 200 });
      }
      return NextResponse.json(
        { error: "Order payment was already processed" },
        { status: 409 },
      );
    }

    await clearSavedCart(dbUserId);

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
