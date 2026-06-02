"use client";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, X } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-white border border-beige p-16 text-center">
        <Heart size={48} className="text-beige-dark mx-auto mb-4" />
        <h2 className="font-heading text-3xl text-charcoal/40 mb-3">
          Your Wishlist is Empty
        </h2>
        <p className="font-body text-charcoal/40 mb-6">
          Save items you love for later
        </p>
        <Link href="/collections" className="btn-primary">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-2xl text-charcoal mb-6">
        My Wishlist ({items.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-beige p-4 flex gap-4 group hover:border-gold/30 transition-all"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative w-20 h-20 flex-shrink-0 bg-beige-light overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="font-body text-sm font-medium text-charcoal hover:text-emerald transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-heading text-base text-emerald">
                  {formatPrice(item.discountPrice || item.price)}
                </span>
                {item.discountPrice && (
                  <span className="text-xs text-charcoal/40 line-through">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      price: item.discountPrice || item.price,
                      quantity: 1,
                      slug: item.slug,
                    });
                    openCart();
                    toast.success("Added to basket!");
                  }}
                  className="flex items-center gap-1.5 text-xs font-body font-medium bg-emerald text-ivory px-3 py-1.5 hover:bg-emerald-dark transition-colors"
                >
                  <ShoppingBag size={12} /> Add to Basket
                </button>
                <button
                  onClick={() => {
                    removeItem(item.id);
                    toast("Removed from wishlist", { icon: "💔" });
                  }}
                  className="text-charcoal/30 hover:text-red-500 transition-colors p-1.5"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
