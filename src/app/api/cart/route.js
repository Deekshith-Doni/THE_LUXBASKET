import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ user: session.user.id })
      .populate("items.product", "name images price discountPrice slug stock")
      .lean();

    return NextResponse.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    console.error("GET cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity = 1, customization } = await req.json();
    await connectDB();

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 },
      );
    }

    const price = product.discountPrice || product.price;
    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: session.user.id,
        items: [{ product: productId, quantity, price, customization }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.customization =
          customization || existingItem.customization;
      } else {
        cart.items.push({ product: productId, quantity, price, customization });
      }
      await cart.save();
    }

    await cart.populate(
      "items.product",
      "name images price discountPrice slug stock",
    );
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("POST cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, clearAll } = await req.json();
    await connectDB();

    if (clearAll) {
      await Cart.findOneAndUpdate({ user: session.user.id }, { items: [] });
      return NextResponse.json({ success: true, message: "Cart cleared" });
    }

    const cart = await Cart.findOne({ user: session.user.id });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );
      await cart.save();
    }

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (error) {
    console.error("DELETE cart error:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 },
    );
  }
}
