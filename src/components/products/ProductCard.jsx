"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "/placeholder-product.svg";

export default function ProductCard({ product, className, section = "product_list", position }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product._id);
  const images = Array.isArray(product.images) ? product.images : [];
  const image = imageFailed ? FALLBACK_IMAGE : images[imgIndex] || images[0] || FALLBACK_IMAGE;
  const price = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? calculateDiscount(product.price, product.discountPrice)
    : 0;

  const trackProductClick = () => {
    trackEvent("select_item", {
      item_list_name: section,
      items: [{ item_id: product._id, item_name: product.name, price }],
    });
    trackEvent("product_click", {
      item_name: product.name,
      section,
      ...(position ? { position } : {}),
    });
  };

  const handleAddToCart = () => {
    const value = price;
    addItem({
      id: product._id,
      name: product.name,
      image: images[0] || FALLBACK_IMAGE,
      price,
      quantity: 1,
      slug: product.slug,
    });
    trackEvent("add_to_cart", {
      currency: "INR",
      value,
      items: [{ item_id: product._id, item_name: product.name, price, quantity: 1 }],
    });
    openCart();
    toast.success("Added to your basket!");
  };

  const handleWishlist = () => {
    toggleItem({
      id: product._id,
      name: product.name,
      image: images[0] || FALLBACK_IMAGE,
      price: product.price,
      discountPrice: product.discountPrice,
      slug: product.slug,
    });
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ♥", {
      icon: inWishlist ? "💔" : "❤️",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      className={cn("product-card group relative flex flex-col h-full", className)}
    >
      <div
        className="relative overflow-hidden bg-beige-light aspect-square"
        onMouseEnter={() => images[1] && setImgIndex(1)}
        onMouseLeave={() => setImgIndex(0)}
      >
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-gold"
          onClick={trackProductClick}
          aria-label={`View ${product.name}`}
        >
          <Image
            src={image}
            alt={product.name || "Gift hamper"}
            fill
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 639px) 44vw, (max-width: 1023px) 32vw, 24vw"
          />
        </Link>

        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 pointer-events-none">
          {product.isNewArrival && <span className="badge-emerald text-[9px]">New</span>}
          {discount > 0 && <span className="badge-sale text-[9px]">-{discount}%</span>}
          {product.isBestSeller && <span className="badge-gold text-[9px]">Best Seller</span>}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 w-11 h-11 flex items-center justify-center bg-white/95 shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
            inWishlist ? "text-red-500" : "text-charcoal/70 hover:text-red-500",
          )}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={inWishlist}
        >
          <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-3 sm:p-4 flex flex-1 flex-col">
        <p className="text-[10px] sm:text-xs font-body text-charcoal/55 tracking-wider uppercase mb-1 line-clamp-1">
          {typeof product.category === "object" ? product.category?.name : ""}
        </p>
        <Link href={`/product/${product.slug}`} onClick={trackProductClick} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
          <h3 className="font-heading text-base sm:text-lg font-medium text-charcoal group-hover:text-emerald transition-colors line-clamp-2 leading-snug min-h-[2.7em]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0 mt-2">
          <span className="font-heading text-lg sm:text-xl font-medium text-emerald">
            {formatPrice(price)}
          </span>
          {product.discountPrice && (
            <span className="text-xs sm:text-sm font-body text-charcoal/50 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 min-h-11 w-full inline-flex items-center justify-center gap-2 bg-emerald px-2 py-2 text-[11px] sm:text-xs font-body font-semibold tracking-wider uppercase text-ivory transition-colors hover:bg-emerald-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <ShoppingBag size={15} />
          Add to Basket
        </button>
      </div>
    </motion.article>
  );
}
