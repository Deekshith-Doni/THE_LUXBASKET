"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();

  const total = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-ivory z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-beige bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-emerald" />
                <h2 className="font-heading text-xl text-charcoal">
                  Your Basket
                </h2>
                {items.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold text-emerald-dark text-[10px] font-bold font-body flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-charcoal/60 hover:text-charcoal transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                  <ShoppingBag size={48} className="text-beige-dark" />
                  <p className="font-heading text-2xl text-charcoal/40">
                    Your basket is empty
                  </p>
                  <p className="text-sm font-body text-charcoal/40">
                    Discover our luxury collections and add your favourites
                  </p>
                  <Link
                    href="/collections"
                    onClick={closeCart}
                    className="btn-primary mt-2"
                  >
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-beige">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-5">
                      {/* Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-beige-light overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-body text-sm font-medium text-charcoal hover:text-emerald transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.customization && (
                          <p className="text-xs text-charcoal/50 mt-0.5 font-body line-clamp-1">
                            {item.customization}
                          </p>
                        )}
                        <p className="font-heading text-base font-medium text-emerald mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-beige-dark">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-charcoal/60 hover:text-emerald hover:bg-beige transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-body font-medium text-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-charcoal/60 hover:text-emerald hover:bg-beige transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-600 transition-colors ml-auto"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-beige bg-white p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-charcoal/60">
                    Subtotal
                  </span>
                  <span className="font-heading text-xl font-medium text-charcoal">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs font-body text-charcoal/40 text-center">
                  Shipping & discounts calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center justify-center"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-outline w-full text-center justify-center py-3"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
