"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

const categories = [
  { label: "All", value: "" },
  { label: "Luxury Hampers", value: "luxury-hampers" },
  { label: "Corporate Gifts", value: "corporate" },
  { label: "Wedding Gifts", value: "wedding" },
  { label: "Festive Hampers", value: "festive" },
  { label: "Customized Gifts", value: "customized" },
];

const sortOptions = [
  { label: "Newest First", value: "createdAt-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating-desc" },
  { label: "Most Reviews", value: "numReviews-desc" },
];

function CollectionsContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "",
  );
  const [activeSort, setActiveSort] = useState("createdAt-desc");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const cat = typeof p.category === "object" ? p.category.slug : p.category;
    if (activeCategory && cat !== activeCategory) return false;
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    const price = p.discountPrice || p.price;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === "price-asc") {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceA - priceB;
    }
    if (activeSort === "price-desc") {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      return priceB - priceA;
    }
    if (activeSort === "rating-desc") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (activeSort === "numReviews-desc") {
      return (b.numReviews || 0) - (a.numReviews || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-emerald-dark py-16">
        <div className="container-luxury text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-tag text-gold"
          >
            Our Collections
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl text-ivory font-light mt-3"
          >
            Luxury Gift Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-ivory/60 font-body mt-3 text-sm"
          >
            Home / Collections
            {activeCategory &&
              ` / ${categories.find((c) => c.value === activeCategory)?.label}`}
          </motion.p>
        </div>
      </div>

      <div className="container-luxury py-12">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 text-xs font-body font-semibold tracking-widest uppercase border transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-emerald text-ivory border-emerald"
                    : "bg-white text-charcoal/60 border-beige hover:border-emerald hover:text-emerald"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts..."
                className="luxury-input pl-9 py-2 text-sm w-48"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="luxury-input py-2 text-sm pr-8 appearance-none cursor-pointer min-w-40"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-body transition-colors ${
                showFilters
                  ? "bg-emerald text-ivory border-emerald"
                  : "bg-white text-charcoal border-beige hover:border-emerald"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white border border-beige p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg text-charcoal">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-charcoal/40 hover:text-charcoal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="luxury-label">Price Range</label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="luxury-input py-2 text-sm w-24"
                    placeholder="Min"
                  />

                  <span className="text-charcoal/40">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="luxury-input py-2 text-sm w-24"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="luxury-label">Special</label>
                <div className="mt-2 space-y-2">
                  {[
                    "Best Sellers",
                    "New Arrivals",
                    "Customizable",
                    "Bulk Available",
                  ].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm font-body text-charcoal/70 cursor-pointer"
                    >
                      <input type="checkbox" className="accent-gold" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-body text-charcoal/50">
            Showing{" "}
            <span className="text-charcoal font-medium">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-[350px] w-full bg-beige/20 animate-pulse rounded-lg border border-beige/40" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Filter size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">
              No products found
            </p>
            <p className="text-sm font-body text-charcoal/30 mt-2">
              Try adjusting your filters
            </p>
            <button
              onClick={() => {
                setActiveCategory("");
                setSearchQuery("");
                setPriceRange([0, 10000]);
              }}
              className="btn-outline mt-6"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <div className="text-charcoal/40 font-body">
            Loading collections...
          </div>
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}
