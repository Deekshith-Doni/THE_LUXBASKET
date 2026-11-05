import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { resolveDbUserId } from "@/lib/resolveDbUserId";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receipt } = await req.json();
    if (typeof receipt !== "string" || !receipt.trim()) {
      return NextResponse.json(
        { error: "Order reference is required" },
        { status: 400 },
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 503 });
    }

    await connectDB();
    const dbUserId = await resolveDbUserId(session);
    if (!dbUserId) return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    const orderRecord = await Order.findOne({ orderId: receipt.trim(), user: dbUserId, paymentStatus: "pending" });
    if (!orderRecord) return NextResponse.json({ error: "Pending order not found" }, { status: 404 });

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(Number(orderRecord.total) * 100), // Amount comes from the server-validated order.
      currency: "INR",
      receipt: orderRecord.orderId,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    orderRecord.razorpayOrderId = razorpayOrder.id;
    await orderRecord.save();

    return NextResponse.json({ success: true, order: razorpayOrder }, { status: 200 });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 },
    );
  }
}
