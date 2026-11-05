import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export const runtime = "nodejs";

async function clearSavedCart(userId) {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] }).catch((error) => {
    console.error("Could not clear saved cart after captured payment:", error);
  });
}

export async function POST(req) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature") || "";
    if (!/^[a-f\d]{64}$/i.test(signature)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // Verify the exact bytes Razorpay signed before parsing or acting on the event.
    const rawBody = Buffer.from(await req.arrayBuffer());
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest();
    const suppliedSignature = Buffer.from(signature, "hex");
    if (
      suppliedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, suppliedSignature)
    ) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    let event;
    try {
      event = JSON.parse(rawBody.toString("utf8"));
    } catch {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    if (event.event !== "payment.captured") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = event.payload?.payment?.entity;
    if (
      !payment ||
      typeof payment.id !== "string" ||
      typeof payment.order_id !== "string" ||
      payment.status !== "captured"
    ) {
      return NextResponse.json({ error: "Invalid captured-payment event" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ razorpayOrderId: payment.order_id });
    if (!order) {
      console.warn("Razorpay captured payment has no matching store order:", payment.order_id);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // The conditional state change makes duplicate and racing callbacks idempotent.
    if (order.paymentStatus === "paid") {
      if (order.razorpayPaymentId !== payment.id) {
        console.error("Additional captured payment needs review:", order.orderId, payment.id);
      }
      await clearSavedCart(order.user);
      return NextResponse.json({ received: true }, { status: 200 });
    }
    if (order.paymentStatus !== "pending") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const expectedAmount = Math.round(Number(order.total) * 100);
    if (
      !Number.isFinite(expectedAmount) ||
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      console.error("Razorpay captured payment does not match store order:", order.orderId);
      return NextResponse.json({ error: "Payment does not match order" }, { status: 400 });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        paymentStatus: "pending",
        razorpayOrderId: payment.order_id,
      },
      {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayPaymentId: payment.id,
      },
      { new: true },
    );

    if (updatedOrder) {
      await clearSavedCart(order.user);
    } else {
      const paidOrder = await Order.findOne({
        _id: order._id,
        paymentStatus: "paid",
        razorpayOrderId: payment.order_id,
      }).select("user");
      if (paidOrder) await clearSavedCart(paidOrder.user);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
