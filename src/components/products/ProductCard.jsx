"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProductCard({ product, className }) {
  const [imgIndex, setImgIndex] = useState(0);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product._id);

  const price = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? calculateDiscount(product.price, product.discountPrice)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: product.name,
      image: product.images[0],
      price,
      quantity: 1,
      slug: product.slug,
    });
    openCart();
    toast.success("Added to your basket!");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItem({
      id: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      slug: product.slug,
    });
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ♥", {
      icon: inWishlist ? "💔" : "❤️",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("product-card group relative flex flex-col justify-between h-full", className)}
    >
      {/* Image & Overlays container */}
      <div
        className="relative overflow-hidden bg-beige-light aspect-square"
        onMouseEnter={() => product.images[1] && setImgIndex(1)}
        onMouseLeave={() => setImgIndex(0)}
      >
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[imgIndex] || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isNewArrival && (
            <span className="badge-emerald text-xs">New</span>
          )}
          {discount > 0 && (
            <span className="badge-sale text-xs">-{discount}%</span>
          )}
          {product.isBestSeller && (
            <span className="badge-gold text-xs">Best Seller</span>
          )}
        </div>

        {/* Actions Overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={cn(
              "w-9 h-9 flex items-center justify-center bg-white shadow-md transition-colors",
              inWishlist
                ? "text-red-500"
                : "text-charcoal/60 hover:text-red-500",
            )}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </motion.button>

          <Link
            href={`/product/${product.slug}`}
            className="w-9 h-9 flex items-center justify-center bg-white shadow-md text-charcoal/60 hover:text-emerald transition-colors"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-emerald/95 py-3 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0 z-10">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full text-ivory text-xs font-body font-semibold tracking-widest uppercase"
          >
            <ShoppingBag size={14} />
            Add to Basket
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-body text-charcoal/40 tracking-widest uppercase mb-1">
            {typeof product.category === "object" ? product.category.name : ""}
          </p>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-heading text-base font-medium text-charcoal group-hover:text-emerald transition-colors duration-200 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={10}
                    className={
                      star <= Math.round(product.rating)
                        ? "text-gold fill-gold"
                        : "text-charcoal/20"
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-body text-charcoal/40">
                ({product.numReviews})
              </span>
            </div>
          )}
        </div>

        <div>
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-heading text-lg font-medium text-emerald">
              {formatPrice(price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm font-body text-charcoal/40 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Customization tag */}
          {product.customizationOptions?.available && (
            <p className="text-[10px] font-body text-gold tracking-wide mt-1">
              ✦ Customization available
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
