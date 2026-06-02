"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";


export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    fetch("/api/products?limit=4&bestSeller=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setBestSellers(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product._id,
      name: product.name,
      image: product.images[0],
      price: product.discountPrice || product.price,
      quantity: 1,
      slug: product.slug,
    });
    openCart();
    toast.success("Added to your basket!");
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-luxury">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="section-tag">Best Sellers</span>
              <h2 className="section-title mt-3">Most Loved Gifts</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-[350px] w-full bg-beige/20 animate-pulse rounded-lg border border-beige/40" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bestSellers || bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-tag"
            >
              Best Sellers
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mt-3"
            >
              Most Loved Gifts
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/collections?bestSeller=true" className="btn-outline">
              View All
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, i) => {
            const price = product.discountPrice || product.price;
            const discount = product.discountPrice
              ? Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100,
                )
              : 0;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-beige hover:border-gold/30 hover:shadow-card-hover transition-all duration-400"
              >
                <Link href={`/product/${product.slug}`}>
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square bg-beige-light">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 space-y-1.5">
                      {discount > 0 && (
                        <span className="badge-sale text-xs block">
                          -{discount}%
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="badge-emerald text-xs block">New</span>
                      )}
                      {product.isBestSeller && (
                        <span className="badge-gold text-xs block">
                          Best Seller
                        </span>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-emerald/0 group-hover:bg-emerald/10 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full btn-primary py-2.5 text-xs justify-center gap-2 flex"
                      >
                        <ShoppingBag size={14} />
                        Add to Basket
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-charcoal/40 font-body tracking-widest uppercase mb-1">
                      {typeof product.category === "object" ? product.category.name : "Best Seller"}
                    </p>
                    <h3 className="font-heading text-base font-medium text-charcoal group-hover:text-emerald transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs font-body text-charcoal/50 mt-1 line-clamp-1">
                      {product.shortDescription}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star size={11} className="text-gold fill-gold" />
                      <span className="text-xs font-body text-charcoal/60">
                        {product.rating} ({product.numReviews})
                      </span>
                    </div>

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
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
