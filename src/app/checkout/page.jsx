"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Loader2, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const steps = ["Address", "Review", "Payment"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    name: session?.user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = subtotal();
  const shipping = total >= 1999 ? 0 : 149;
  const finalTotal = total + shipping;

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.id,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            customization: i.customization,
          })),
          shippingAddress: address,
          paymentMethod: "cod",
          subtotal: total,
          shippingCharge: shipping,
          total: finalTotal,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderId(data.order.orderId);
        setOrderPlaced(true);
        clearCart();
        toast.success("Order placed successfully!");
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center py-20">
        <div className="text-center max-w-lg mx-auto px-6">
          <CheckCircle2 size={72} className="text-emerald mx-auto mb-6" />
          <h1 className="font-heading text-4xl text-charcoal mb-3">
            Order Confirmed!
          </h1>
          <p className="font-body text-charcoal/60 text-lg mb-2">
            Your luxury basket is on its way 🎁
          </p>
          <p className="font-body text-sm text-charcoal/40 mb-8">
            Order ID:{" "}
            <span className="font-medium text-charcoal">{orderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/orders" className="btn-primary">
              Track Your Order
            </Link>
            <Link href="/collections" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-6">
        <ShoppingBag size={64} className="text-beige-dark" />
        <h1 className="font-heading text-3xl text-charcoal/40">
          Your basket is empty
        </h1>
        <Link href="/collections" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-white border-b border-beige py-4">
        <div className="container-luxury">
          <h1 className="font-heading text-3xl text-charcoal">Checkout</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-beige py-4">
        <div className="container-luxury">
          <div className="flex items-center gap-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-bold transition-all ${
                    i < step
                      ? "bg-emerald text-ivory"
                      : i === step
                        ? "bg-gold text-emerald-dark"
                        : "bg-beige text-charcoal/40"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm font-body font-medium ${i === step ? "text-charcoal" : "text-charcoal/40"}`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-12 h-px bg-beige ml-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-luxury py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="bg-white border border-beige p-8">
                <h2 className="font-heading text-2xl text-charcoal mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-gold" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="luxury-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={address.name}
                      onChange={(e) =>
                        setAddress({ ...address, name: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="Recipient's full name"
                    />
                  </div>
                  <div>
                    <label className="luxury-label">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="luxury-label">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={address.line1}
                      onChange={(e) =>
                        setAddress({ ...address, line1: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="House/Flat, Street, Area"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="luxury-label">Address Line 2</label>
                    <input
                      type="text"
                      value={address.line2}
                      onChange={(e) =>
                        setAddress({ ...address, line2: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="Landmark (optional)"
                    />
                  </div>
                  <div>
                    <label className="luxury-label">City *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="luxury-label">State *</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="luxury-label">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="6-digit PIN code"
                      maxLength={6}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (
                      !address.name ||
                      !address.phone ||
                      !address.line1 ||
                      !address.city ||
                      !address.state ||
                      !address.pincode
                    ) {
                      toast.error("Please fill all required fields");
                      return;
                    }
                    setStep(1);
                  }}
                  className="btn-primary mt-6"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <div className="bg-white border border-beige p-8">
                <h2 className="font-heading text-2xl text-charcoal mb-6">
                  Review Your Order
                </h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 py-4 border-b border-beige last:border-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-body text-sm font-medium text-charcoal">
                          {item.name}
                        </p>
                        {item.customization && (
                          <p className="text-xs text-charcoal/50 mt-0.5">
                            ✦ {item.customization}
                          </p>
                        )}
                        <p className="font-body text-xs text-charcoal/50 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-heading text-base text-emerald font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Summary */}
                <div className="bg-beige-light p-4 border border-beige mb-6">
                  <p className="text-xs font-body font-bold tracking-widest uppercase text-charcoal/60 mb-2">
                    Delivering to
                  </p>
                  <p className="font-body text-sm text-charcoal">
                    {address.name} • {address.phone}
                  </p>
                  <p className="font-body text-sm text-charcoal/70">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="font-body text-sm text-charcoal/70">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="btn-outline">
                    ← Edit Address
                  </button>
                  <button onClick={() => setStep(2)} className="btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white border border-beige p-8">
                <h2 className="font-heading text-2xl text-charcoal mb-6">
                  Payment Method
                </h2>

                <div className="space-y-3 mb-8">
                  <label className="flex items-center gap-3 p-4 border-2 border-emerald bg-emerald/5 cursor-pointer">
                    <input
                      type="radio"
                      defaultChecked
                      className="accent-emerald"
                    />
                    <div>
                      <p className="font-body text-sm font-semibold text-charcoal">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs font-body text-charcoal/50">
                        Pay when your order arrives
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-beige cursor-not-allowed opacity-50">
                    <input type="radio" disabled className="accent-emerald" />
                    <div>
                      <p className="font-body text-sm font-semibold text-charcoal">
                        Online Payment
                      </p>
                      <p className="text-xs font-body text-charcoal/50">
                        UPI / Cards / Netbanking — Coming Soon
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-outline">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="btn-primary flex-1 justify-center"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      `Place Order — ${formatPrice(finalTotal)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white border border-beige p-6 h-fit">
            <h3 className="font-heading text-xl text-charcoal mb-5">
              Order Summary
            </h3>
            <div className="space-y-3 text-sm font-body mb-5">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="border-t border-beige pt-3 flex justify-between font-semibold text-charcoal">
                <span>Total</span>
                <span className="font-heading text-2xl text-emerald">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
            <div className="text-xs font-body text-charcoal/40 space-y-1.5">
              <p>✦ All products are premium quality</p>
              <p>✦ Secure checkout guaranteed</p>
              <p>✦ 7-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
