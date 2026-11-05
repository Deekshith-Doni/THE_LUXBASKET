"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Check, CheckCircle2, Copy, Loader2, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Script from "next/script";
import { getCampaignAttribution, trackEvent } from "@/lib/analytics";

const steps = ["Address", "Review", "Payment"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, replaceItems } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderIdCopied, setOrderIdCopied] = useState(false);

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
            clientPrice: i.price,
            quantity: i.quantity,
            customization: i.customization,
          })),
          shippingAddress: address,
          paymentMethod: "online",
          subtotal: total,
          shippingCharge: shipping,
          total: finalTotal,
          attribution: getCampaignAttribution(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.currentItems?.length) {
          replaceItems(data.currentItems);
          router.push("/cart");
        }
        toast.error(data.error || "Failed to place order");
        setIsLoading(false);
        return;
      }

      const mongoOrderId = data.order.orderId;
      const serverTotal = Number(data.order.total);
      const serverSubtotal = Number(data.order.subtotal);
      const serverShippingCharge = Number(data.order.shippingCharge || 0);
      if (
        !Number.isFinite(serverTotal) ||
        serverTotal <= 0 ||
        !Number.isFinite(serverSubtotal) ||
        serverSubtotal < 0 ||
        !Number.isFinite(serverShippingCharge) ||
        !Array.isArray(data.order.items)
      ) {
        toast.error("We could not confirm the order total. Please try again.");
        setIsLoading(false);
        return;
      }

      const rzpRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt: mongoOrderId }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        toast.error("Failed to initialize payment gateway");
        setIsLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.order.amount,
        currency: rzpData.order.currency,
        name: "The Lux Basket",
        description: "Luxury Gifting",
        order_id: rzpData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mongo_order_id: mongoOrderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              trackEvent("purchase", {
                transaction_id: mongoOrderId,
                currency: "INR",
                value: serverSubtotal,
                shipping: serverShippingCharge,
                items: data.order.items.map((item) => ({
                  item_id: String(item.product),
                  item_name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
              });
              setOrderId(mongoOrderId);
              setOrderPlaced(true);
              clearCart();
              toast.success("Payment successful!");
            } else {
              toast.error(verifyData.error || "Payment verification failed");
            }
          } catch (error) {
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: address.name,
          email: session?.user?.email || "",
          contact: address.phone,
        },
        theme: {
          color: "#0f3b33",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
      setIsLoading(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          <div className="mb-8 flex items-center justify-center gap-2 font-body text-sm text-charcoal/70">
            <span>Order ID:</span>
            <span className="font-medium text-charcoal">{orderId}</span>
            <button
              type="button"
              aria-label={orderIdCopied ? "Order ID copied" : "Copy order ID"}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(orderId);
                  setOrderIdCopied(true);
                  trackEvent("copy_order_id");
                  window.setTimeout(() => setOrderIdCopied(false), 1800);
                } catch {
                  toast.error("Could not copy the order ID");
                }
              }}
              className="flex h-9 w-9 items-center justify-center border border-beige text-emerald hover:bg-emerald hover:text-white"
            >
              {orderIdCopied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-primary">
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
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                    <label htmlFor="checkout-name" className="luxury-label">Full Name *</label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={address.name}
                      onChange={(e) =>
                        setAddress({ ...address, name: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="Recipient's full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="luxury-label">Phone *</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      pattern="[+0-9 ()-]{10,18}"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="checkout-line1" className="luxury-label">Address Line 1 *</label>
                    <input
                      id="checkout-line1"
                      type="text"
                      required
                      minLength={4}
                      maxLength={200}
                      value={address.line1}
                      onChange={(e) =>
                        setAddress({ ...address, line1: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="House/Flat, Street, Area"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="checkout-line2" className="luxury-label">Address Line 2</label>
                    <input
                      id="checkout-line2"
                      type="text"
                      maxLength={200}
                      value={address.line2}
                      onChange={(e) =>
                        setAddress({ ...address, line2: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="Landmark (optional)"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-city" className="luxury-label">City *</label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-state" className="luxury-label">State *</label>
                    <input
                      id="checkout-state"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-pincode" className="luxury-label">PIN Code *</label>
                    <input
                      id="checkout-pincode"
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
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
                      address.name.trim().length < 2 ||
                      !/^\+?[\d ()-]{10,18}$/.test(address.phone.trim()) ||
                      address.line1.trim().length < 4 ||
                      address.city.trim().length < 2 ||
                      address.state.trim().length < 2 ||
                      !/^\d{6}$/.test(address.pincode.trim())
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
                  Online Payment
                </h2>

                <div className="flex items-start gap-3 border-2 border-emerald bg-emerald/5 p-4 mb-8">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald" />
                  <div>
                    <p className="font-body text-sm font-semibold text-charcoal">
                      Secure payment with Razorpay
                    </p>
                    <p className="text-xs font-body text-charcoal/60 mt-1">
                      Pay by UPI, card, or netbanking.
                    </p>
                  </div>
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
    </>
  );
}
