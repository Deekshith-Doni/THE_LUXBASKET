import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const wishlist = await Wishlist.findOne({ user: session.user.id })
      .populate("products", "name images price discountPrice slug rating")
      .lean();

    return NextResponse.json({
      success: true,
      wishlist: wishlist || { products: [] },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    await connectDB();

    let wishlist = await Wishlist.findOne({ user: session.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: session.user.id,
        products: [productId],
      });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    return NextResponse.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    await connectDB();

    await Wishlist.findOneAndUpdate(
      { user: session.user.id },
      { $pull: { products: productId } },
    );

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 },
    );
  }
}
