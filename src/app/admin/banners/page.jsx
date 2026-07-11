"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon, Upload, Pencil } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    mobileImage: "",
    link: "/",
    buttonText: "Shop Now",
    isActive: true,
  });

  const fetchBanners = () => {
    setLoading(true);
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        setBanners(data.banners || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        toast.success("Banner deleted");
      } else {
        toast.error("Failed to delete banner");
      }
    } catch (err) {
      toast.error("Error deleting banner");
    }
  };

  const handleEditClick = (banner) => {
    setEditingId(banner._id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      mobileImage: banner.mobileImage || "",
      link: banner.link || "/",
      buttonText: banner.buttonText || "Shop Now",
      isActive: banner.isActive,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      mobileImage: "",
      link: "/",
      buttonText: "Shop Now",
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Desktop Image is required");

    setIsSubmitting(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/banners/${editingId}` : "/api/banners";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(editingId ? "Failed to update banner" : "Failed to create banner");

      toast.success(editingId ? "Banner updated!" : "Banner created!");
      handleCloseForm();
      fetchBanners();
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
          <h1 className="font-heading text-3xl text-charcoal">Banners</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">Manage homepage hero carousel banners</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">No banners yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-beige-light/50">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Preview</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Details</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-b border-beige/50 hover:bg-beige-light/20">
                    <td className="px-5 py-4">
                      <div className="relative w-32 h-16 bg-beige-light rounded overflow-hidden">
                        {banner.image && <Image src={banner.image} alt={banner.title} fill className="object-cover" />}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-heading text-lg text-charcoal">{banner.title}</p>
                      <p className="text-xs font-body text-charcoal/50">{banner.subtitle}</p>
                      <p className="text-xs font-body text-emerald mt-1">Links to: {banner.link}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${banner.isActive ? 'bg-emerald/10 text-emerald' : 'bg-red-50 text-red-500'}`}>
                        {banner.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(banner)}
                          className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-emerald hover:border-emerald/50 transition-colors"
                          title="Edit Banner"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-red-500 hover:border-red-300 transition-colors"
                          title="Delete Banner"
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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && handleCloseForm()}>
          <div className="bg-white max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="font-heading text-2xl text-charcoal mb-6">{editingId ? "Edit Banner" : "Add Banner"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="luxury-label">Desktop Image (16:9)</label>
                  <div className="mt-2">
                    {formData.image ? (
                      <div className="relative w-full h-32 bg-beige-light border border-beige">
                        <Image src={formData.image} alt="Upload" fill className="object-cover" />
                        <button type="button" onClick={() => setFormData(p => ({ ...p, image: "" }))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><Trash2 size={12}/></button>
                      </div>
                    ) : (
                      <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "luxbasket_preset"} onSuccess={(res) => setFormData(p => ({...p, image: res.info.secure_url}))}>
                        {({ open }) => (
                          <button type="button" onClick={() => open()} className="w-full h-32 border-2 border-dashed border-beige flex flex-col items-center justify-center text-charcoal/50 hover:border-emerald hover:text-emerald transition-colors">
                            <Upload size={20} className="mb-2" />
                            <span className="text-xs font-body">Upload Desktop Image</span>
                          </button>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>
                </div>

                <div>
                  <label className="luxury-label">Mobile Image (9:16) (Optional)</label>
                  <div className="mt-2">
                    {formData.mobileImage ? (
                      <div className="relative w-24 h-32 bg-beige-light border border-beige mx-auto">
                        <Image src={formData.mobileImage} alt="Upload" fill className="object-cover" />
                        <button type="button" onClick={() => setFormData(p => ({ ...p, mobileImage: "" }))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><Trash2 size={12}/></button>
                      </div>
                    ) : (
                      <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "luxbasket_preset"} onSuccess={(res) => setFormData(p => ({...p, mobileImage: res.info.secure_url}))}>
                        {({ open }) => (
                          <button type="button" onClick={() => open()} className="w-full h-32 border-2 border-dashed border-beige flex flex-col items-center justify-center text-charcoal/50 hover:border-emerald hover:text-emerald transition-colors">
                            <Upload size={20} className="mb-2" />
                            <span className="text-xs font-body">Upload Mobile Image</span>
                          </button>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="luxury-label">Main Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} className="luxury-input text-sm" placeholder="e.g. The Festive Collection" />
                </div>
                <div>
                  <label className="luxury-label">Subtitle</label>
                  <input type="text" value={formData.subtitle} onChange={(e) => setFormData(p => ({...p, subtitle: e.target.value}))} className="luxury-input text-sm" placeholder="Celebrate with luxury..." />
                </div>
                <div>
                  <label className="luxury-label">Button Text</label>
                  <input required type="text" value={formData.buttonText} onChange={(e) => setFormData(p => ({...p, buttonText: e.target.value}))} className="luxury-input text-sm" placeholder="Shop Now" />
                </div>
                <div>
                  <label className="luxury-label">Button Link</label>
                  <input required type="text" value={formData.link} onChange={(e) => setFormData(p => ({...p, link: e.target.value}))} className="luxury-input text-sm" placeholder="/category/festive" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(p => ({...p, isActive: e.target.checked}))} className="accent-emerald w-4 h-4" />
                <label htmlFor="isActive" className="text-sm font-body text-charcoal">Banner is Active</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-beige mt-6">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : editingId ? "Save Changes" : "Save Banner"}
                </button>
                <button type="button" onClick={handleCloseForm} className="btn-outline w-full">
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
