"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/products?limit=50${search ? `&search=${search}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
      toast.success("Product deleted successfully");
    } else {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Products</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">
            {products.length} products in store
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary self-start"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="luxury-input pl-11 w-full max-w-sm"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">
              No products yet
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-beige-light/50">
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-body font-bold tracking-widest uppercase text-charcoal/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-beige/50 hover:bg-beige-light/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-beige-light overflow-hidden">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-charcoal line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs font-body text-charcoal/50">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-body text-charcoal/70">
                      {typeof product.category === "object"
                        ? product.category.name
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-heading text-base text-emerald">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                      {product.discountPrice && (
                        <p className="text-xs font-body text-charcoal/40 line-through">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-body font-medium ${product.stock > 10 ? "text-emerald" : product.stock > 0 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`badge-${product.isActive ? "emerald" : "sale"} text-xs self-start`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                        {product.isFeatured && (
                          <span className="badge-gold text-xs self-start">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-emerald hover:border-emerald transition-colors text-xs"
                        >
                          ↗
                        </a>
                        <button className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-blue-500 hover:border-blue-300 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-red-500 hover:border-red-300 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal placeholder */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="bg-white max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-2xl text-charcoal mb-6">
              Add New Product
            </h2>
            <p className="font-body text-sm text-charcoal/60 mb-4">
              Complete product creation form with image upload. Connect
              Cloudinary in .env to enable image uploads.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Product Name",
                "Slug",
                "Price",
                "Discount Price",
                "Stock",
                "Category",
                "Short Description",
                "Tags",
              ].map((field) => (
                <div
                  key={field}
                  className={field === "Short Description" ? "col-span-2" : ""}
                >
                  <label className="luxury-label">{field}</label>
                  {field === "Short Description" ? (
                    <textarea
                      className="luxury-input h-20 resize-none text-sm"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={
                        ["Price", "Discount Price", "Stock"].includes(field)
                          ? "number"
                          : "text"
                      }
                      className="luxury-input text-sm"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary">Save Product</button>
              <button
                onClick={() => setShowForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
