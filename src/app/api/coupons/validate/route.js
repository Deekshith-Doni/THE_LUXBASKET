import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    const { code, orderAmount } = await req.json();
    if (!code)
      return NextResponse.json(
        { error: "Coupon code required" },
        { status: 400 },
      );

    await connectDB();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
    if (!coupon)
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 },
      );

    if (new Date() > coupon.expiryDate) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 },
      );
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "Coupon usage limit reached" },
        { status: 400 },
      );
    }
    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount ₹${coupon.minOrderAmount} required` },
        { status: 400 },
      );
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      discount: Math.round(discount),
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
