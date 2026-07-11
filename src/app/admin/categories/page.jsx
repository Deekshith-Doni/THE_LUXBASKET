"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Tag, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        toast.success("Category deleted");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (err) {
      toast.error("Error deleting category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Image is required");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create category");
      
      toast.success("Category created!");
      setShowForm(false);
      setFormData({ name: "", description: "", image: "", isActive: true });
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Categories</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">Manage your store categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">No categories yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-beige-light/50">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Image</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Name / Slug</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-beige/50 hover:bg-beige-light/20">
                    <td className="px-5 py-4">
                      <div className="relative w-16 h-16 bg-beige-light rounded overflow-hidden">
                        {cat.image && <Image src={cat.image} alt={cat.name} fill className="object-cover" />}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-heading text-lg text-charcoal">{cat.name}</p>
                      <p className="text-xs font-body text-charcoal/50">/{cat.slug}</p>
                      <p className="text-xs font-body text-charcoal/70 mt-1 max-w-sm truncate">{cat.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${cat.isActive ? 'bg-emerald/10 text-emerald' : 'bg-red-50 text-red-500'}`}>
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(cat._id)} className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-red-500 hover:border-red-300 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-2xl text-charcoal mb-6">Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="luxury-label">Image</label>
                <div className="mt-2">
                  {formData.image ? (
                    <div className="relative w-full h-40 bg-beige-light mb-2 border border-beige">
                      <Image src={formData.image} alt="Upload" fill className="object-cover" />
                      <button type="button" onClick={() => setFormData(p => ({ ...p, image: "" }))} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"><Trash2 size={14}/></button>
                    </div>
                  ) : (
                    <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "luxbasket_preset"} onSuccess={(res) => setFormData(p => ({...p, image: res.info.secure_url}))}>
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="w-full h-32 border-2 border-dashed border-beige flex flex-col items-center justify-center text-charcoal/50 hover:border-emerald hover:text-emerald transition-colors">
                          <Upload size={24} className="mb-2" />
                          <span className="text-sm font-body">Upload Image</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  )}
                </div>
              </div>
              
              <div>
                <label className="luxury-label">Category Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="luxury-input text-sm" placeholder="e.g. Wedding Gifts" />
              </div>

              <div>
                <label className="luxury-label">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} className="luxury-input h-24 resize-none text-sm" placeholder="Category description..." />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(p => ({...p, isActive: e.target.checked}))} className="accent-emerald w-4 h-4" />
                <label htmlFor="isActive" className="text-sm font-body text-charcoal">Visible on store</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-beige mt-6">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
