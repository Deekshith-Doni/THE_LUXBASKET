"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Heart,
  Package,
  Truck,
  RotateCcw,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock product data — replace with dynamic fetch in production
const product = {
  _id: "1",
  name: "Royal Diwali Celebration Hamper",
  slug: "royal-diwali-hamper",
  description: `Experience the pinnacle of festive gifting with our Royal Diwali Celebration Hamper. 
  Each basket is hand-curated with the finest selection of premium dry fruits, artisanal chocolates, 
  luxury sweets, and fragrant incense — all presented in our signature emerald and gold gift box.
  
  Perfect for corporate gifting, family celebrations, and showing your appreciation in the most 
  luxurious way possible.`,
  shortDescription:
    "Premium dry fruits, sweets & artisanal chocolates in signature packaging",
  images: [
    "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=90",
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=90",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=90",
    "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=90",
  ],
  price: 2999,
  discountPrice: 2499,
  rating: 4.9,
  numReviews: 234,
  stock: 50,
  isBestSeller: true,
  isNewArrival: false,
  customizationOptions: {
    available: true,
    options: ["Add Name Card", "Custom Ribbon Color", "Add Premium Box"],
  },
  bulkOrderAvailable: true,
  minBulkQuantity: 25,
  category: { name: "Festive Hampers", slug: "festive" },
  tags: ["festive", "diwali", "luxury", "premium"],
  includes: [
    "Premium Cashews (250g)",
    "Roasted Almonds (200g)",
    "Dark Chocolate Truffles (150g)",
    "Saffron Ghee (100ml)",
    "Premium Incense Sticks",
    "Hand-painted Diya set",
    "Luxury Gift Box with Ribbon",
    "Personalized Message Card",
  ],
  reviews: [
    {
      _id: "r1",
      user: "u1",
      name: "Priya S.",
      rating: 5,
      comment:
        "Absolutely stunning packaging! Everyone was impressed. The quality is truly premium.",
      createdAt: "2024-10-15",
    },
    {
      _id: "r2",
      user: "u2",
      name: "Rahul M.",
      rating: 5,
      comment:
        "Ordered 100 pieces for Diwali corporate gifting. Flawless delivery and presentation.",
      createdAt: "2024-10-20",
    },
    {
      _id: "r3",
      user: "u3",
      name: "Sneha K.",
      rating: 4,
      comment:
        "Beautiful hamper! The chocolates were exquisite. Slight delay in delivery but worth it.",
      createdAt: "2024-11-01",
    },
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomization, setSelectedCustomization] = useState([]);
  const [customNote, setCustomNote] = useState("");
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
        } else {
          toast.error("Product not found");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load product details");
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const catSlug = typeof product.category === "object" ? product.category.slug : "";
    fetch(`/api/products?limit=6${catSlug ? `&category=${catSlug}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const filtered = data.products
            .filter((p) => p._id !== product._id)
            .slice(0, 3);
          setRelatedProducts(filtered);
        }
      })
      .catch(() => {});
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-charcoal/40 font-body animate-pulse">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-4">
        <h1 className="font-heading text-3xl text-charcoal/40">Product not found</h1>
        <Link href="/collections" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      image: product.images ? product.images[0] : "/placeholder-product.jpg",
      price: product.discountPrice || product.price,
      quantity,
      slug: product.slug,
      customization: [...selectedCustomization, customNote]
        .filter(Boolean)
        .join(", "),
    });
    openCart();
    toast.success("Added to your basket!");
  };

  const whatsappUrl = getWhatsAppUrl(
    "+918892153586",
    `Hi! I'm interested in ordering: ${product.name} (${formatPrice(product.discountPrice || product.price)}). Can you help me?`,
  );

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-beige py-3">
        <div className="container-luxury">
          <p className="text-xs font-body text-charcoal/50">
            Home / Collections / {product.category.name} /{" "}
            <span className="text-charcoal">{product.name}</span>
          </p>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-square bg-beige-light overflow-hidden group"
              key={activeImage}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    setActiveImage(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length,
                    )
                  }
                  className="w-10 h-10 bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) => (prev + 1) % product.images.length)
                  }
                  className="w-10 h-10 bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="absolute top-4 right-4">
                <ZoomIn size={18} className="text-white/70" />
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? "border-gold"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isBestSeller && (
                <span className="badge-gold">Best Seller</span>
              )}
              <span className="badge-sale">-{discount}%</span>
            </div>

            {/* Name */}
            <div>
              <p className="text-xs font-body text-charcoal/40 tracking-widest uppercase">
                {product.category.name}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-medium text-charcoal mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= Math.round(product.rating)
                        ? "text-gold fill-gold"
                        : "text-charcoal/20"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-body text-charcoal/60">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-beige">
              <span className="font-heading text-4xl font-medium text-emerald">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="font-body text-xl text-charcoal/40 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="badge-sale ml-1">
                    Save {formatPrice(product.price - product.discountPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Short desc */}
            <p className="font-body text-charcoal/60 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* What's Included */}
            {product.includes && product.includes.length > 0 && (
              <div>
                <p className="font-body text-xs font-bold tracking-widest uppercase text-charcoal mb-3">
                  What&apos;s Included
                </p>
                <ul className="grid grid-cols-2 gap-1.5">
                  {product.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm font-body text-charcoal/60"
                    >
                      <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customization */}
            {product.customizationOptions.available && (
              <div>
                <p className="font-body text-xs font-bold tracking-widest uppercase text-charcoal mb-3">
                  Customization Options
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.customizationOptions.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setSelectedCustomization((prev) =>
                          prev.includes(opt)
                            ? prev.filter((o) => o !== opt)
                            : [...prev, opt],
                        )
                      }
                      className={`px-4 py-2 text-xs font-body border transition-all ${
                        selectedCustomization.includes(opt)
                          ? "bg-emerald text-ivory border-emerald"
                          : "bg-white text-charcoal border-beige-dark hover:border-emerald"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add a custom message or special request..."
                  className="luxury-input mt-3 h-20 resize-none text-sm"
                />
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-beige-dark">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-charcoal/60 hover:text-emerald hover:bg-beige transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-body font-medium text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="w-10 h-12 flex items-center justify-center text-charcoal/60 hover:text-emerald hover:bg-beige transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 justify-center"
              >
                <ShoppingBag size={16} />
                Add to Basket
              </button>

              <button
                onClick={() =>
                  toggleItem({
                    id: product._id,
                    name: product.name,
                    image: product.images[0],
                    price: product.price,
                    discountPrice: product.discountPrice,
                    slug: product.slug,
                  })
                }
                className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                  inWishlist
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-beige-dark text-charcoal/60 hover:text-red-500 hover:border-red-200"
                }`}
              >
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] font-body text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle size={18} />
              Order on WhatsApp / Ask a Question
            </a>

            {/* Bulk Order */}
            {product.bulkOrderAvailable && (
              <div className="bg-emerald/5 border border-emerald/20 p-4">
                <p className="text-sm font-body font-semibold text-emerald">
                  🎁 Bulk Order Available (Min. {product.minBulkQuantity} units)
                </p>
                <p className="text-xs font-body text-charcoal/60 mt-1">
                  Corporate & bulk orders get special pricing and dedicated
                  support.
                </p>
                <a
                  href="/corporate"
                  className="text-xs font-body text-gold underline mt-1 inline-block"
                >
                  Request a bulk quote →
                </a>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-beige">
              {[
                { icon: Package, label: "Premium Packaging" },
                { icon: Truck, label: "Pan-India Delivery" },
                { icon: RotateCcw, label: "7-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <Icon size={18} className="text-gold" />
                  <span className="text-xs font-body text-charcoal/60">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Reviews */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12">
          {/* Description */}
          <div>
            <h2 className="font-heading text-3xl text-charcoal mb-6">
              About this Gift
            </h2>
            <div className="w-12 h-px bg-gold mb-6" />
            <p className="font-body text-charcoal/60 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-heading text-3xl text-charcoal mb-6">
              Customer Reviews
            </h2>
            <div className="w-12 h-px bg-gold mb-6" />
            <div className="space-y-5">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-beige pb-5 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-body text-sm font-semibold text-charcoal">
                        {review.name}
                      </p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              s <= review.rating
                                ? "text-gold fill-gold"
                                : "text-charcoal/20"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-body text-charcoal/40">
                      {review.createdAt}
                    </span>
                  </div>
                  <p className="text-sm font-body text-charcoal/60 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-3xl text-charcoal mb-2">
              You Might Also Love
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp._id} href={`/product/${rp.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden bg-beige-light">
                    <Image
                      src={rp.images[0] || "/placeholder-product.jpg"}
                      alt={rp.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="300px"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading text-base text-charcoal group-hover:text-emerald transition-colors">
                      {rp.name}
                    </h3>
                    <p className="font-heading text-lg text-emerald mt-1">
                      {formatPrice(rp.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
