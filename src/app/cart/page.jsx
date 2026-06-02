"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");

  const total = subtotal();
  const shipping = total >= 1999 ? 0 : 149;
  const finalTotal = total - discount + shipping;

  const handleCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderAmount: total }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discount);
        setCouponApplied(couponCode.toUpperCase());
        toast.success(`Coupon applied! Saved ${formatPrice(data.discount)}`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-6 py-20">
        <ShoppingBag size={64} className="text-beige-dark" />
        <h1 className="font-heading text-4xl text-charcoal/40">
          Your basket is empty
        </h1>
        <p className="font-body text-charcoal/40">
          Add luxury gifts to get started
        </p>
        <Link href="/collections" className="btn-primary">
          Explore Collections <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-white border-b border-beige py-4">
        <div className="container-luxury">
          <h1 className="font-heading text-3xl text-charcoal">Your Basket</h1>
          <p className="text-sm font-body text-charcoal/50 mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-beige p-6 flex gap-5"
              >
                <div className="relative w-24 h-24 flex-shrink-0 bg-beige-light overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-heading text-lg text-charcoal hover:text-emerald transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast("Item removed", { icon: "🗑️" });
                      }}
                      className="text-charcoal/30 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {item.customization && (
                    <p className="text-xs font-body text-charcoal/50 mt-1">
                      ✦ {item.customization}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-beige-dark">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-emerald hover:bg-beige transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-body font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-emerald hover:bg-beige transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-heading text-xl text-emerald font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <button
              onClick={() => {
                clearCart();
                toast("Cart cleared");
              }}
              className="text-sm font-body text-charcoal/40 hover:text-red-500 transition-colors mt-2"
            >
              Clear entire cart
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white border border-beige p-6">
              <h3 className="font-heading text-lg text-charcoal mb-4 flex items-center gap-2">
                <Tag size={16} className="text-gold" /> Apply Coupon
              </h3>
              {couponApplied ? (
                <div className="flex items-center justify-between bg-emerald/5 border border-emerald/20 px-4 py-3">
                  <div>
                    <span className="badge-emerald text-xs">
                      {couponApplied}
                    </span>
                    <p className="text-xs font-body text-emerald mt-1">
                      Saved {formatPrice(discount)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDiscount(0);
                      setCouponApplied("");
                      setCouponCode("");
                    }}
                    className="text-xs font-body text-charcoal/40 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="luxury-input flex-1 py-2.5 text-sm"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={handleCoupon}
                    disabled={couponLoading || !couponCode}
                    className="btn-primary py-2.5 px-4 text-xs disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-beige p-6">
              <h3 className="font-heading text-xl text-charcoal mb-5">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald">
                    <span>Coupon Discount</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-charcoal/40">
                    Add {formatPrice(1999 - total)} more for free shipping
                  </p>
                )}
                <div className="border-t border-beige pt-3 flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-heading text-2xl text-emerald font-medium">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full justify-center mt-5"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link
                href="/collections"
                className="btn-ghost w-full justify-center mt-3 text-xs"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-beige p-5">
              <div className="space-y-3">
                {[
                  "Secure & Encrypted Checkout",
                  "Premium Packaging Guaranteed",
                  "Easy 7-Day Returns",
                ].map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-2 text-xs font-body text-charcoal/60"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
