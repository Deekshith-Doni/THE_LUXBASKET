"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, Package, Upload } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    discountPrice: "",
    stock: "10",
    category: "",
    shortDescription: "",
    description: "Detailed product description goes here...",
    tags: "",
    images: [],
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
  });

  const fetchProducts = () => {
    fetch(`/api/products?limit=50${search ? `&search=${search}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    
    // Fetch categories for the dropdown
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
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

  const handleEditClick = (product) => {
    setEditingSlug(product.slug);
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price ? product.price.toString() : "",
      discountPrice: product.discountPrice ? product.discountPrice.toString() : "",
      stock: product.stock ? product.stock.toString() : "0",
      category: typeof product.category === "object" ? product.category._id : product.category || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "Detailed product description goes here...",
      tags: (product.tags || []).join(", "),
      images: product.images || [],
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      isNewArrival: !!product.isNewArrival,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSlug(null);
    setFormData({
      name: "",
      slug: "",
      price: "",
      discountPrice: "",
      stock: "10",
      category: "",
      shortDescription: "",
      description: "Detailed product description goes here...",
      tags: "",
      images: [],
      isActive: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if user is typing the name
    if (name === "name" && !formData.slug && !editingSlug) {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      }));
    }
  };

  const handleImageUpload = (result) => {
    if (result.event === "success") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.info.secure_url],
      }));
      toast.success("Image uploaded successfully");
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      return toast.error("Please upload at least one image");
    }
    if (!formData.category) {
      return toast.error("Please select a category");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock, 10),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const method = editingSlug ? "PUT" : "POST";
      const url = editingSlug ? `/api/products/${editingSlug}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (editingSlug ? "Failed to update product" : "Failed to create product"));

      toast.success(editingSlug ? "Product updated successfully" : "Product created successfully");
      handleCloseForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
                        <button
                          onClick={() => handleEditClick(product)}
                          className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-blue-500 hover:border-blue-300 transition-colors"
                          title="Edit Product"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-red-500 hover:border-red-300 transition-colors"
                          title="Delete Product"
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

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseForm()}
        >
          <div className="bg-white max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-2xl text-charcoal mb-6">
              {editingSlug ? "Edit Product" : "Add New Product"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Area */}
              <div>
                <label className="luxury-label block mb-2">Product Images</label>
                <div className="flex flex-wrap gap-4 mb-3">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 border border-beige">
                      <Image src={url} alt={`Upload ${i}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "luxbasket_preset"}
                    onSuccess={handleImageUpload}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-24 h-24 border-2 border-dashed border-beige flex flex-col items-center justify-center text-charcoal/50 hover:bg-beige-light/30 hover:border-emerald hover:text-emerald transition-colors"
                      >
                        <Upload size={20} className="mb-1" />
                        <span className="text-[10px] font-body uppercase tracking-wider">Upload</span>
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
                {formData.images.length === 0 && (
                  <p className="text-xs text-red-500 font-body">Please upload at least 1 image.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="luxury-label">Product Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="luxury-input text-sm" placeholder="e.g. Royal Diwali Hamper" />
                </div>
                <div>
                  <label className="luxury-label">Slug</label>
                  <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} disabled={!!editingSlug} className="luxury-input text-sm disabled:bg-beige-light/50" placeholder="royal-diwali-hamper" />
                </div>
                
                <div>
                  <label className="luxury-label">Price (₹)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="luxury-input text-sm" placeholder="2999" />
                </div>
                <div>
                  <label className="luxury-label">Discount Price (₹)</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="luxury-input text-sm" placeholder="2499 (optional)" />
                </div>

                <div>
                  <label className="luxury-label">Stock Quantity</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="luxury-input text-sm" placeholder="10" />
                </div>
                <div>
                  <label className="luxury-label">Category</label>
                  <select required name="category" value={formData.category} onChange={handleInputChange} className="luxury-input text-sm bg-white">
                    <option value="" disabled>Select a Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="luxury-label">Short Description</label>
                  <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} maxLength={200} className="luxury-input h-20 resize-none text-sm" placeholder="A brief one-line summary for the catalog..." />
                </div>
                
                <div className="col-span-2">
                  <label className="luxury-label">Tags (comma separated)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="luxury-input text-sm" placeholder="festive, luxury, chocolate" />
                </div>

                <div className="col-span-2 border-t border-beige pt-4 mt-2">
                  <label className="luxury-label block mb-3 text-xs uppercase tracking-wider text-charcoal/50">Product Status & Labels</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="accent-emerald w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isActive" className="text-sm font-body text-charcoal cursor-pointer select-none">
                        Active
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        className="accent-emerald w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-body text-charcoal cursor-pointer select-none">
                        Featured
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
                        className="accent-emerald w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isBestSeller" className="text-sm font-body text-charcoal cursor-pointer select-none">
                        Best Seller
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isNewArrival"
                        checked={formData.isNewArrival}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isNewArrival: e.target.checked }))}
                        className="accent-emerald w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isNewArrival" className="text-sm font-body text-charcoal cursor-pointer select-none">
                        New Arrival
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-beige">
                <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : editingSlug ? "Save Changes" : "Save Product"}
                </button>
                <button type="button" onClick={handleCloseForm} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
