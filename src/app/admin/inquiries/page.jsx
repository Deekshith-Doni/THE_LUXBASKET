"use client";
import { useState, useEffect } from "react";
import { Loader2, MessageSquare, RefreshCw, Mail, Phone, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const statusOptions = ["new", "contacted", "in_progress", "completed", "cancelled"];
const statusColors = {
  new: "text-blue-600 bg-blue-50 border-blue-200",
  contacted: "text-yellow-600 bg-yellow-50 border-yellow-200",
  in_progress: "text-purple-600 bg-purple-50 border-purple-200",
  completed: "text-emerald bg-emerald/10 border-emerald/20",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = () => {
    setLoading(true);
    fetch(`/api/admin/inquiries`)
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data.inquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status } : i)),
        );
        toast.success("Inquiry status updated");
      } else {
        toast.error("Failed to update status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Inquiries</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">
            {inquiries.length} messages received
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="btn-outline self-start flex items-center gap-2 py-2.5 px-4 text-xs"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">
              No inquiries found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-beige/50">
            {inquiries.map((inq) => (
              <div key={inq._id} className="p-6 hover:bg-beige-light/20 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Left Side: Contact Info */}
                  <div className="md:w-1/3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg text-charcoal font-semibold">{inq.name}</h3>
                      <span className="text-xs font-body text-charcoal/40">
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-2 text-sm font-body text-emerald hover:underline">
                        <Mail size={14} /> {inq.email}
                      </a>
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-2 text-sm font-body text-charcoal/70 hover:text-emerald">
                        <Phone size={14} /> {inq.phone}
                      </a>
                      {inq.company && (
                        <div className="flex items-center gap-2 text-sm font-body text-charcoal/70">
                          <Building2 size={14} /> {inq.company}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-xs font-body font-bold tracking-widest uppercase text-charcoal/40">Type:</span>
                      <span className="text-xs font-body capitalize bg-beige-light px-2 py-1 rounded text-charcoal/80">
                        {inq.type}
                      </span>
                    </div>
                  </div>

                  {/* Middle Side: Message Context */}
                  <div className="md:w-1/2">
                    <div className="bg-[#fcfcfb] border-l-2 border-gold p-4 h-full rounded-r">
                      <p className="text-sm font-body text-charcoal/80 whitespace-pre-wrap leading-relaxed">
                        {inq.message}
                      </p>
                      
                      {/* Extra context if provided */}
                      {(inq.budget || inq.quantity || inq.eventDate) && (
                        <div className="mt-4 pt-4 border-t border-beige/50 flex flex-wrap gap-4">
                          {inq.quantity && <span className="text-xs font-body text-charcoal/60"><strong>Qty:</strong> {inq.quantity}</span>}
                          {inq.budget && <span className="text-xs font-body text-charcoal/60"><strong>Budget:</strong> {inq.budget}</span>}
                          {inq.eventDate && <span className="text-xs font-body text-charcoal/60"><strong>Date:</strong> {new Date(inq.eventDate).toLocaleDateString()}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="md:w-1/6 flex flex-col justify-start items-end gap-3">
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq._id, e.target.value)}
                      disabled={updatingId === inq._id}
                      className={`text-xs font-body font-semibold px-3 py-1.5 border rounded-full cursor-pointer transition-colors ${statusColors[inq.status] || "text-gray-600 bg-gray-50"} disabled:opacity-50 w-full`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-white text-charcoal capitalize">
                          {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    
                    {updatingId === inq._id && (
                      <div className="flex justify-center w-full mt-2">
                        <Loader2 size={14} className="animate-spin text-gold" />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
